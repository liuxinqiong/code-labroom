// loadjs.use(['a', 'b'], function (a, b) {
//     console.log('main');
//     console.log(a.add(1, 2));
//     console.log(b.equal(1, 2));
// })

// loadjs.use(['a'], function (a) {
//     console.log('main');
//     console.log(a.add(1, 2));
// })

loadjs.config({
    baseUrl: './static',
    paths: {
        app: './app'
    }
});

loadjs.use(['a', 'app/b'], function (a, b) {
    console.log('main');
    console.log(b.equil(1, 2));
    console.log(a.add(1, 2));
})