const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('yargs-parser')(process.argv.slice(2));
//console.log(argv)
const _mode = argv.mode || "development";
const _prodMode = (_mode == "production"?true:false);
const _config = require(`./config/webpack.${_mode}.js`);
const merge = require("webpack-merge");
let webpackConfig = {
    module:{
        rules: [
            {
              test: /\.css$/,
              use: [{
                loader: MiniCssExtractPlugin.loader
              }, {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
              } ]
            }
        ]
    },
    devServer: {
      before(app) {
          app.get("/api/test", (req, res) => {
              res.json({
                  code: 200,
                  message: "Hello World"
              });
          });
      }
  },
    plugins: [
      new MiniCssExtractPlugin({
        filename: _prodMode?"styles/[name].[contenthash:5].css":"styles/[name].css",
        chunkFilename: _prodMode?"styles/[id].[contenthash:5].css":"styles/[id].css"
      }),
      new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'index.html',//默认生成的路径，生成到dist里
        template: 'src/index.html',//页面路径
        minify:{
          removeComments:_prodMode,
          collapseWhitespace:_prodMode
        }
      }) 
    ]
}
module.exports = merge(_config,webpackConfig);