const app = require('../dist/app').default || require('../dist/app');
const { connectDB } = require('../dist/config/db');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
