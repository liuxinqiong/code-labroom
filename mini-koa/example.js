const miniKoa = require('./application')
const app = new miniKoa();

let responseData = {};

// 没有调用next，后续均不会执行
// app.use(async ctx => {
//     console.log(1);
//     ctx.body = 'hello ' + ctx.query.name
// })

// 最开头增加一个错误捕获中间件，然后根据错误进行定制化的处理，这样才能将所有的后续中间件包裹在try-catch中
app.use(async (ctx, next) => {
    console.log(2);
    try {
        await next();
    } catch (err) {
        // 在这里进行定制化的错误处理
        console.log('catched');
    }
});

app.use(async (ctx, next) => {
    console.log(3);
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    console.log(4);
    responseData.age = 16;
    await next();
    
});

app.use(async (ctx,next) => {
    console.log(5);
    responseData.sex = 'male';
    await next()
    // throw new Error('ooops');    
});

app.use(async ctx => {
    console.log(6);
    // throw new Error('ooops');
});

app.on('error', (err) => {
    console.log(err.stack);
});

app.listen(3000, () => {
    console.log('listenning on 3000')
})