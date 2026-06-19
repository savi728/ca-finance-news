// Vercel serverless 函数: GET /api/board
const { getBoard } = require('../lib/news');

module.exports = async (req, res) => {
  try {
    const data = await getBoard();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
