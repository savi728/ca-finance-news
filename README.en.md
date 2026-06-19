<div align="center">

# 🍁 Canada Finance News · 加拿大财经快讯

**A bilingual (EN / 中文) Canadian financial-news board, aggregated by industry sector — NewsNow-style.**
*See Canadian & North-American finance headlines across every sector, on one page.*

[English](./README.en.md) · [简体中文](./README.md)

[![Live Demo](https://img.shields.io/badge/Live-ca--finance--news.vercel.app-d63b3b?style=flat-square&logo=vercel&logoColor=white)](https://ca-finance-news.vercel.app)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/savi728/ca-finance-news)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
![No dependencies](https://img.shields.io/badge/dependencies-zero-green?style=flat-square)
![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?style=flat-square&logo=node.js&logoColor=white)

**🔗 [ca-finance-news.vercel.app](https://ca-finance-news.vercel.app)** — open and use, no login required

<table>
<tr>
<td width="50%"><img src="./assets/screenshot-dark.png" alt="dark mode, bilingual"><br><div align="center"><sub>🌙 Dark · Bilingual</sub></div></td>
<td width="50%"><img src="./assets/screenshot-light.png" alt="light mode, English"><br><div align="center"><sub>☀️ Light · English</sub></div></td>
</tr>
</table>

</div>

---

## ✨ Features

- 📊 **Sector-based board** — Macro, Energy, Banks, Mining, Tech, Real Estate, Cannabis, Crypto, all on one page
- 🌐 **Language toggle** — bilingual / English-only / Chinese-only; even the sector names switch (great for English-only readers)
- 🌙 **Light / Dark mode** — follows your system, one-click toggle, remembers your choice
- 📱 **Mobile-friendly** — horizontally scrollable sector nav at the top, tap to jump
- 🔗 **Shareable presets** — `?lang=en&theme=light` opens straight into English + light mode
- ⚡ **Zero dependencies** — plain vanilla JS + a single Node serverless function, auto-refreshes every 10 minutes
- 💸 **Zero cost** — RSS fetching + a free translation endpoint, no API key needed

## 🗂️ Sectors

| | Sector | Coverage |
|---|---|---|
| 🏛️ | Macro · Rates | Bank of Canada, interest rates, inflation, GDP, jobs, tariffs |
| 🛢️ | Energy · Oil & Gas | Crude, natural gas, oil sands, pipelines, Suncor / Cenovus / Enbridge |
| 🏦 | Banks · Finance | Big Five banks, mortgage rates, insurance, credit |
| ⛏️ | Mining · Materials | Gold, copper, uranium, potash, lithium, Barrick / Teck / Cameco |
| 💻 | Tech | Shopify, AI, semiconductors, startups |
| 🏠 | Real Estate | Home prices, mortgages, REITs, rental market |
| 🌿 | Cannabis | Canopy / Tilray / Aurora |
| ₿ | Crypto | Bitcoin, Ethereum, blockchain |

## 📰 Sources

CBC Business · Financial Post · The Globe and Mail (Business / Investing) · Mining.com · OilPrice · Investing.com

> All sourced from each outlet's public RSS feeds. This project only aggregates and links out — it stores nothing and reproduces no article body. All content remains the property of the original outlets.

## ⚙️ How it works

```
Fetch RSS → dedupe titles → translate titles via a free endpoint (cached) → bucket into sectors by keyword → multi-column board
                                                                                        ↑ refreshes every 10 min
```

- **Translation** uses a free endpoint — **zero cost, no API key**; results are cached, so only new titles are translated.
- **Bucketing** is keyword-based on title / summary, so a story can appear under more than one relevant sector.

## 🚀 Deploy

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/savi728/ca-finance-news)

After deploying, go to **Project Settings → Deployment Protection** and turn it off so friends can access it without logging in. Every `git push` afterwards redeploys automatically.

## 💻 Development

Requires Node ≥ 18. **No `npm install` needed** (zero third-party dependencies):

```bash
git clone https://github.com/savi728/ca-finance-news.git
cd ca-finance-news
node server.js        # → http://localhost:8787
```

## 🛠️ Customize

| What to change | Where |
|---|---|
| Add a news source | `FEEDS` at the top of `lib/news.js` |
| Edit sectors / keywords | `SECTORS` in `lib/news.js` |
| Change refresh interval | `CACHE_MS` in `lib/news.js` |
| Edit English sector names | the `EN` map in `public/index.html` |

## 📁 Structure

```
├── public/index.html   # front-end board (vanilla JS + CSS — theme / language / nav)
├── api/board.js        # Vercel serverless endpoint GET /api/board
├── lib/news.js         # core: fetch / translate / bucket (shared by local + prod)
├── server.js           # local dev server
└── vercel.json         # Vercel config
```

## 📄 License

[MIT](./LICENSE) © 2026 savi728

---

<div align="center">
<sub>Aggregated from public RSS feeds for personal quick-reading only. All content is the property of the original authors / outlets.</sub>
</div>
