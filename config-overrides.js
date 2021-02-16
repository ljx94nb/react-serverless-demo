/* eslint-disable */
const path = require('path');
const {
  override,
  fixBabelImports,
  addLessLoader,
  addPostcssPlugins,
  addWebpackAlias,
  removeModuleScopePlugin
} = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {}
  }),
  addPostcssPlugins([
    require('postcss-pxtorem')({
      rootValue: 16,
      propList: ['*'],
      minPixelValue: 2,
      selectorBlackList: ['am-']
    })
  ]),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src')
  }),
  removeModuleScopePlugin()
);
