// 本地开发服务器 (生产环境用 Vercel 的 api/board.js,逻辑同源于 lib/news.js)
// 运行: node server.js  →  打开 http://localhost:8787
const http = require('http');
const fs = require('fs');
const path = require('path');
const { getBoard } = require('./lib/news');

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/api/board') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(await getBoard()));
    } catch (e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    if (err) { res.writeHead(500); return res.end('public/index.html missing'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('\n🍁 Canada Finance News  →  http://localhost:' + PORT + '\n');
  getBoard().then(d => console.log('  ✓ 预热完成,', d.board.reduce((n, c) => n + c.items.length, 0), '条')).catch(() => {});
});
