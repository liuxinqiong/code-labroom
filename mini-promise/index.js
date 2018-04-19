// const p = new MyPromise(resolve => {
//     setTimeout(() => resolve('World'), 3000)
// })

// // 在 3000 ms 后打印 'Hello, World'
// p.then(res => new MyPromise(resolve => resolve(`Hello, ${res}`))).then(res => console.log(res))


run().catch(error => console.error(error.stack))

async function run() {
    const start = Date.now()
    await new MyPromise(resolve => setTimeout(() => {console.log(123); resolve()}, 3000))
    console.log('Elapsed time', Date.now() - start)
}