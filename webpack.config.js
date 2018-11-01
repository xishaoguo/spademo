const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('yargs-parser')(process.argv.slice(2));
//console.log(argv)
const _mode = argv.mode || "development";
const _prodMode = (_mode == "production" ? true : false);
const _config = require(`./config/webpack.${_mode}.js`);
const merge = require("webpack-merge");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const { resolve } = require("path");
const setTitle = require('node-bash-title');
setTitle('🍻  这是' + _mode + "窗口");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
//const setIterm2Badge = require('set-iterm2-badge');
//setIterm2Badge('dddddd');有冲突，别乱用
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const smp = new SpeedMeasurePlugin();
/* let loading = {
  html:"加载中"
}; */
let webpackConfig = {
    module: {
        rules: [{
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        }
                    }
                },
            ],
        }, {
            test: /\.(png|jpg|gif|ttf|otf|svg)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10 * 1024
                }
            }]
        },{
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
            }]
        }]
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
optimization: {
    noEmitOnErrors: false,
        //namedChunks
        //moduleIds
        splitChunks: {
        cacheGroups: {
            commons: {
                chunks: 'initial',
                    name: "common",
                        minChunks: 2,
                            maxInitialRequests: 5,
                                minSize: 0
            }
        }
    },
    runtimeChunk: {
        name: "runtime"
    }
},
plugins: [
    new MiniCssExtractPlugin({
        filename: _prodMode ? "styles/[name].[contenthash:5].css" : "styles/[name].css",
        chunkFilename: _prodMode ? "styles/[id].[contenthash:5].css" : "styles/[id].css"
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'index.html',//默认生成的路径，生成到dist里
        template: 'src/index.html',//页面路径
        loading: '加载中...',
        minify: {
            removeComments: _prodMode,
            collapseWhitespace: _prodMode
        }
    }),
    new WebpackBuildNotifierPlugin({
        title: "webpack执行结果",
        logo: resolve("./src/yuyu_xiao.png"),
        suppressSuccess: true
    }),
    new ProgressBarPlugin(),
    new CleanWebpackPlugin("./dist")
]
}
module.exports = smp.wrap(merge(_config, webpackConfig));