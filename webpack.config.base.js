const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
        }
    },
    entry: './src/main.ts',
    output: {
        filename: 'js/[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Clean the output directory before emit.
        // publicPath: '' // 如果资源路径是相对路径，那么publicpath的值会拼接到资源路径中，一般找不到资源和这个值相关
    },
    /**
     * stats 选项让你更精确地控制 bundle 信息该怎么显示
     * errors-warnings | errors-only 等8个特定的预设选项给统计信息输出
     */
    stats: 'errors-warnings',//只在发生错误或有新的编译时输出显示log信息输出
    optimization: {
        runtimeChunk: 'single'
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // https://webpack.docschina.org/plugins/mini-css-extract-plugin 建议 mini-css-extract-plugin 与 css-loader 一起使用。
                        options: {
                          // 这里可以指定一个 publicPath
                          // 默认使用 webpackOptions.output中的publicPath
                          // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                          // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                        //   publicPath: './',
                          // publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|svg|jpeg?|gif)$/i,
                /**
                 * https://www.webpackjs.com/guides/asset-modules/
                 * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
                 * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
                 * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
                 * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
                 * 默认大于8k输出文件小于8k输出base64
                 */
                type: 'asset',
                /**
                 * 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中
                 * 修改默认8k文件大小比较值
                 */
                // parser: {
                //     dataUrlCondition: {
                //       maxSize: 50 * 1024,
                //     },
                // },
                generator: {
                    filename: 'images/[name][ext]',
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/, // 不需要对外部插件进行代码转换，会报错，modele.exports浏览器的错误，或者$ is not a function的错误
                use: {
                    /**
                     * 使用babel和webpack转译js文件
                     * @babel/core Babel核心包，本身只提供一个过程管理功能，把源代码es6转成抽象语法树（ast）
                     * @babel/preset-env Babel包预设，插件的合集，主要负责语法转换，把es6语法树转成es5语法树，
                     * 然后babel/core再把es5语法树重新生成es5代码
                     */
                    loader: 'babel-loader',
                    options: {
                    //     presets: [
                    //         // @babel/preset-env只能转译es6语法，对Map Set Promise等转译不了，需要用pollfill垫片
                    //         ['@babel/preset-env',
                    //         {
                    //             targets: {
                    //                 edge: 17,
                    //                 firefox: 60,
                    //                 chrome: 67,
                    //                 safari: 11.1
                    //               },
                    //             useBuiltIns: "usage",
                    //             corejs: "3.6.5"
                    //         }],
                    //     ]
                        cacheDirectory: true, //如果设置了一个空值 (loader: 'babel-loader?cacheDirectory') 或者 true (loader: 'babel-loader?cacheDirectory=true')，loader 将使用默认的缓存目录 node_modules/.cache/babel-loader
                        cacheCompression: true // 会使用 Gzip 压缩每个 Babel transform 输出,  如果你的项目中有数千个文件需要压缩转译，那么设置此选项可能会从中收益。
                    }
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader', /* https://github.com/TypeStrong/ts-loader */
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            // 注意这里的路径问题，按照自己项目来配置
                            // configFile: path.resolve(__dirname, './tsconfig.json'), // 如果项目包tsconfig.json not found，说明这里配置路径有问题
                            appendTsSuffixTo: [/\.vue$/],
                            /* 只做语言转换，而不做类型检查, 这里如果不设置成TRUE，就会HMR 报错 */
                            transpileOnly: true,
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: 'cli-service'
        }),
        /**
         * 必须指定output=》path，否则报错
         */
        new CleanWebpackPlugin(),
        /**
         * Error: vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config
         * vue-loader要配合VueLoaderPlugin一起使用 这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
         */
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isDev ? 'css/[name].css' : 'css/[name].[hash:8].css', // 分离样式文件
        }),
    ]
}