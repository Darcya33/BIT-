# 云南省企业就业失业数据采集系统技术方案 v0.1

## 1. 文档目的

本文件用于说明第 3 天系统骨架阶段的技术选型、系统结构、模块划分、数据设计方向与后续开发边界，作为项目计划书 v0.2 之后的技术落地补充材料。

## 2. 技术选型说明

### 2.1 后端技术选型

- 框架：FastAPI
- 语言：Python 3.12
- 数据库：SQLite

选择原因：

1. FastAPI 启动快、结构清晰、接口文档自动生成，适合课程项目快速迭代。
2. SQLite 零部署、适合本地演示，能够满足课程作业版数据量需求。
3. Python 技术栈配合 Agent 生成与修改代码效率较高，利于两周内完成交付。

### 2.2 前端技术选型

- 方案：原生 HTML + CSS + JavaScript

选择原因：

1. 无需额外 Node 工具链即可快速构建可展示页面。
2. 当前项目目标是形成可演示 MVP，不追求复杂工程化配置。
3. 结构简单，有利于快速联调和后续截图展示。

## 3. 总体架构

系统采用前后端分离的轻量架构：

1. 前端负责页面展示、基础交互和接口调用。
2. 后端负责认证、业务逻辑、数据存储与统计接口。
3. SQLite 负责本地持久化与样例数据承载。

## 4. 目录结构设计

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
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
└─ README.md
```

## 5. 后端模块划分

### 5.1 核心路由模块

1. auth：处理登录认证。
2. enterprises：处理企业信息管理。
3. employment：处理就业数据录入与查询。
4. unemployment：处理失业数据录入与查询。
5. stats：处理首页统计概览。

### 5.2 支撑模块

1. core/config：应用基础配置。
2. db/database：SQLite 初始化与连接管理。
3. models/schemas：接口请求数据模型。

## 6. 初步数据模型

当前阶段设计以下 4 张核心表：

1. users：用户信息与角色。
2. enterprises：企业基本信息。
3. employment_records：就业采集记录。
4. unemployment_records：失业采集记录。

后续若变更需求明确，可增加数据字典、操作日志或审核记录表。

## 7. 首轮接口规划

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| /health | GET | 健康检查 |
| /api/v1/auth/login | POST | 演示登录 |
| /api/v1/enterprises | GET | 查询企业列表 |
| /api/v1/enterprises | POST | 新增企业 |
| /api/v1/employment-records | GET | 查询就业记录 |
| /api/v1/employment-records | POST | 新增就业记录 |
| /api/v1/unemployment-records | GET | 查询失业记录 |
| /api/v1/unemployment-records | POST | 新增失业记录 |
| /api/v1/stats/overview | GET | 查询统计概览 |

## 8. 第 3 天交付边界

本阶段只完成“骨架可运行”，不追求业务完整性。交付边界包括：

1. 后端可启动。
2. 数据库可初始化。
3. 接口结构已形成。
4. 前端首页可打开并尝试调用后端。
5. README 已具备基础运行说明。

## 9. 后续开发方向

第 4 至第 8 天将在本骨架基础上继续实现：

1. 登录状态管理。
2. 企业信息增删改查完整流程。
3. 就业与失业数据表单录入与校验。
4. 查询筛选条件。
5. 统计卡片与导出功能。
6. 缺陷修复与课堂演示优化。