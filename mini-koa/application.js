const http = require('http')
const EventEmitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Application extends EventEmitter{
    constructor() {
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

    use(middleware) {
        this.middlewares.push(middleware)
    }

    compose() {
        return async ctx => {
            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext)
                }
            }

            const len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            }
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next)
            }
            await next()
        }
    }

    callback() {
        return (req, res) => {
            const ctx = this.createContext(req, res);
            const respond = () => this.responseBody(ctx);
            const onerror = (err) => this.onerror(err,ctx);
            const fn = this.compose();
            return fn(ctx).then(respond).catch(onerror);
        }
    }

    createContext(req, res) {
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    responseBody(ctx) {
        const content = ctx.body;
        if (typeof content === 'string') {
            ctx.res.end(content);
        } else if (typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    }

    onerror(err,ctx){
        console.log(2222);
        
        if(err.code === 'ENOENT'){
            ctx.status = 404;
        } else {
            ctx.status = 500;
        }
        const msg = err.message || 'Internal error';
        console.log(345);        
        ctx.res.end(msg);
        this.emit('error',err);
    }
}

module.exports = Application