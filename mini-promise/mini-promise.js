class MyPromise {
    constructor(executor) {
        if (typeof executor !== 'function') {
            throw new Error('Executor must be a function');
        }

        // 初始状态为PENDING
        this.$state = 'PENDING'

        // 异步完成时需要调用的函数数组
        this.$chained = []

        // 构造成功函数
        const resolve = res => {
            // 不再处于 pending 状态（称为 settled 状态）时，多次调用无效
            if (this.$state !== 'PENDING') {
                return
            }

            // 如果 res 是 thenable，将锁定 promise 来保持跟 thenable 的状态一致
            // 一直处理到不是promise为止
            if(res != null && typeof res.then === 'function'){
                return res.then(resolve, reject)
            }

            this.$state = 'FULFILLED';
            // 存储结果
            this.$internalValue = res;

            // 依次调用通过then注册函数
            for (const {
                    onFulfilled
                } of this.$chained) {
                onFulfilled(res)
            }

        }

        // 构造失败函数
        const reject = err => {
            if (this.$state !== 'PENDING') {
                return
            }
            this.$state = 'REJECTED'
            // 存储错误
            this.$internalValue = err;
            for (const {
                    onRejected
                } of this.$chained) {
                onRejected(err)
            }
        }

        try {
            // 如果处理器函数抛出一个同步错误，我们认为这是一个失败状态
            // 需要注意的是，`resolve()` 和 `reject()` 只能被调用一次
            // 这里说明当我们创建new对象时，其实异步函数就已经执行了
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    /**
     * 使得可以链式调用
     * 1. then需要返回一个promise，且返回promise的executor的resolve和reject函数负责调用前promise的执行结果，这样才能传递下去
     * 2. 使得MyPromise对象的resolve能够处理 onFulfilled 返回 promise 的能力
     */

    // 注册回调函数，根据异步状态执行对应函数，如果异步没有完成，则将函数加入到调用链中
    then(onFulfilled, onRejected) {

        // 实现链式调用step1
        return new MyPromise((resolve, reject) => {

            // 重新封装 onFulfilled 和 onRejected

            const _onFulfilled = res => {
                try {
                    // 实现链式调用step2
                    resolve(onFulfilled(res))
                } catch (err) {
                    reject(err)
                }
            }

            const _onRejected = err => {
                try {
                    reject(onRejected(err))
                } catch (_err) {
                    reject(_err)
                }
            }

            // 可能已经处于settled状态，故直接读取值且执行函数
            if (this.$state === 'FULFILLED') {
                _onFulfilled(this.$internalValue)
            } else if (this.$state === 'REJECTED') {
                _onRejected(this.$internalValue)
            } else {
                // 还没完成，加入队列
                this.$chained.push({
                    onFulfilled: _onFulfilled,
                    onRejected: _onRejected
                })
            }
        })

    }
}