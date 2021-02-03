/* eslint-disable */
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app
    .use(
      '/baidu_api',
      proxy.createProxyMiddleware({
        target: 'http://api.map.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/baidu_api': ''
        }
      })
    )
    .use(
      '/district_api',
      proxy.createProxyMiddleware({
        target: 'http://restapi.amap.com',
        changeOrigin: true,
        pathRewrite: {
          '^/district_api': ''
        }
      })
    );
};
