const Koa = require('koa')
const userRouter = require('./router/route.js')

const app = new Koa()

app.use(userRouter.routes())

// app.use((ctx,next)=>{
//     ctx.body = 'hello world'
// })

app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000");
})