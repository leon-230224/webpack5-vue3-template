# webpack.ProvidePlugin
- 报错（(alias) namespace _
(alias) const _: import("/Users/wangxue/Desktop/webpack5-vue3-template/node_modules/.pnpm/@types+lodash@4.14.191/node_modules/@types/lodash/index.d.ts").LoDashStatic
export namespace _
“_”指 UMD 全局，但当前文件是模块。请考虑改为添加导入。ts(2686)）
- 解决：新建global.d.ts文件，写入
import _ from 'lodash';
declare global {
    const _: typeof _;
}

# 环境变量
1. cross-env 跨系统设置NODE_ENV,windows系统在package.json中是set NODE_ENV=development，linux系统export NODE_ENV=development
2. webpack-cli支持参数比如：--config --env，可以用--env development，或者用env.development文件