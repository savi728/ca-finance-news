// 共享核心逻辑:抓取加拿大财经 RSS → 去重 → 翻译标题 → 按行业板块归类
// 被本地 server.js 和 Vercel api/board.js 共用

const FEEDS = [
  { name: 'CBC Business',        url: 'https://rss.cbc.ca/lineup/business.xml' },
  { name: 'Financial Post',      url: 'https://financialpost.com/feed/' },
  { name: 'Globe — Business',    url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/business/' },
  { name: 'Globe — Investing',   url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/investing/' },
  { name: 'Mining.com',          url: 'https://www.mining.com/feed/' },
  { name: 'OilPrice',            url: 'https://oilprice.com/rss/main' },
  { name: 'Investing.com',       url: 'https://www.investing.com/rss/news.rss' },
];

const SECTORS = [
  { key: 'macro',    label: '宏观·央行',   emoji: '🏛️', kw: ['bank of canada','boc','inflation','gdp','loonie',' cad ','interest rate','rate cut','rate hike','recession','unemployment','jobs report','tariff','economy','central bank','fed ','federal reserve'] },
  { key: 'energy',   label: '能源·油气',   emoji: '🛢️', kw: ['oil','gas','crude','lng','pipeline','oilsands','oil sands','energy','suncor','cenovus','enbridge','tc energy','petroleum','refinery','opec','wti','natural gas'] },
  { key: 'banks',    label: '银行·金融',   emoji: '🏦', kw: ['bank','rbc','td ','scotiabank','bmo','cibc','mortgage','lending','loan','credit','insurer','insurance','manulife','sun life'] },
  { key: 'mining',   label: '矿业·材料',   emoji: '⛏️', kw: ['mining','miner','gold','copper','silver','nickel','lithium','uranium','potash','barrick','teck','cameco','nutrien',' ore','metals','zinc','cobalt'] },
  { key: 'tech',     label: '科技',        emoji: '💻', kw: ['tech','shopify','software','ai ',' a.i.','artificial intelligence','semiconductor','chip','blackberry','lightspeed','nuvei','startup','cloud','data center','data centre'] },
  { key: 'realty',   label: '地产',        emoji: '🏠', kw: ['real estate','housing','home price','home sales','mortgage','reit','condo','property','realtor','housing market'] },
  { key: 'cannabis', label: '大麻',        emoji: '🌿', kw: ['cannabis','marijuana',' pot ','canopy','tilray','aurora','weed','thc'] },
  { key: 'crypto',   label: '加密',        emoji: '₿',  kw: ['crypto','bitcoin','ethereum','blockchain','btc','ether','coinbase','digital asset','stablecoin'] },
];

const CACHE_MS = 10 * 60 * 1000;

function decode(s = '') {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '').trim();
}
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
}
function parseRSS(xml, source) {
  const out = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    let link = tag(b, 'link');
    if (!link) { const m = b.match(/<link[^>]*href="([^"]+)"/i); link = m ? m[1] : ''; }
    const title = tag(b, 'title');
    if (!title) continue;
    const desc = tag(b, 'description') || tag(b, 'summary') || tag(b, 'content');
    const dateStr = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated');
    const ts = dateStr ? Date.parse(dateStr) : NaN;
    out.push({ title, link, source, desc: desc.slice(0, 220), ts: isNaN(ts) ? 0 : ts });
  }
  return out;
}

// ---- 标题翻译 (免费接口 + 永久缓存) ----
const trCache = new Map();
async function translate(text) {
  if (trCache.has(text)) return trCache.get(text);
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(9000) });
    const data = await res.json();
    const zh = (data[0] || []).map(seg => seg[0]).join('').trim();
    if (zh) trCache.set(text, zh);
    return zh || '';
  } catch (e) { return ''; }
}
async function translateAll(items) {
  const queue = items.slice();
  async function worker() { while (queue.length) { const it = queue.shift(); it.zh = await translate(it.title); } }
  await Promise.all(Array.from({ length: 6 }, worker));
}

async function fetchFeed(f) {
  try {
    const res = await fetch(f.url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (CanadaFinanceNews)' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return parseRSS(await res.text(), f.name);
  } catch (e) {
    console.error('  ⚠️  ' + f.name + ': ' + e.message);
    return [];
  }
}

let cache = { ts: 0, items: [] };
async function getAll() {
  if (Date.now() - cache.ts < CACHE_MS && cache.items.length) return cache.items;
  const all = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  const seen = new Set();
  const items = all.filter(i => { const k = i.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.ts - a.ts);
  // 只翻进入板块、会被展示的标题,减少翻译量
  const shown = items.filter(i => SECTORS.some(s => matchSector(i, s))).slice(0, 140);
  await translateAll(shown);
  cache = { ts: Date.now(), items };
  return items;
}
function matchSector(item, sec) {
  if (!sec.kw) return true;
  const hay = (item.title + ' ' + item.desc).toLowerCase();
  return sec.kw.some(k => hay.includes(k));
}

async function getBoard() {
  const all = await getAll();
  const board = SECTORS.map(s => ({
    key: s.key, label: s.label, emoji: s.emoji,
    items: all.filter(i => matchSector(i, s)).slice(0, 14)
      .map(i => ({ title: i.title, zh: i.zh || '', link: i.link, source: i.source, ts: i.ts })),
  }));
  return { updated: cache.ts, board };
}

module.exports = { getBoard, SECTORS, FEEDS };
