## 云南省企业就业失业数据采集系统

本目录存放课程作业的软件系统源码与运行说明。当前已完成第 3 天系统骨架搭建，采用“前后端分离的轻量化方案”，便于两周内快速完成可演示版本。

## 技术选型

- 后端：FastAPI + SQLite
- 前端：原生 HTML + CSS + JavaScript
- 配置管理：Git + GitHub

## 当前目录结构

```text
04_Source_Code/
├─ backend/
│  ├─ app/
│  │  ├─ api/routes/
│  │  ├─ core/
│  │  ├─ db/
│  │  └─ models/
│  └─ requirements.txt
├─ frontend/
│  ├─ assets/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
└─ README.md
```

## 后端已完成内容

1. FastAPI 应用入口与健康检查接口。
2. SQLite 数据库初始化脚本。
3. 认证、企业、就业、失业、统计五类路由骨架。
4. 默认演示账号与演示数据初始化。

## 前端已完成内容

1. 首页布局与展示框架。
2. 后端健康状态检测。
3. 统计概览卡片。
4. 企业样例数据列表。
5. 登录接口联调按钮。

## 本地运行方式

### 1. 启动后端

在仓库根目录执行：

```powershell
Set-Location 04_Source_Code/backend
e:/桌面/云南省企业就业失业数据采集系统/.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

后端启动后访问：

- 根地址：http://127.0.0.1:8000/
- 健康检查：http://127.0.0.1:8000/health
- 接口文档：http://127.0.0.1:8000/docs

### 2. 打开前端

直接在浏览器中打开 [frontend/index.html](frontend/index.html) 即可查看页面骨架。若需避免浏览器跨域或本地文件限制，可使用 VS Code Live Server 或任意静态文件服务打开 frontend 目录。

## 演示账号

- 用户名：admin
- 密码：admin123

## 下一阶段计划

1. 完成登录流程与权限逻辑细化。
2. 实现企业信息增删改查。
3. 实现就业与失业数据录入。
4. 完成查询筛选、统计展示与导出功能。

