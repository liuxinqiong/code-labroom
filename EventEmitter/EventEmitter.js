const toString = Object.prototype.toString;

// [object Object] => Object
const isType = obj => toString.call(obj).slice(8, -1).toLowerCase();

const isArray = obj => Array.isArray(obj) || isType(obj) === 'array';

const isNullOrUndefined = obj => obj === null || obj === undefined;

const _addListener = function (type, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn must be a function');
    }

    fn.context = context;
    fn.once = !!once;

    const event = this._events[type];
    if (isNullOrUndefined(event)) {
        this._events[type] = fn;
    } else if (typeof event === 'function') {
        this._events[type] = [event, fn];
    } else if (isArray(event)) {
        this._events[type].push(fn)
    }

    return this;
}

class EventEmitter {
    constructor() {
        if (this._events === undefined) {
            this._events = Object.create(null)
        }
    }

    addListener(type, fn, context) {
        return _addListener.call(this, type, fn, context);
    }

    on(type, fn, context) {
        return this.addListener(type, fn, context);
    }

    once(type, fn, context) {
        return _addListener.call(this, type, fn, context, true);
    }

    emit(type, ...rest) {
        if (isNullOrUndefined(type)) {
            throw new Error('emit must receive at lease one argument');
        }
        const events = this._events[type];

        // 返回 false，告知没有触发
        if (isNullOrUndefined(events)) return false;

        // rest 实现事件参数传递
        if (typeof events === 'function') {
            events.call(events.context || null, rest);
            if (events.once) {
                this.removeListener(type, events);
            }
        } else if (isArray(events)) {
            events.map(e => {
                e.call(e.context || null, rest);
                if (e.once) {
                    this.removeListener(type, e);
                }
            });
        }

        return true;
    }

    removeListener(type, fn) {
        // 为空直接返回
        if (isNullOrUndefined(this._events)) return this;

        // 没有指定类型，直接返回
        if (isNullOrUndefined(type)) return this;

        if (typeof fn !== 'function') {
            throw new Error('fn must be a function');
        }

        // 得到对应事件handle
        const events = this._events[type];

        // 不管是监听多少方法，都放到数组里是没必要像上面细分。但性能较差，只有一个方法时 key: fn 的效率比 key: [fn] 要高。
        if (typeof events === 'function') {
            events === fn && delete this._events[type];
        } else {
            // 为何直接 else，而不判断数组呢，实际情况只能是方法或数组，那为何判断函数而不是数组呢，因为 typeof 比 toString 效率要高，对于Array用typeof得到的只能是object
            const findIndex = events.findIndex(e => e === fn);

            if (findIndex === -1) return this;

            // match the first one, shift faster than splice
            if (findIndex === 0) {
                events.shift();
            } else {
                events.splice(findIndex, 1);
            }

            // just left one listener, change Array to Function
            if (events.length === 1) {
                this._events[type] = events[0];
            }
        }

        // 返回自身是为了链式调用
        return this;
    }

    removeAllListeners(type) {
        if (isNullOrUndefined(this._events)) return this;

        // if not provide type, remove all
        if (isNullOrUndefined(type)) this._events = Object.create(null);

        const events = this._events[type];
        if (!isNullOrUndefined(events)) {
            // check if `type` is the last one
            if (Object.keys(this._events).length === 1) {
                this._events = Object.create(null);
            } else {
                delete this._events[type];
            }
        }

        return this;
    }

    listeners(type) {
        if (isNullOrUndefined(this._events)) return [];

        const events = this._events[type];
        // use `map` because we need to return a new array 不去修改原本数据
        return isNullOrUndefined(events) ? [] : (typeof events === 'function' ? [events] : events.map(o => o));
    }

    listenerCount(type) {
        if (isNullOrUndefined(this._events)) return 0;

        const events = this._events[type];

        return isNullOrUndefined(events) ? 0 : (typeof events === 'function' ? 1 : events.length);
    }

    eventNames() {
        if (isNullOrUndefined(this._events)) return [];

        return Object.keys(this._events);
    }
}

// export default EventEmitter;