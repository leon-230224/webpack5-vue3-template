const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
module.exports = (env) => {
    return merge(baseConfig, {
        // mode: 'none',
        mode: 'production',
    })
}