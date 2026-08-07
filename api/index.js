const { connectDB } = require('../backend/dist/config/db');
let app;

try {
  app = require('../backend/dist/app').default || require('../backend/dist/app');
} catch (e1) {
  try {
    app = require('../dist/app').default || require('../dist/app');
  } catch (e2) {
    app = require('./dist/app').default || require('./dist/app');
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (e) {}

  return app(req, res);
};
