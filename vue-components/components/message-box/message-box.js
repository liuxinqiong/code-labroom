import Vue from 'vue'

const MessageBoxConstructor = Vue.extend(require('./message-box.vue'))

let pool = [] // 已经创建元素加入池子，避免浪费

// 得到实例，优先从池子中取
const getInstance = () => {
    if (pool.length > 0) {
        let instance = pool[0];
        pool.splice(0, 1);
        return instance;
    }
    return new MessageBoxConstructor({
        el: document.createElement('div')
    })
}

// 已创建的元素回到池子中
const returnToPool = instance => {
    if (instance) {
        pool.push(instance)
    }
}

const removeDom = (instance) => {
    if (instance.$el && instance.$el.parentNode) {
        instance.$el.parentNode.removeChild(instance.$el);
    }
}

MessageBoxConstructor.prototype.close = function () {
    this.visible = false;
    removeDom(this)
    this.closed = true;
    returnToPool(this);
}

const MessageBox = {
    notice(options = {}) {
        let duration = options.duration || 3000;
        let instance = getInstance()
        instance.closed = false;
        clearTimeout(instance.timer);
        instance.message = options.message
        document.body.appendChild(instance.$el)
        Vue.nextTick(() => {
            instance.visible = true
            instance.timer = setTimeout(() => {
                if (instance.closed) return;
                instance.close()
            }, duration);
        })
    }
}

export default MessageBox