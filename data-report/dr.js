/**
 * 在不懂背景的情况，确实有点摸不着头脑哇，就当是一个思路吧
 */

(function (window) {
    var curTimestamp = +new Date();
    var class2type = {}
    var toString = class2type.toString()
    var hasOwn = class2type.hasOwnProperty;

    // 生成class2type映射
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function (item, index) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    })

    var location = window.location;

    var cookieConfig = {
        raw: false, // 原始
        json: false,
        splitStr: '###'
    }

    var config = {
        reportUrl: 'localhost://dr.jsp',
        hostName: location.hostname,
        sessionExpiration: 30 * 60
    }

    var device = {
        ie: /msie (\d+\.\d+)/i.test(navigator.userAgent),
        cookieEnabled: navigator.cookieEnabled,
        javaEnabled: navigator.javaEnabled(),
        language: navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "",
        screen: (window.screen.width || 0) + "*" + (window.screen.height || 0),
        colorDepth: window.screen.colorDepth || 0, // 颜色深度
        net: function () {
            // 返回当前网络类型（部分浏览器可以）
            try {
                return navigator.connection.type
            } catch (e) {
                return 'unknown'
            }
        }(),
        type: function () {
            function isPC() {
                var userAgentInfo = navigator.userAgent;
                var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }

            // 返回当前来源类型（app内嵌网页也进行平台区分）
            if (!isPC()) {
                // App cookie会包含 TERMINAL
                var returnType = 'WAP'; // 默认浏览器
                commonUtil.each(cookieUtil.cookie(), function (i, v) {
                    if (i.indexOf('TERMINAL') > -1) {
                        returnType = v.toUpperCase().indexOf('ANDROID') > -1 ? 'Android' : 'IOS';
                        return false;
                    }
                });
                return returnType;
            } else {
                return 'PC'
            }
        },
        appVersion: function () {
            var version = '';
            commonUtil.each(cookieUtil.cookie(), function (i, v) {
                // app端将版本写在cookie中
                if (i.indexOf('TERMINAL') > -1) {
                    version = v.split(',')[1]
                    return false;
                }
            });
            return version;
        }
    }

    // 基础函数工具包
    var commonUtil = {
        isWindow(obj) {
            return obj != null && obj === obj.window;
        },
        isFunction(obj) {
            return this.type(obj) === "function";
        },
        isArray(arr) {
            return arr instanceof Array;
        },
        isArrayLike(obj) {
            // obj 必须有 length属性
            var length = !!obj && "length" in obj && obj.length;
            var typeRes = type(obj);
            // 排除掉函数和 Window 对象
            if (typeRes === "function" || isWindow(obj)) {
                return false;
            }
            return typeRes === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        },
        type(obj) {
            if (obj == null) {
                return String(obj)
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj
        },
        // 之所以要判断是不是 plainObject，是为了跟其他的 JavaScript对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回object。
        isPlainObject(obj) {
            var proto, Ctor;
            // 排除掉明显不是obj的以及一些宿主对象如Window
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }
            proto = Object.getPrototypeOf(obj);
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
        },
        each(obj, fn) {
            if (obj) {
                var i = 0
                if (this.isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        if (fn(i, obj[i]) === false)
                            break
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                            break
                        }
                    }
                }
            }
        },
        extend() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false

            // 如果第一个参数为布尔,判定是否深拷贝
            if (typeof target === "boolean") {
                deep = target
                target = arguments[1] || {}
                i++
            }

            //确保接受方为一个复杂的数据类型
            if (typeof target !== "object" && !util.isFunction(target)) {
                target = {}
            }

            //如果只有一个参数，那么新成员添加于mix所在的对象上
            if (i === length) {
                target = this
                i--
            }

            for (; i < length; i++) {
                //只处理非空参数
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name]
                        try {
                            copy = options[name] //当options为VBS对象时报错
                        } catch (e) {
                            continue
                        }

                        // 防止环引用
                        if (target === copy) {
                            continue
                        }
                        if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false
                                clone = src && Array.isArray(src) ? src : []

                            } else {
                                clone = src && this.isPlainObject(src) ? src : {}
                            }

                            target[name] = this.extend(deep, clone, copy)
                        } else if (copy !== void 0) {
                            target[name] = copy
                        }
                    }
                }
            }
            return target
        }
    }

    var cookieUtil = {
        // jquery cookie 源码 https://github.com/carhartl/jquery-cookie
        cookie(key, value, options) {
            var pluses = /\+/g;

            function encode(s) {
                return cookieConfig.raw ? s : encodeURIComponent(s);
            }

            function decode(s) {
                return cookieConfig.raw ? s : decodeURIComponent(s);
            }

            function stringifyCookieValue(value) {
                return encode(cookieConfig.json ? JSON.stringify(value) : String(value));
            }

            function parseCookieValue(s) {
                if (s.indexOf('"') === 0) {
                    // This is a quoted cookie as according to RFC2068, unescape...
                    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }

                try {
                    // Replace server-side written pluses with spaces.
                    // If we can't decode the cookie, ignore it, it's unusable.
                    // If we can't parse the cookie, ignore it, it's unusable.
                    s = decodeURIComponent(s.replace(pluses, ' '));
                    return cookieConfig.json ? JSON.parse(s) : s;
                } catch (e) {
                }
            }

            function read(s, converter) {
                var value = cookieConfig.raw ? s : parseCookieValue(s);
                return commonUtil.isFunction(converter) ? converter(value) : value;
            }

            // 写入
            if (arguments.length > 1 && !commonUtil.isFunction(value)) {
                options = commonUtil.extend({}, {
                    // domain: location.hostname,
                    path: '/',
                    expires: 90 // 默认90天过期
                }, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires,
                        t = options.expires = new Date();
                    t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path ? '; path=' + options.path : '',
                    // options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }


            // 读取
            var result = key ? undefined : {},
                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling Base.cookie().
                cookies = document.cookie ? document.cookie.split('; ') : [],
                i = 0,
                l = cookies.length;

            for (; i < l; i++) {
                var parts = cookies[i].split('='),
                    name = decode(parts.shift()),
                    cookie = parts.join('=');
                if (key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        },
        removeCookie: function (key, options) {
            // Must not alter options, thus extending a fresh object...
            this.cookie(key, '', commonUtil.extend({}, options, { expires: -1 }));
            return !this.cookie(key);
        },
        hasCookie: function (key) {
            var cookie;
            if (undefined === key) return false;
            cookie = this.cookie(key);

            // 排除 cookie 为 undefined的情况
            return cookie && cookie != 'undefined';
        }
    }

    var urlUtil = {
        param(key) {
            var value = '';
            var queryString = location.href.split('?')[1]; 
            if(queryString) {
                // 去除 hash
                queryString = queryString.replace(/#.*/, '');
                var keys = queryString.split('&'); 
                commonUtil.each(keys, function (k, v) {
                    var map = v.split('=');
                    if(map[0] === key) {
                        value = map[1]
                        return false;
                    }
                });
            }
            return value
        },

        findPid () {
            // 自行根据业务需要设置
            var pidMap = ["item", "id-", "/product/"],
                regArr, matchResult = '',
                reg;
            for (var i = 0; i < pidMap.length; i++) {
                reg = new RegExp(pidMap[i] + "[a-zA-Z0-9]+");
                regArr = window.location.href.match(reg);
                if (regArr && regArr.length > 0) {
                    matchResult = regArr[0].replace(pidMap[i], '');
                }
                if (matchResult) break;
            }
            return matchResult;
        }
    }

    var busniUtil = {
        // 处理img上报方式路径
        parseImgUrl(params) {
            var urlParams = [];
            util.each(params, function (k, v) {
                urlParams.push(`${k}=${encodeURIComponent(v)}`)
            })
            return config.reportUrl + '?' + urlParams.join('&')
        },
        unique() {
            var time = 'dr' + new Date().getTime(),
                i = 0;
            return function () {
                return time + (i++)
            }
        },
        // 生成 随机字符串 uuid
        generateUUID() {
            return 'xyxyxxxyxyxxxxxyxxxyxxxxxxxxyxxxxxxyyxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        getRandomStr() {
            return String(Math.random()).replace(/\d\.\d{4}/, '');
        },
        generateSectionId () {
            var a = this.getRandomStr;
            return (a() + a() + a()).substring(0, 32);
        },
        // session cookie
        generateSection() {
            var sectionArr = [];
            sectionArr.push(this.generateSectionId());
            // 初始化为同一个时间戳
            sectionArr.push(curTimestamp);
            sectionArr.push(curTimestamp);
            sectionArr.push('1')
            return sectionArr.join(cookieConfig.splitStr);
        },
        setSessionCookie: function () {
            cookieUtil.cookie('session', this.generateSection())
        },
        checkPtag: function (ptag) {
            return ptag && /^[0-9]+\.[0-9]+\.[0-9]+$/.test(ptag);
        },
        generatePprdByPtag: function (ptag) {
            // pprd cookie 设置
            var pprdCookie = cookieUtil.cookie('pprd'),
                tempCookie,
                pprdCookieOT = '',
                pprdCookieIN = '';

            ptag = ptag || urlUtil.param('ptag');

            // 读取cookie
            pprdCookie && function (pprdCookieArr) {
                pprdCookieOT = pprdCookieArr[0] ? pprdCookieArr[0].replace('OT.', '') : '';
                pprdCookieIN = pprdCookieArr[1] ? pprdCookieArr[1].replace('IN.', '') : '';
            }(pprdCookie.split('-'));

            // 读取 ptag
            if (this.checkPtag(ptag)) {
                if (device.appVersion().length > 0) {
                    // 在APP里，将web的上报改为APP的
                    ptag = '1' + ptag.substr(1);
                }
                switch (+ptag.charAt(1)) {
                    case 2:
                        pprdCookieOT = ptag;
                        break;
                    case 3:
                        pprdCookieIN = ptag;
                        break;
                    default:
                        break;
                }
            } else {
                // 待确认 是否需要清空
                /*
                 pprdCookieOT = '';
                 pprdCookieIN = '';
                 */
            }

            tempCookie = 'OT.' + pprdCookieOT + '-' + 'IN.' + pprdCookieIN;
            return tempCookie;
        },
        checkSessionCookie: function (sessionArr) {
            return commonUtil.isArray(sessionArr) && sessionArr.length === 4 && function (arr) {
                    return /^[0-9]{32}$/.test(arr[0]) && /^[0-9]{13}$/.test(arr[1]) && /^[0-9]{13}$/.test(arr[2]) && /\d/.test(arr[3]);
                }(sessionArr);
        },
        setPprdCookie(params) {
            cookieUtil.cookie('pprd', params.pprd);
        }
    }

    var defaultParams = commonUtil.extend({
        pId: urlUtil.findPid() || '',
        uuid: function () {
            if (!cookieUtil.hasCookie('uuid')) {
                cookieUtil.cookie('uuid', busniUtil.generateUUID())
            }
            return cookieUtil.cookie('uuid');
        }(),
        pprd: busniUtil.generatePprdByPtag(),
        screen: device.screen,
        net: device.net,
        type: device.type(),
        version: device.appVersion()
    }, function(){
        var session = cookieUtil.cookie('session'),
            sessionArr = [];
        if (!session || session == 'undefined') {
            busniUtil.setSessionCookie();
        } else {
            sessionArr = session.split(cookieConfig.splitStr);
            if (busniUtil.checkSessionCookie(sessionArr)) {
                // curTimestamp 每次页面刷新都会更新
                if ((curTimestamp - sessionArr[2]) / 1000 >= config.sessionExpiration) {
                    // session 已过期，重新生成
                    busniUtil.setSessionCookie();
                } else {
                    // 更新结束时间
                    sessionArr[2] = String(curTimestamp);

                    // sessionSeq + 1
                    sessionArr[3] = String(+sessionArr[3] + 1);

                    busniUtil.cookie('session', sessionArr.join(cookieConfig.splitStr));
                }
            } else {
                busniUtil.setSessionCookie();
            }
        }

        sessionArr = busniUtil.cookie('session').split(cookieConfig.splitStr);
        return {
            sessionID: sessionArr[0],
            sessionStart: sessionArr[1],
            sessionEnd: sessionArr[2],
            sessionSeq: sessionArr[3]
        }
    }())

    var DR = {
        isPvReported: false,
        report(params) {
            var url = util.parseImgUrl(params)
             // 全局变量防止gc回收
            var logDR = window['logDR'] || (window['logDR'] = {});
            var img = new Image()
            var uid = busniUtil.unique()
            logDR[uid] = img
            // 销毁对象
            img.onload = img.onerror = img.onabort = function () {
                img.onload = img.onerror = img.onabort = null
                img = null;
                delete logDR[uid]
            }
            img.src = `${url}&_${uid}`
        },
        pvReport(params) {
            this.isPvReported = true;
            params = util.extend({
                reportedType: 0, // pv上报
                url: location.href,
                refer: document.referrer
            }, defaultParams, params)
            busniUtil.setPprdCookie(params)
            this.report(params)
        },
        clickReport(params) {
            var pprd = params.pprd;
            params = util.extend({
                reportedType: 1, // 点击上报
                url: location.href,
                refer: document.referrer,
                pprd: pprd,
            }, defaultParams, params)
            if (device.appVersion().length > 0) {
                // 在APP里，将web的上报改为APP的
                params.pprd = '1' + params.pprd.substr(1);
            }
            this.report(params)
        }
    };

    var whenReady = (function(){
        var funcs = []; // 当获得事件时，要运行的函数
        var ready = false;

        // 当文档就绪时,调用事件处理程序
        function handler(e) {
            // 确保事件处理程序只完整运行一次
            if(ready) {
                return
            }
            if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
                return
            }

            for(var i = 0; i < funcs.length; i++) {
                funcs[i].call(document)
            }
            ready = true;
            funcs = null;
        }

        if(document.readyState === 'complete') {
            ready = true
        }

        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', handler, false);
            document.addEventListener('readystatechange', handler, false); //IE9+
            window.addEventListener('load', handler, false);
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', handler);
            window.attachEvent('onload', handler);
        }

        return function whenReady(fn) {
            if(ready) {
                fn.call(document)
            } else {
                funcs.push(fn)
            }
        }
    })()

    // 事件委托
    whenReady(function() {
        document.body.onclick = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, // for ie
                pprd;
            while(target && target !== document.body) {
                // 全局注册具有pprd属性的自动上报
                if(pprd = target.getAttribute('pprd')){
                    DR.clickReport({
                        pprd: pprd
                    })
                    break;
                }
                target = target.parentNode
            }
        }

        setTimeout(function() {
            // 500ms 自动执行上报
            if(!DR.isPvReported) {
                var input = document.getElementById('DR-input')
                // 初始为0
                if(!input || input.value == 0) {
                    DR.pvReport();
                    if(input) {
                        input.value = window.location.href
                    }
                } else {
                    console.log("back action don't report")
                }
            }
        }, 500)
    })

    // 支持各种模块加载器
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = DR;
    } else {
        if (typeof define === "function" && define.amd) {
            define('DR', [], function () {
                return DR;
            });
        }
    }

    // 注册全局变量
    if (typeof window === "object" && typeof window.document === "object") {
        window.DR = DR;
    }

})(window)