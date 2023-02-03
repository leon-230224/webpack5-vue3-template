import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/index.css'
import { num } from '@/utils' // File 'xxx' is not a module.ts(2306), 这个报错是因为导入模块没有export任何东西
import App from '@/app.vue' // tsconfig.json中include配置env.d.ts是为了解决Cannot find module '@/app.vue' or its corresponding type declarations.ts(2307)报错，ts不认识vue文件

const app = createApp(App)
console.log(num,'num1')
app.use(ElementPlus, {
    locale
})

app.mount('#app')



let promise = new Promise(resolve => resolve(123))

promise.then(result => console.log(result,'hahaha3'))

class People {
    options: any
    constructor(options: any) {
        this.options = options
    }
    run() {
        console.log('run1')
    }
}

new People({}).run()