const list = [{
        type: 1,
        flag: true
    },
    {
        type: 2,
        flag: false
    },
    {
        type: 3,
        flag: true
    }
]

function getList(filter = bool(true)) {
    return list.filter(filter)
}

function bool(flag) {
    return function () {
        return !!flag;
    }
}

console.log(getList(bool(false)));

function pick(data, prop) {
    return data[prop];
}

function currying(func, ...args) {
    return func.bind(null, ...args)
}

// 可是要提前版定第二个参数咋办
function reverseArgs(...args) {
    return args.reverse();
}

// 再来一个函数组合 compose(fn1, fn2, fn3)(1) 相当于fn3(...fn2(...fn1(1)))
function compose(...fns) {
    return (...args) => {
        fns.reduce((prev, fn) => {
            return fn(...[].concat(prev));
        }, args)
    }
}

function sliceArgs(num, ...args) {
    return args.slice(0, num);
}

const sliceArgs2 = currying(sliceArgs, 2);

const reversePick = compose(sliceArgs2, reverseArgs, pick);

// const reversePick = compose(reverseArgs, pick);

const pickType = currying(reversePick, 'type');

function isEqual(x, y) {
    return x === y;
}

const isType1 = currying(isEqual, 1)
const isType2 = currying(isEqual, 2)
const isType3 = currying(isEqual, 3)

console.log(getList(function (data) {
    return isType1(pickType(data));
}))

console.log(getList(compose(pickType, isType1)));

function or(...fns) {
    return function (...args) {
        return fns.some(fn => fn(...args))
    }
}
// console.log(getList(compose(pickType, or(isType1, isType2))))

function not(fn) {
    return function (...args) {
        return !fn(...args)
    }
}

// console.log(getList(compose(pickType, not(isType1))))