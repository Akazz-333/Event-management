let app, connectDB;

try {
  app = require('../dist/app').default || require('../dist/app');
  connectDB = require('../dist/config/db').connectDB;
} catch (e1) {
  try {
    app = require('./dist/app').default || require('./dist/app');
    connectDB = require('./dist/config/db').connectDB;
  } catch (e2) {
    try {
      app = require('../backend/dist/app').default || require('../backend/dist/app');
      connectDB = require('../backend/dist/config/db').connectDB;
    } catch (e3) {
      console.error('Failed to resolve app module:', e3);
    }
  }
}

module.exports = async (req, res) => {
  if (connectDB) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection error in Vercel handler:', err);
    }
  }
  if (app) {
    return app(req, res);
  }
  res.status(500).json({ error: 'Server initialization error' });
};
