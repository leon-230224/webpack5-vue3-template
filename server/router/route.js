const Router = require('koa-router')

const router = new Router()

// GET  /users/
router.get('/',(ctx,next)=>{
    ctx.body = "hello users"
})

router.get('/user',(ctx,next)=>{
    console.log('connect user')
    ctx.body = "用户登录成功"
})

module.exports = router