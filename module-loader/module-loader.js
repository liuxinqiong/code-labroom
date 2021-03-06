(function (root) {
    var modMap = {};

    // 在定义模块的时候是一个类似单词，而声明依赖的时候则有可能含有路径，这个变量存储着所有模块名和依赖这个模块时的声明。
    // 在use方法加载模块的时候将这些变量名添加到这个变量名之下，之后再define中进行转化，统一转换成路径
    var moduleMap = {};

    var cfg = {
        // 基础路径，初始化为当前页面路径
        baseUrl: location.href.replace(/(\/)[^\/]+$/g, function (s, s1) {
            return s1
        }),
        // 子路径，键值对
        paths: {}
    };

    // 完整路径
    var fullPathRegExp = /^[(https?\:\/\/) | (file\:\/\/\/)]/;
    // eg:'/path'
    var absoPathRegExp = /^\//;
    // eg:'./path'
    var relaPathRegExp = /^\.\//;
    // eg:'../path'
    var relaPathBackRegExp = /^\.\.\//;

    // 暴露的配置函数
    function config(obj) {
        if (obj) {
            if (obj.baseUrl) {
                // 默认当前文件路径
                obj.baseUrl = outputPath(cfg.baseUrl, obj.baseUrl);
            }
            if (obj.paths) {
                // 得到基础前缀
                var base = obj.baseUrl || cfg.baseUrl;
                for (var key in obj.paths) {
                    obj.paths[key] = outputPath(base, obj.paths[key]);
                }
            }
            // 合并对象
            merge(cfg, obj);
        }
    }

    // 对象合并的简单实现
    function merge(obj1, obj2) {
        if (obj1 && obj2) {
            for (var key in obj2) {
                obj1[key] = obj2[key]
            }
        }
    }

    // 得到实际路径的工具函数
    // 这里都是要匹配baseUrl的最后一个斜杠/，是因为提供的这个很有可能带有斜杠，也很有可能不带斜杠。
    function outputPath(baseUrl, path) {
        if (relaPathRegExp.test(path)) {
            if (/\.\.\//g.test(path)) {
                var pathArr = baseUrl.split('/');
                var backPath = path.match(/\.\.\//g);
                var joinPath = path.replace(/[(^\./)|(\.\.\/)]+/g, '');
                var num = pathArr.length - backPath.length;
                return pathArr.splice(0, num).join('/').replace(/\/$/g, '') + '/' + joinPath;
            } else {
                return baseUrl.replace(/\/$/g, '') + '/' + path.replace(/[(^\./)]+/g, '');
            }
        } else if (fullPathRegExp.test(path)) {
            return path;
        } else if (absoPathRegExp.test(path)) {
            return baseUrl.replace(/\/$/g, '') + path;
        } else {
            return baseUrl.replace(/\/$/g, '') + '/' + path;
        }
    }

    // 完成配置替换功能
    function replaceName(name) {

        if (name === null) {
            return name;
        }

        // eg: /path 才处理
        if (fullPathRegExp.test(name) || absoPathRegExp.test(name) || relaPathRegExp.test(name) || relaPathBackRegExp.test(name)) {
            return outputPath(cfg.baseUrl, name);
        } else {
            var prefix = name.split('/')[0] || name;
            // 判断是否存在对应配置，有完成替换，否则不处理
            if (cfg.paths[prefix]) {
                var endPath = name.split('/').slice(1).join('/');
                return outputPath(cfg.paths[prefix], endPath);
            } else {
                return outputPath(cfg.baseUrl, name);
            }
        }
    }

    // 得到模块名称
    function fixUrl(name) {
        return name.split('/')[name.split('/').length - 1]
    }

    function isFun(f) {
        return Object.prototype.toString.call(f).toLowerCase().indexOf('function') > -1;
    }

    function isArr(arr) {
        return Array.isArray(arr);
    }

    function isStr(str) {
        return typeof str === 'string';
    }

    function use(deps, callback) {
        if(!isArr(deps)){
            return;
        }
        if (deps.length === 0) {
            callback();
        }
        var depsLength = deps.length;
        // 保存每个模块返回的结果
        var params = [];
        for (var i = 0; i < deps.length; i++) {
            moduleMap[fixUrl(deps[i])] = deps[i];
            deps[i] = replaceName(deps[i]);
            (function (j) {
                loadMod(deps[j], function (param) {
                    depsLength--;
                    params[j] = param;
                    if (depsLength === 0) {
                        // 等到需要的模块都加载完之后，将每个模块的结果作为参数传递给主模块
                        callback.apply(null, params);
                    }
                })
            })(i)
        }
    }

    /**
     * v 1.0
     * 1. 假设这里所有的模块都没有依赖其他模块，只有主模块依赖
     * 2. 假设所有模块名和文件名一致，并且所有的js文件路径与页面文件路径一致。
     * v 1.1 
     * 1. 解决上述1的限制
     */
    function loadMod(name, callback) {
        console.log('modMap', modMap);
        if (!modMap[name]) {
            // 没有load则执行loadscript方法
            modMap[name] = {
                status: 'loading',
                oncomplete: []
            };
            console.log('initloading');
            loadscript(name, function () {
                // 加载完当前脚本后，模块里define方法也就执行完成了，此时deps有值了，继续加载依赖模块
                use(modMap[name].deps, function () {
                    // 依赖模块加载完毕，各模块的结果传递下去
                    execMod(name, callback, Array.prototype.slice.call(arguments, 0));
                })
            });
        } else if (modMap[name].status === 'loading') {
            // loading中则可以将callback推到一个数组中，等到loaded和代码执行完毕之后执行
            modMap[name].oncomplete.push(callback);
        } else if (!modMap[name].exports) {
            // 这种情况还蛮难存在的
            use(modMap[name].deps, function () {
                execMod(name, callback, Array.prototype.slice.call(arguments, 0));
            })
        } else {
            // 直接返回结果
            callback(modMap[name].exports);
        }
        // loadscript(name, function () {
        //     use(modMap[name].deps, function () {
        //         // 依赖加载完毕时将所有参数拷贝传递下去
        //         execMod(name, callback, Array.prototype.slice.call(arguments, 0));
        //     })
        // });
    }

    function execMod(name, callback, params) {
        // var exp = modMap[name].callback.apply(null, params);
        // callback(exp);
        var exp = modMap[name].callback.apply(null, params); // 模块加载的最终结果
        modMap[name].exports = exp; // 缓存起来
        callback(exp); //返回给use
        execComplete(name); //在加载的途中，存在继续被依赖和直接使用的情况，依次执行一下
    }

    function execComplete(name) {
        for (var i = 0; i < modMap[name].oncomplete.length; i++) {
            modMap[name].oncomplete[i](modMap[name].exports); //结果一次返回出去
        }
    }

    function loadscript(name, callback) {
        var doc = document;
        var node = doc.createElement('script');
        node.charset = 'utf-8';
        node.src = name + '.js';
        node.id = 'loadjs-js-' + (Math.random() * 100).toFixed(3);
        doc.body.appendChild(node);
        node.onload = function () {
            // var param = modMap[name].callback();
            // callback(param);
            callback();
        }
    }

    /**
     * v 1.0
     * 目的是定义模块
     * 1. 为了简便避免做类型判断，我们暂时规定所有的模块都必须定义模块名，不允许匿名模块的使用，
     * 2. 我们先暂且假设这里没有模块依赖。
     * v 1.1 
     * 1. 解决上述2的限制
     * 2. 假定所有的依赖都是独立的，
     * v 1.2
     * 1. 解决上述2的限制，之前的实现是基于一个模块只会被一个模块依赖的，如果被多个模块依赖的时候我们需要防止的是这个被依赖的模块中的callback被多次调用
     * 需要知道的是我们可以通过判断modMap中是否有相应的模块来判断是否模块加载，但是如果加载完毕再次使用use方法，则会再次执行该模块的代码，这是不对的
     * 因此我们需要将每个模块的exports缓存起来，以便我们再次调用。exports：用来缓存每个模块的结果
     * 模块在加载的过程中，会有几种状态呢？
     *  1. 没有load
     *  2. loading中
     *  3. load完毕但代码没有执行完成
     *  4. 代码执行完成这几种状态， 
     */
    function define(name, deps, callback) {

        // 参数缺省判断

        /*匿名模块*/
        if (!isStr(name)) {
            callback = deps;
            deps = name;
            name = null;
        }
        
         /*没有依赖*/
        if (!isArr(deps)) {
            callback = deps;
            deps = [];
        }

        if (moduleMap[name]) {
            name = moduleMap[name]
        }
        name = replaceName(name);
        deps = deps.map(function (ele, i) {
            return replaceName(ele);
        });

        modMap[name] = modMap[name] || {};
        modMap[name].deps = deps;
        modMap[name].status = 'loaded';
        modMap[name].callback = callback;
        modMap[name].oncomplete = modMap[name].oncomplete || [];
    }

    var loadjs = {
        define: define,
        use: use,
        config: config
    };

    root.define = define;
    root.loadjs = loadjs;
    root.modMap = modMap;
})(window)