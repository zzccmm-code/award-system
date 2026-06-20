import { useState, useEffect, useCallback, useRef } from "react";
import LoginPage from "./LoginPage";
import { useAuth, authFetch } from "./auth";
import { Table, Input, Select, Button, Space, Card, Tag, Typography, Row, Col, message, Upload, Modal, Progress, Form, Popconfirm } from "antd";
import { SearchOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined, FileExcelOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import "./App.css";

const { Title } = Typography;
const yearOptions = Array.from({ length: 15 }, (_, i) => 2026 - i);

interface AwardItem {
  id: number;
  project_name: string;
  award_year: number;
  award_type: string;
  award_level: string;
  completing_unit: string;
  completers: string;
  source: string;
}

interface ApiResponse {
  total: number;
  items: AwardItem[];
  page: number;
  page_size: number;
}

function App() {
  const [data, setData] = useState<AwardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState<AwardItem | null>(null);
  const [editForm] = Form.useForm();
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const { token, user, loading: authLoading, logout } = useAuth();

  const onResize = (key: string) => (_e: any, { size }: any) => {
    setColWidths(prev => ({ ...prev, [key]: Math.max(60, size.width) }));
  };

  const fetchAwards = useCallback(async (kw?, yr?, tp?, p?, ps?) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (kw !== undefined ? kw : keyword) params.set("keyword", kw !== undefined ? kw : keyword);
      if ((yr !== undefined ? yr : yearFilter) !== undefined) params.set("award_year", String(yr !== undefined ? yr : yearFilter));
      const cp = categoryFilter;
      if (cp) params.set("award_category", cp);
      params.set("page", String(p || page));
      params.set("page_size", String(ps || pageSize));
      const resp = await authFetch("/api/awards?" + params.toString());
      const json: ApiResponse = await resp.json();
      setData(json.items);
      setTotal(json.total);
    } catch {
      message.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, [keyword, yearFilter, typeFilter, page, pageSize]);

  const fetchTypes = useCallback(async () => {
    try {
      const resp = await authFetch("/api/awards/types");
      setTypeOptions(await resp.json());
    } catch {}
  }, []);

  useEffect(() => { if (token) { fetchAwards(); fetchTypes(); } }, [token]);

  const handleSearch = () => { setPage(1); fetchAwards(keyword, yearFilter, typeFilter, 1, pageSize); };
  const handleReset = () => { setKeyword(""); setYearFilter(undefined); setTypeFilter(undefined); setPage(1); fetchAwards("", undefined, undefined, 1, pageSize); };

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    const np = pagination.current || 1;
    const nps = pagination.pageSize || 10;
    setPage(np); setPageSize(nps);
    fetchAwards(keyword, yearFilter, typeFilter, np, nps);
  };

  useEffect(() => { if (token) { authFetch("/api/awards/categories").then(r => r.json()).then(setCategoryOptions).catch(()=>{}); } }, [token]);

  const downloadTemplate = async () => {
    try {
      const resp = await authFetch("/api/awards/template/download");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "award_import_template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch { message.error("Download template failed"); }
  };

  const handleExport = async () => {
    try {
      const resp = await authFetch("/api/awards/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRowKeys }),
      });
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "awards_export.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      message.success(selectedRowKeys.length > 0 ? "Exported " + selectedRowKeys.length + " items" : "Exported all");
    } catch { message.error("Export failed"); }
  };

  const handleEdit = (record: AwardItem) => {
    setEditRecord(record);
    editForm.setFieldsValue(record);
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const resp = await authFetch("/api/awards/" + editRecord!.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (resp.ok) {
        message.success('\u4fdd\u5b58\u6210\u529f');
        setEditModal(false);
        fetchAwards();
      } else {
        message.error('\u4fdd\u5b58\u5931\u8d25');
      }
    } catch { message.error('\u9a8c\u8bc1\u5931\u8d25'); }
  };

  const handleDelete = async (record: AwardItem) => {
    const resp = await authFetch("/api/awards/" + record.id, { method: "DELETE" });
    if (resp.ok) {
      message.success('\u5df2\u5220\u9664');
      setSelectedRowKeys(selectedRowKeys.filter(k => k !== record.id));
      fetchAwards();
    } else {
      message.error('\u5220\u9664\u5931\u8d25');
    }
  };

  const handleBatchDelete = async () => {
    for (const id of selectedRowKeys) {
      await authFetch("/api/awards/" + id, { method: "DELETE" });
    }
    message.success('\u5df2\u5220\u9664 ' + selectedRowKeys.length + ' \u6761');
    setSelectedRowKeys([]);
    fetchAwards();
  };



  const handleUpload = async (file: File, type: "excel" | "pdf") => {
    setUploading(true);
    setProgressPct(0);
    setProgressMsg("");

    if (type === "pdf" || type === "word") {
      const formData = new FormData();
      const rawFile = (file as any).originFileObj || file;
      formData.append("file", rawFile);
      try {
        setProgressMsg("Uploading file...");
        const resp = await authFetch("/api/awards/upload/file", { method: "POST", body: formData });
        const json = await resp.json();
        if (json.status !== "processing") { message.error("Start failed"); setUploading(false); return; }
        const tid = json.task_id; setTaskId(tid);
        const poll = setInterval(async () => {
          const pr = await authFetch("/api/awards/upload/pdf/progress/" + tid);
          const pj = await pr.json();
          if (pj.status === "processing") {
            setProgressPct(pj.total > 0 ? Math.round((pj.current / pj.total) * 100) : 0);
            setProgressMsg(pj.message || "");
          } else if (pj.status === "completed") {
            clearInterval(poll);
            const r = pj.result || {};
            message.success("Import OK: " + r.total + " records, " + r.saved + " new");
            setUploading(false); setUploadModal(false); setProgressPct(100); setTaskId(null); fetchAwards();
          } else if (pj.status === "failed") {
            clearInterval(poll);
            message.error("OCR failed: " + (pj.message || "unknown"));
            setUploading(false); setTaskId(null);
          }
        }, 1000);
      } catch { message.error("Upload failed"); setUploading(false); }
      return;
    }

    // Excel
    const formData = new FormData();
    const rawFile = (file as any).originFileObj || file;
    formData.append("file", rawFile);
    try {
      const resp = await authFetch("/api/awards/upload/excel", { method: "POST", body: formData });
      const result = await resp.json();
      if (result.status === "ok") {
        message.success("Import OK: " + result.total + " records, " + result.saved + " new");
        setUploadModal(false);
        fetchAwards();
      } else {
        message.error(result.detail || "Import failed");
      }
    } catch {
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    { title: "\u5e8f\u53f7", key: "index", width: 70, render: (_: unknown, __: unknown, index: number) => index + 1 + (page - 1) * pageSize },
    { title: "\u9879\u76ee\u540d\u79f0", dataIndex: "project_name", key: "project_name", ellipsis: true },
    { title: "\u83b7\u5956\u5e74\u5ea6", dataIndex: "award_year", key: "award_year", width: 100, sorter: (a: AwardItem, b: AwardItem) => b.award_year - a.award_year },
    { title: "\u5956\u52b1\u7c7b\u578b", dataIndex: "award_type", key: "award_type", width: 120, render: (text: string) => (<Tag color="blue">{text}</Tag>) },
    { title: "\u5956\u52b1\u7b49\u7ea7", dataIndex: "award_level", key: "award_level", width: 100 },
    { title: "\u5b8c\u6210\u5355\u4f4d", dataIndex: "completing_unit", key: "completing_unit", ellipsis: true },
    { title: "\u5b8c\u6210\u4eba", dataIndex: "completers", key: "completers", ellipsis: true },
    { title: "\u6388\u5956\u5355\u4f4d", dataIndex: "source", key: "source", width: 120 },
    { title: "\u5956\u52b1\u7ea7\u522b", dataIndex: "award_category", key: "award_category", width: 120 },
    {
      title: '\u64cd\u4f5c', key: 'actions', width: 120, fixed: 'right' as const,
      render: (_: unknown, record: AwardItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>{'\u7f16\u8f91'}</Button>
          <Popconfirm title={'\u786e\u5b9a\u5220\u9664\uff1f'} onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>{'\u5220\u9664'}</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

    if (authLoading) return null;
  if (!token) return <LoginPage />;
  return (
    <div className="app-container">
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Title level={2} className="header-title" style={{ margin: 0 }}>{"\u56fd\u7f51\u56db\u5ddd\u7535\u529b\u79d1\u6280\u5956\u52b1\u7ba1\u7406\u4fe1\u606f\u7cfb\u7edf"}</Title>
            <Button type="text" style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }} onClick={logout}>
              {"\u9000 \u51fa"}
            </Button>
          </div>
      </div>
      <Card className="search-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>{'\u7efc\u5408\u67e5\u8be2'}</div>
            <Input
              placeholder={'\u9879\u76ee\u540d\u79f0 / \u5355\u4f4d / \u4eba\u5458 / \u6765\u6e90'}
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={12} sm={12} md={4}>
            <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>{'\u5e74\u5ea6\u67e5\u8be2'}</div>
            <Select
              placeholder={'\u5168\u90e8\u5e74\u5ea6'}
              value={yearFilter}
              onChange={(val) => setYearFilter(val)}
              allowClear
              style={{ width: "100%" }}
            >
              {yearOptions.map((year) => (<Select.Option key={year} value={year}>{year}</Select.Option>))}
            </Select>
          </Col>
          <Col xs={12} sm={12} md={4}>
            <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>{'\u7b49\u7ea7\u67e5\u8be2'}</div>
            <Select
              placeholder={'\u5168\u90e8\u7c7b\u578b'}
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              allowClear
              style={{ width: "100%" }}
            >
              {typeOptions.map((type) => (<Select.Option key={type} value={type}>{type}</Select.Option>))}
            </Select>
          </Col>
          <Col xs={12} sm={12} md={3}>
            <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>{'\u5956\u52b1\u7ea7\u522b'}</div>
            <Select
              placeholder={'\u5168\u90e8\u7ea7\u522b'}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              allowClear
              style={{ width: "100%" }}
            >
              {categoryOptions.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>&nbsp;</div>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>{"\u67e5\u8be2"}</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>{"\u91cd\u7f6e"}</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card className="table-card">
        <div className="table-header">
          <span className="table-stats">{"\u5171 " + total + " \u6761\u8bb0\u5f55"}</span>
          <Space>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModal(true)}>{"\u5bfc\u5165\u6570\u636e"}</Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>{selectedRowKeys.length > 0 ? '\u5bfc\u51fa\u9009\u4e2d(' + selectedRowKeys.length + ')' : '\u5168\u90e8\u5bfc\u51fa'}</Button>
            {selectedRowKeys.length > 0 && (
              <>
                <Button icon={<EditOutlined />} disabled={selectedRowKeys.length !== 1} onClick={() => { const r = data.find(d => d.id === selectedRowKeys[0]); if (r) handleEdit(r); }}>{'\u7f16\u8f91'}</Button>
                <Popconfirm title={'\u5220\u9664 ' + selectedRowKeys.length + ' \u6761\uff1f'} onConfirm={handleBatchDelete}>
                  <Button danger icon={<DeleteOutlined />}>{'\u5220\u9664'}</Button>
                </Popconfirm>
              </>
            )}
          </Space>
        </div>
        <Table
          components={{
            header: {
              cell: (props: any) => {
                const { children, ...rest } = props;
                const colKey = rest.column?.key || rest.column?.dataIndex || '';
                const width = colWidths[colKey] || rest.width;
                  return (
                  <th {...rest} style={{ ...rest.style, width, position: 'relative' }}>
                    {children}
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startW = width || (e.currentTarget.parentElement as HTMLElement).offsetWidth;
                        const onMove = (ev: MouseEvent) => {
                          const w = Math.max(60, startW + (ev.clientX - startX));
                          setColWidths(prev => ({ ...prev, [colKey]: w }));
                        };
                        const onUp = () => {
                          document.removeEventListener('mousemove', onMove);
                          document.removeEventListener('mouseup', onUp);
                        };
                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                      }}
                    />
                  </th>
                );
              },
            },
          }}
          columns={columns}
          dataSource={data}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
          }}
          loading={loading}
          pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t: number) => "\u5171 " + t + " \u6761" }}
          onChange={handleTableChange}
          size="middle"
        />
      </Card>
      <Modal
        title={"\u5bfc\u5165\u6570\u636e"}
        open={uploadModal}
        onCancel={() => setUploadModal(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: "20px 0" }}>
          <h4>{'\u65b9\u5f0f\u4e00\uff1a\u4e0b\u8f7d\u6a21\u677f -> \u586b\u5199 -> \u4e0a\u4f20Excel'}</h4>
          {uploading && (
            <div style={{ marginBottom: 16 }}>
              <Progress
                percent={progressPct}
                status={progressPct === 100 ? "success" : progressPct > 0 ? "active" : undefined}
                format={() => taskId ? progressPct + "%" : "Uploading..."}
              />
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{progressMsg}</div>
            </div>
          )}
          <Space style={{ marginBottom: 20 }}>
            <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>{"\u4e0b\u8f7d\u6a21\u677f"}</Button>
            <Upload
              accept=".xlsx,.xls"
              showUploadList={false}
              beforeUpload={(file) => { handleUpload(file, "excel"); return false; }}
              disabled={uploading}
            >
              <Button type="primary" icon={<FileExcelOutlined />} loading={uploading}>{"\u4e0a\u4f20Excel"}</Button>
            </Upload>
          </Space>
          <h4>{'\u65b9\u5f0f\u4e8c\uff1a\u4e0a\u4f20PDF\uff08\u81ea\u52a8\u8bc6\u522b\uff09'}</h4>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={(file) => { handleUpload(file, "pdf"); return false; }}
            disabled={uploading}
          >
            <Button type="primary" icon={<FilePdfOutlined />} loading={uploading}>{"\u4e0a\u4f20PDF"}</Button>
          </Upload>
          <h4>{'\u65b9\u5f0f\u4e09\uff1a\u4e0a\u4f20Word\uff08\u81ea\u52a8\u8bc6\u522b\uff09'}</h4>
          <Upload
            accept=".docx"
            showUploadList={false}
            beforeUpload={(file) => { handleUpload(file, "word"); return false; }}
            disabled={uploading}
          >
            <Button type="primary" icon={<FilePdfOutlined />} loading={uploading}>{"\u4e0a\u4f20Word"}</Button>
          </Upload>
          <div style={{ marginTop: 12, color: "#888", fontSize: 12 }}>
            {"PDF\u8bc6\u522b\u9700\u8981\u4e00\u5b9a\u65f6\u95f4\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"}
          </div>
        </div>
      </Modal>
      <Modal
        title={'\u7f16\u8f91\u9879\u76ee'}
        open={editModal}
        onOk={handleSaveEdit}
        onCancel={() => setEditModal(false)}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="project_name" label={'\u9879\u76ee\u540d\u79f0'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="award_year" label={'\u83b7\u5956\u5e74\u5ea6'} rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="award_type" label={'\u5956\u52b1\u7c7b\u578b'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="award_level" label={'\u5956\u52b1\u7b49\u7ea7'}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="completing_unit" label={'\u5b8c\u6210\u5355\u4f4d'}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="completers" label={'\u5b8c\u6210\u4eba'}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="source" label={'\u6388\u5956\u5355\u4f4d'}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="award_category" label={'\u5956\u52b1\u7ea7\u522b'}>
                <Select allowClear placeholder={'\u9009\u62e9\u7ea7\u522b'}>
                  {categoryOptions.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
