import Vue from 'vue'

// 这里踩了个坑，模版文件根元素不能直接v-for，否则构造函数执行有问题
const MessageBoxConstructor = Vue.extend(require('./message-box.vue'))

var instance, messages = []

// 单例模式
const getInstance = () => {
    if (!instance) {
        instance = new MessageBoxConstructor({
            el: document.createElement('div')
        })
    }
    return instance
}

// 为空的清除dom
const removeDom = () => {
    if (instance.$el && instance.$el.parentNode) {
        instance.$el.parentNode.removeChild(instance.$el);
    }
}

const MessageBox = function () {
    let instance = getInstance()
    // 加入响应式管理
    instance.messages = messages
}

MessageBox.prototype.notice = function (options = {}) {
    if(messages.length === 0) {
        document.body.appendChild(instance.$el)
    }
    let duration = options.duration || 3000;
    messages.unshift(options)
    Vue.nextTick(() => {
        options.timer = setTimeout(function() {
            var index = messages.findIndex(item => item === this)
            messages.splice(index, 1)
            if(messages.length === 0) {
                removeDom()
            }
        }.bind(options), duration);
    })
}

export default new MessageBox()