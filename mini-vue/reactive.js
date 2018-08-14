// let price = 5
// let quantity = 2
// let total = price * quantity

// price = 20
// console.log(total);

// 如何做到price修改，total自动修改呢，我们需要保存计算总数的方式

// var target = () => {
//     total = price * quantity
// }
// let storage = []
// function record() {
//     storage.push(target)
// }
// record()
// function replay() {
//     storage.forEach(run => run())
// }

// price = 20

// replay()

// console.log(total)


// 观察者模式
// class Dep {
//     constructor() {
//         this.subscribers = []
//     }
//     depend() {
//         if(target && !this.subscribers.includes(target)) {
//             this.subscribers.push(target)
//         }
//     }
//     notify() {
//         this.subscribers.forEach(sub => sub())
//     }
// }

// const dep = new Dep()
// let price = 5
// let quantity = 2
// let total = 0
// let target = null
// let target = () => { total = price * quantity }
// dep.depend()

// target() // 初始化

// 为何target不作为函数入参呢？上面的代码还是啰嗦了一点，进一步优化
// function watcher(myFunc) {
//     target = myFunc
//     dep.depend()
//     target()
//     target = null
// }

// watcher(() => { total = price * quantity })

// console.log(total)
// price = 20
// dep.notify()
// console.log(total)

// Object.defineProperty()
let data = {
    price: 5,
    quantity: 2
}

class Dep {
    constructor() {
        this.subscribers = []
    }
    depend() {
        if(target && !this.subscribers.includes(target)) {
            this.subscribers.push(target)
        }
    }
    notify() {
        this.subscribers.forEach(sub => sub())
    }
}

Object.keys(data).forEach(key => {
    let internalValue = data[key]
    const dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            console.log(`Gettting ${key}:${internalValue}`)
            dep.depend()
            return internalValue
        },
        set(newVal) {
            console.log(`Settting ${key}:${newVal}`)
            internalValue = newVal
            dep.notify()
        }
    })
})

function watch(myFunc) {
    target = myFunc
    target()
    target = null
}

watch(() => { data.total = data.price * data.quantity })

data.price = 20

console.log(data.total)

// 学习来源：https://www.zcfy.cc/article/the-best-explanation-of-javascript-reactivity