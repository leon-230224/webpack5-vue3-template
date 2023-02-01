const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
module.exports = (env) => {
    return merge(baseConfig, {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map', // sourcemap
        devServer: {
            open: true
        }
    })
}