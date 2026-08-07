let app;

try {
  app = require('../dist/app').default || require('../dist/app');
} catch (e1) {
  try {
    app = require('../backend/dist/app').default || require('../backend/dist/app');
  } catch (e2) {
    app = require('./dist/app').default || require('./dist/app');
  }
}

module.exports = app;
