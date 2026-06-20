"""PDF OCR parser for award documents."""
import re, logging
logger = logging.getLogger(__name__)

def parse_pdf(file_path: str, scale: float = 1.5, progress_callback=None) -> list[dict]:
    # Try text-based extraction first
    try:
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            text_pages = [p.extract_text() for p in pdf.pages if p.extract_text() and len(p.extract_text().strip()) > 50]
            if text_pages:
                entries = _parse_award_text("\n".join(text_pages))
                if entries:
                    return entries
    except: pass

    # OCR fallback
    try:
        import pypdfium2 as pdfium, easyocr, numpy as np
        pdf = pdfium.PdfDocument(file_path)
        reader = easyocr.Reader(["ch_sim"], gpu=False, verbose=False)
        all_text = []
        for i in range(len(pdf)):
            if progress_callback:
                progress_callback(i + 1, len(pdf))
            page = pdf[i]
            bitmap = page.render(scale=scale).to_pil()
            np_img = np.array(bitmap)
            result = reader.readtext(np_img, paragraph=True)
            text = " ".join([item[1] for item in result])
            all_text.append(text)
        full_text = "\n".join(all_text)
        return _parse_award_text(full_text)
    except Exception as e:
        logger.error(f"OCR failed: {e}")
        return []

def _parse_award_text(text: str) -> list[dict]:
    # Fix common OCR garbles: 一等奖 → -等奖
    text = text.replace("-\u7b49\u5956", "\u4e00\u7b49\u5956")
    entries = []
    ym = re.search(r"(20[2-3]\d)", text)
    award_year = int(ym.group(1)) if ym else 2025
    provinces = ["\u897f\u85cf","\u65b0\u7586","\u5185\u8499\u53e4","\u5e7f\u897f","\u5b81\u590f","\u5317\u4eac","\u4e0a\u6d77","\u5929\u6d25","\u91cd\u5e86","\u9655\u897f","\u7518\u8083","\u9752\u6d77","\u56db\u5ddd","\u8d35\u5dde","\u4e91\u5357","\u5e7f\u4e1c","\u6d77\u5357","\u6e56\u5357","\u6e56\u5317","\u6cb3\u5357","\u6cb3\u5317","\u5c71\u4e1c","\u5c71\u897f","\u8fbd\u5b81","\u5409\u6797","\u9ed1\u9f99\u6c5f","\u6c5f\u82cf","\u6d59\u6c5f","\u5b89\u5fbd","\u798f\u5efa","\u6c5f\u897f"]
    source = "PDF\u5bfc\u5165"
    province_full = {
        "\u897f\u85cf": "\u897f\u85cf\u81ea\u6cbb\u533a",
        "\u65b0\u7586": "\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a",
        "\u5185\u8499\u53e4": "\u5185\u8499\u53e4\u81ea\u6cbb\u533a",
        "\u5e7f\u897f": "\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a",
        "\u5b81\u590f": "\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a",
        "\u5317\u4eac": "\u5317\u4eac\u5e02",
        "\u4e0a\u6d77": "\u4e0a\u6d77\u5e02",
        "\u5929\u6d25": "\u5929\u6d25\u5e02",
        "\u91cd\u5e86": "\u91cd\u5e86\u5e02",
    }
    for p in provinces:
        if p in text[:200]:
            source = province_full.get(p, p + "\u7701")
            break
    entries = _parse_generic_awards(text, award_year, source)
    return entries

def _parse_generic_awards(text: str, year: int, source: str) -> list[dict]:
    entries = []
    award_type = "\u79d1\u6280\u8fdb\u6b65\u5956"
    for kw, tp in [("\u81ea\u7136\u79d1\u5b66","\u81ea\u7136\u79d1\u5b66\u5956"),("\u6280\u672f\u53d1\u660e","\u6280\u672f\u53d1\u660e\u5956"),("\u79d1\u6280\u8fdb\u6b65","\u79d1\u6280\u8fdb\u6b65\u5956")]:
        if kw in text[:500]: award_type = tp; break
    level_kws = ["\u7279\u7b49\u5956","\u4e00\u7b49\u5956","\u4e8c\u7b49\u5956","\u4e09\u7b49\u5956","\u91d1\u5956","\u94f6\u5956","\u94dc\u5956"]
    lpos = []
    for kw in level_kws:
        pos = 0
        while True:
            idx = text.find(kw, pos)
            if idx == -1: break
            lpos.append((idx, kw))
            pos = idx + 1
    lpos.sort(key=lambda x: x[0])
    if not lpos:
        lpos.append((0, ""))
    ep = re.compile(r"(?:\u9879\u76ee|\u6210\u679c)\u540d\u79f0\s*[:]\s*(.+?)(?:\u5b8c\u6210\u5355\u4f4d\s*[:]\s*(.*?))?(?:\u5b8c\u6210\u4eba\s*[:]\s*(.*?))?(?=\u9879\u76ee\u540d\u79f0|\u6210\u679c\u540d\u79f0|$|\u5956\u52b1\u79cd\u7c7b|\u5956\u52b1\u7b49\u7ea7)", re.DOTALL)
    for pos, match in [(m.start(), m) for m in ep.finditer(text)]:
        name = (match.group(1) or "").strip()
        unit = (match.group(2) or "").strip() if match.lastindex and match.lastindex >= 2 else ""
        people = (match.group(3) or "").strip() if match.lastindex and match.lastindex >= 3 else ""
        if not name or len(name) < 4: continue
        cl = ""
        for lp, ln in lpos:
            if lp <= pos: cl = ln
            else: break
        entries.append({"project_name": re.sub(r"\s+"," ",name).strip()[:500],"award_year": year,"award_type": award_type,"award_level": cl,"completing_unit": re.sub(r"\s+"," ",unit).strip()[:500] if unit else "","completers": re.sub(r"\s+"," ",people).strip()[:500] if people else "","source": source})
    if not entries:
        entries = _parse_fallback(text, year, source, award_type)
    return entries

def _parse_fallback(text: str, year: int, source: str, award_type: str) -> list[dict]:
    entries = []
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    current_level = ""
    current_entry = None
    for line in lines:
        lm = re.search(r"(\u7279|\u4e00|\u4e8c|\u4e09)\u7b49\u5956", line)
        if lm: current_level = line[lm.start():lm.end()]; continue
        nm = re.search(r"(?:\u9879\u76ee|\u6210\u679c)\u540d\u79f0\s*[:]\s*(.+)", line)
        if nm:
            if current_entry and current_entry.get("name"):
                entries.append({"project_name": current_entry.get("name",""),"award_year": year,"award_type": award_type,"award_level": current_entry.get("level",""),"completing_unit": current_entry.get("unit",""),"completers": current_entry.get("people",""),"source": source})
            current_entry = {"name": re.sub(r"\s+"," ",nm.group(1)).strip()[:500],"level": current_level,"unit": "","people": ""}
            continue
        um = re.search(r"\u5b8c\u6210\u5355\u4f4d\s*[:]\s*(.+)", line)
        if um and current_entry: current_entry["unit"] = re.sub(r"\s+"," ",um.group(1)).strip()[:500]; continue
        pm = re.search(r"\u5b8c\u6210\u4eba\s*[:]\s*(.+)", line)
        if pm and current_entry: current_entry["people"] = re.sub(r"\s+"," ",pm.group(1)).strip()[:500]; continue
    if current_entry and current_entry.get("name"):
        entries.append({"project_name": current_entry.get("name",""),"award_year": year,"award_type": award_type,"award_level": current_entry.get("level",""),"completing_unit": current_entry.get("unit",""),"completers": current_entry.get("people",""),"source": source})
    return entries
