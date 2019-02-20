function Observer(data) {
    this.data = data
    this.walk(data)
}

Observer.prototype = {
    // 实现监听
    walk: function(data) {
        var self = this
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key])
        })
    },
    defineReactive: function(data, key, val) {
        // 维护一个 dep 列表
        var dep = new Dep()
        var childObj = observe(val); // 子对象递归
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter() {
                // 判断是不是一个观察者
                if(Dep.target) {
                    // get 的时候添加观察者列表
                    dep.addSub(Dep.target)
                }
                return val
            },
            set: function setter(newVal) {
                if(newVal === val) {
                    return;
                }
                val = newVal
                dep.notify() // 通知观察者列表，值已经发生改变
            }
        })
    }
}

function observe(value, vm) {
    if(!value || typeof value !== 'object') {
        return
    }
    return new Observer(value)
}

function Dep() {
    // 观察者列表
    this.subs = []
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub)
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update()
        })
    }
}

// 观察者实例
Dep.target = null