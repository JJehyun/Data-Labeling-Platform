const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', { target: `http://172.30.1.80:5000/` })
  );
  app.use(
    createProxyMiddleware('/uploads', { target: `http://172.30.1.80:5001/` })
  );
};
