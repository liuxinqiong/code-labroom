const miniKoa = require('./application')
const app = new miniKoa();

// app.use(async ctx => {
//     ctx.body = 'hello ' + ctx.query.name
// })

let responseData = {};

// 最开头增加一个错误捕获中间件，然后根据错误进行定制化的处理
// app.use(async (ctx, next) => {
//     try {
//         await next();
//     } catch (err) {
//         // 在这里进行定制化的错误处理
//         console.log('catched');
//     }
// });

app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    console.log(123);
    responseData.sex = 'male';
    throw new Error('ooops');    
});

// app.use(async ctx => {
//     console.log(123);
//     throw new Error('ooops');
// });

app.on('error', (err) => {
    console.log(err.stack);
});

app.listen(3000, () => {
    console.log('listenning on 3000')
})