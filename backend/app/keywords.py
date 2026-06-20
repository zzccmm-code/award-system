"""国网四川相关关键词过滤。
仅检查完成单位字段，如果有国网四川相关信息则加入系统。
"""

import logging

logger = logging.getLogger(__name__)

# 国网四川相关关键词
SICHUAN_KEYWORDS = [
    "国网四川",
    "国网四川省",
    "国网四川省电力公司",
    "国网四川省电力",
    "国网四川电力",
    "四川电力",
    "四川省电力公司",
    "四川省电力",
    "四川电网",
    "国网四川电网",
]


def is_sichuan_related(completing_unit: str) -> tuple[bool, list[str]]:
    """检查完成单位是否包含国网四川相关信息。

    Returns (is_related, matched_keywords)
    """
    if not completing_unit:
        return False, []

    matched = []
    for kw in SICHUAN_KEYWORDS:
        if kw in completing_unit:
            matched.append(kw)
    return len(matched) > 0, matched


# 保持向后兼容
is_power_related = is_sichuan_related
