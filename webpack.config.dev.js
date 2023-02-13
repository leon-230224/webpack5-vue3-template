const { merge } = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.config.base')
module.exports = (env) => {
    return merge(baseConfig, {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map', // sourcemap
        devServer: {
            open: true,
            // 相当于之前的contentBase，静态资源访问路径，优先取output.path
            // 4.0版本中不是默认取output.path，默认是__dirname也就是当前项目文件夹，访问localhost:8080就会访问静态资源列表
            static: {
                // directory: path.join(__dirname, 'src/assets'),
            },
            // compress: true, // 开启压缩，请求头的Accept-Encoding: gzip, deflate, br。请求压缩文件，响应头Content-Encoding: gzip。
            // 服务器响应压缩文件，浏览器接手后解压缩
            // https: true, // 默认情况下，开发服务器将通过 HTTP 提供服务。可以选择使用 HTTPS 提供服务
            // 为所有响应添加 headers
            // headers: {
            //     'X-Custom-Foo': 'bar',
            // },
            port: 8080,
            hot: true,
            proxy: { // 代理转发，默认webpack-dev-serve开启8080端口，静态资源和默认请求都走这个端口，这里配置代理用node的http-proxy模块
                '/api': {
                  target: 'http://localhost:3000',
                  pathRewrite: { '^/api': '' }, // 如果不希望传递/api，则需要重写路径
                  changeOrigin: true,
                //   secure: false, // 默认情况下，将不接受在 HTTPS 上运行且证书无效的后端服务器,所以secure设置false
                },
            },
        },
        // target: 'web',
    })
}