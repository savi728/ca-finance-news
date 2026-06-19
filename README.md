# 🍁 加拿大财经快讯 · Canada Finance News

按**行业板块**聚合加拿大/北美财经新闻的**中英对照**快讯看板，一页平铺所有板块（NewsNow 风格）。

## 板块

🏛️ 宏观·央行 · 🛢️ 能源·油气 · 🏦 银行·金融 · ⛏️ 矿业·材料 · 💻 科技 · 🏠 地产 · 🌿 大麻 · ₿ 加密

## 数据来源

CBC Business · Financial Post · The Globe and Mail (Business / Investing) · Mining.com · OilPrice · Investing.com

后端抓取 RSS → 去重 → 标题免费翻译成中文 → 按关键词归类到板块。每 10 分钟刷新一次。

## 本地运行

```bash
node server.js     # 打开 http://localhost:8787
```

零依赖，只需 Node ≥ 18。

## 部署

已配置为 Vercel：`public/` 为静态页面，`api/board.js` 为 serverless 函数。连接本仓库到 Vercel 即可一键部署，之后 push 自动重新部署。

## 自定义

- 加新闻源：编辑 `lib/news.js` 顶部的 `FEEDS`
- 改板块 / 关键词：编辑 `lib/news.js` 的 `SECTORS`
