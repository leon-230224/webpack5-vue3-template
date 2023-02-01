import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/index.css'
import App from '@/app.vue'

const app = createApp(App)

app.use(ElementPlus, {
    locale
})

app.mount('#app')



let promise = new Promise(resolve => resolve(1))

promise.then(result => console.log(result,'hahaha'))

class People {
    constructor(options) {
        this.options = options
    }
    run() {
        console.log('run')
    }
}

new People().run()