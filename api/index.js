const app = require('../backend/dist/app').default || require('../backend/dist/app');
const { connectDB } = require('../backend/dist/config/db');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
