function Vue(options) {
    var self = this
    this.data = options.data
    this.methods = options.methods

    // 代理 data 属性值
    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key)
    })

    // 监听数据变化
    observe(this.data)

    new Compile(options.el, this)

    // 调用钩子函数，且改写 this
    options.mounted.call(this)
}

Vue.prototype = {
    proxyKeys: function(key) {
        var self = this
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function() {
                return self.data[key]
            },
            set: function(newVal) {
                self.data[key] = newVal
            }
        })
    }
}