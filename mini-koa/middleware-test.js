async function m1(next) {
    console.log('m1');
    await next();
}

async function m2(next) {
    console.log('m2');
    await next();
}

async function m3(next) {
    console.log('m3');
    await next();
}

// m2(async () => {await m3()});

let next1 = async function () {
    await m3();
}

m2(m3);


const middlewares = [m1, m2, m3];

function createNext(middleware, next) {
    return async () => {
        await middleware(next)
    }
}

async function next() {
    return Promise.resolve();
}

for (let i = middlewares.length - 1; i >= 0; i--) {
    next = createNext(middlewares[i], next)
}

function compose(middlewares) {
    return (...args) => {
        middlewares.reduce((prev, fn) => {
            return fn(...[].concat(prev));
        }, args)
    }
}

// var next = compose(middlewares)

// next();