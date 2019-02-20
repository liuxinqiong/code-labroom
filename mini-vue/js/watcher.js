function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get() // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run()
    },
    run: function() {
        var value = this.vm.data[this.exp]
        var oldVal = this.value
        if(value !== oldVal) {
            this.value = value
            this.cb.call(this.vm, value, oldVal)
        }
    },
    get: function() {
        Dep.target = this
        var value = this.vm.data[this.exp] // 强制执行监听器里的 get 函数
        Dep.target = null // 同一个观察者只能添加一次
        return value
    }
}