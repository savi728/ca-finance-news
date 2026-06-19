# 🍁 加拿大财经快讯 · Canada Finance News

> 按**行业板块**聚合加拿大 / 北美财经新闻的**中英对照**快讯看板——一页平铺所有板块，像 NewsNow 一样一屏看全。

**🔗 在线地址（点开即用，无需登录）：https://ca-finance-news.vercel.app**

---

## 这是什么

把加拿大主流财经媒体的实时新闻抓回来，**自动按行业归类**成 8 个板块，**标题翻译成中文**（保留英文原标题对照），平铺成多栏看板。每 10 分钟自动刷新，点标题跳转原文。

适合：想快速扫一眼加拿大各行业财经动向，又不想中英文来回切、不想一个个网站翻的人。

## 板块

| | 板块 | 覆盖内容 |
|---|---|---|
| 🏛️ | 宏观·央行 | 加拿大央行、利率、通胀、GDP、就业、关税 |
| 🛢️ | 能源·油气 | 原油、天然气、油砂、管道、Suncor / Cenovus / Enbridge |
| 🏦 | 银行·金融 | 五大行、房贷利率、保险、信贷 |
| ⛏️ | 矿业·材料 | 黄金、铜、铀、钾肥、锂、Barrick / Teck / Cameco |
| 💻 | 科技 | Shopify、AI、半导体、初创 |
| 🏠 | 地产 | 房价、房贷、REIT、租房市场 |
| 🌿 | 大麻 | Canopy / Tilray / Aurora |
| ₿ | 加密 | 比特币、以太坊、区块链 |

## 数据来源

CBC Business · Financial Post · The Globe and Mail（Business / Investing）· Mining.com · OilPrice · Investing.com

> 全部为各媒体公开 RSS。本项目只做聚合与跳转，不存储、不转载正文，版权归原媒体所有。

## 工作原理

```
RSS 抓取 → 标题去重 → 免费接口翻译标题(带缓存) → 关键词归类到板块 → 多栏看板
                                                            ↑ 每 10 分钟刷新
```

- **翻译**：走免费翻译接口，**零成本、无需 API key**；译文带缓存，只翻新增标题。
- **归类**：基于标题 / 摘要的关键词匹配，一条新闻可同时出现在多个相关板块。

## 技术栈

零框架、零依赖。`public/` 是纯静态页面，`api/board.js` 是 Vercel serverless 函数，核心逻辑都在 `lib/news.js`。本地用一个 Node 自带的 http 服务器跑，生产用 Vercel。

```
├── public/index.html   # 前端看板(原生 JS + CSS)
├── api/board.js        # Vercel serverless 接口 GET /api/board
├── lib/news.js         # 核心:抓取 / 翻译 / 归类(本地与线上共用)
├── server.js           # 本地开发服务器
└── vercel.json         # Vercel 配置
```

## 本地运行

需要 Node ≥ 18：

```bash
git clone https://github.com/savi728/ca-finance-news.git
cd ca-finance-news
node server.js          # 打开 http://localhost:8787
```

无需 `npm install`——没有任何第三方依赖。

## 自己部署一份

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 用 “Import Git Repository” 选中它，一键部署
3. 在 Project Settings 关掉 *Deployment Protection*，朋友才能免登录访问

之后每次 `git push`，Vercel 会自动重新部署。

## 自定义

- **加新闻源**：编辑 `lib/news.js` 顶部的 `FEEDS`，加一行 `{ name, url }` 即可
- **改板块 / 关键词**：编辑 `lib/news.js` 的 `SECTORS`，每个板块就是一组关键词
- **改刷新频率**：`lib/news.js` 里的 `CACHE_MS`

---

*聚合自各媒体公开 RSS，仅供个人快速浏览，所有内容版权归原作者 / 媒体所有。*
