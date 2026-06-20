# Award-System 使用指南

## 零基础入门

### 一、安装软件（一次）

1. Python: https://www.python.org/downloads/ → 下载安装，勾选 Add Python to PATH
2. Node.js: https://nodejs.org/ → 下载 LTS 版安装

### 二、拷贝项目
复制 award-system 文件夹到本机

### 三、安装依赖
`
cd Desktop\\award-system
npm install --registry=https://registry.npmmirror.com
cd backend
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
`

### 四、启动

窗口1-后端:
`
cd Desktop\\award-system\\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
`
窗口2-前端:
`
cd Desktop\\award-system
npx vite --port 5173
`

### 五、访问
浏览器打开 http://localhost:5173

## 功能说明
- 查询: 输入关键词+选年度/类型+点查询
- 导入: 点导入数据→上传Excel/PDF/Word
- 编辑/删除: 勾选行→点编辑或删除
- 导出: 不选则全部导出，选中则只导出选中
- 调列宽: 拖拽表头右边缘

## FAQ
- 页面空白: 检查两个窗口是否都在运行
- 端口占用: 关闭所有cmd窗口重开
- 换电脑: 拷贝文件夹→重复三、四步
- 备份: 复制 backend\\awards.db
