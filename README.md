# Award-System

Electric Power S&T Award Management System.

## Local Dev
```bash
cd backend && pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000   # Terminal 1
npm install --registry=https://registry.npmmirror.com
npx vite --port 5173                                           # Terminal 2
```
Open http://localhost:5173

## Cloud Deploy

### 1. Server (Ubuntu 20.04+, 2C4G)
Open port 80 in security group. Upload project:
```bash
scp -r award-system user@YOUR_IP:/home/user/
```

### 2. Install & Build
```bash
ssh user@YOUR_IP
cd /home/user/award-system
sudo apt update && sudo apt install -y python3-pip
cd backend && pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple && cd ..
npm install --registry=https://registry.npmmirror.com
npx vite build --outDir backend/static --emptyOutDir
```

### 3. Persistence (choose one)

**systemd (Ubuntu 20.04+):**
```bash
sudo cp deploy/award.service /etc/systemd/system/
sudo sed -i 's|/home/user|'$(pwd)'|g' /etc/systemd/system/award.service
sudo systemctl daemon-reload
sudo systemctl enable --now award
```

**supervisor (CentOS 7):**
```bash
sudo yum install -y supervisor
sudo cp deploy/award.conf /etc/supervisord.d/
sudo sed -i 's|/home/user|'$(pwd)'|g' /etc/supervisord.d/award.conf
sudo supervisorctl reread && sudo supervisorctl update
```

### 4. Access
http://YOUR_SERVER_IP
