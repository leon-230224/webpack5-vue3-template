const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
    resolve: {
        // modules: [path.resolve('node_modules')], // 解析 第三方包 common，
        extensions: ['.js','.vue','.css','.json'],// 引入模块省略后缀名，按顺序优先从前向后查找
        alias: {
            "@": path.resolve(__dirname, 'src'),
        }
    },
    // 一个入口可能会对应多个代码块，一个代码块可能会对应多个文件
    entry: './src/main.ts',
    mode: isDev ? 'development' : 'production',
    output: {
        // 入口文件代码块名称
        filename: 'js/[name].[contenthash:8].js',
        // 非入口代码块的名称，有两个来源 1.代码分割 vendor、common等一些公共或者三方代码块
        // 懒加载 import方法加载模块：import().then(result => conosle.log(result)),这种懒加载打包之后的代码就是单独文件的代码叫chunkFilename
        // chunkFilename: 'js/[name].[contenthash:8].js',
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
        runtimeChunk: 'single', // //会将Webpack在浏览器端运行时需要的代码单独抽离到一个文件
        minify: [
            /**
             * webpack4默认要手动配置，5生产环境自动压缩js和css
             * css文件压缩，MiniCssExtractPlugin插件负责抽离css或者less文件，
             * 此插件用于压缩css文件，默认production只会压缩js文件
             */
            new OptimizeCssAssetsWebpackPlugin({})
        ]
    },
    externals: { // 外部扩展 
        // vue: 'Vue', // <script src="https://unpkg.com/vue@3.2.31/dist/vue.global.js" rel="stylesheet" type="text/javascript"></script> index.html中添加cdn，webpack不会打包配置的外部扩展
        // lodash: '_' // 这种方式有个问题，就是在cnd使不使用都会加载，如果不使用不加载，使用在加载，可以用HtmlWebpackExternalsPlugin这个插件
    },
    module: {
        // noParse: /jquery/, // 不去解析jquery中的依赖库，因为确定jquery是个单独的包，不依赖其他包
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
                    filename: 'images/[name][ext]', // 和outputPath配置互斥
                    // outputPath: 'images', // 指定输出图片的目录images目录，这个选项和filename互斥，filename中的images得去掉
                    /**
                     * /images中的/是必须的，加上是绝对路径，相对于根路径，不加就是相对于引用当前图片资源的当前文件的相对路径
                     * 在这里就是比如相对于css文件夹，路径就变成localhost:8080/css/images/logo.png
                     */
                    // publicPath: '/images' // 访问图片的话也需要去images目录里找，配图片资源路径
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            /**
             * 针对同一种文件可以配置多个loader，按照从右向左、从下到上的顺序执行
             * 比如：js文件需要先eslint校验语法规则，在用babel-loader转化语法，
             * 正常就需要eslint-loader写在上面，加enforce强制规定执行顺序
             */
            {
                test: /\.js$/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        enforce: 'pre' // previous，强制在其他loader前执行校验
                    }
                },
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
            title: 'cli-service',
            minify: { // 压缩
                removeAttributeQuotes: true, // 删除双引号
                collapseWhitespace: true, // 去掉空格，压缩
            },
            // hash: true // 插入文件hash
            // chunks: ['main']// 此参数会将数组中的代码块插入html中，'main'代码块中的代码块回插入html，一个代码块会对应多个文件
            // 如果是空数据就什么都不插入,多页应用比较适用
        }),
        /**
         * 必须指定output=》path，否则报错
         */
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"]
        }),
        /**
         * Error: vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config
         * vue-loader要配合VueLoaderPlugin一起使用 这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
         */
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isDev ? 'css/[name].css' : 'css/[name].[hash:8].css', // 分离样式文件
        }),
        /**
         * 将key作为全局变量，在文件中不用引入，可以直接使用即可
         * 缺点：不能全局引用也就是在window._找不到，插件将变量注入到函数执行上下文中，全局没有
         * 比如在html中不可用，想在全局用，可以用用expose-loader这个loader
         */
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        /**
         * 复制文件从from文件夹复制到to文件夹
         */
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './docs'),
                    to: path.resolve(__dirname, './dist/docs')
                }
            ]
        }),
        /**
         * --env=development覆盖mode默认赋值给process.env.NODE_ENV的值
         * 设置模块内全局变量
         * 编译打包的时候全局变量直接替换成真实的值
         */
        // new webpack.DefinePlugin({
        //     "process.env.NODE_ENV": env.development ? JSON.stringify("development") : JSON.stringify("production")
        // }),
        /**
         * externals: { // 外部扩展 
            // lodash: '_' // 这种方式有个问题，就是在cnd使不使用都会加载，如果不使用不加载，使用在加载，可以用HtmlWebpackExternalsPlugin这个插件
            },
            不用再html中手动引入cdn了
            外部扩展最优解决方案
         */
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'lodash',
        //             entry: 'https://cnd地址',
        //             global: '_' // 全局变量，在任意地方使用
        //         }
        //     ]
        // }),
        /**
         * moment时间库，有很多语言包，默认引入所有语言包，可以配置只引入中文语言包zh-cn，用ignore插件配置
         */
        new webpack.IgnorePlugin(/\.\/locale/,/moment/)// moment引入locale的时候忽略，不引入，可以在main.js中引入中文
    ]
}