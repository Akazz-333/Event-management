const app = require('../backend/src/app').default || require('../backend/src/app');
const { connectDB } = require('../backend/src/config/db');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
