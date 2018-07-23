module.exports = function(Vue) {
    Vue.filter("formatTime", (function () {
        const _format = function (date, fmt) { //author: meizz
            const monthEN = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'June',
                'July',
                'Aug',
                'Sept',
                'Oct',
                'Nov',
                'Dec',
            ][date.getMonth()]

            const o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
            for (const k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
            fmt = fmt.replace(/EEE/g, monthEN.toUpperCase()) // 英文月份
            fmt = fmt.replace(/eee/g, monthEN) // 英文月份
            return fmt
        }
        return function (date, fmt = 'yyyy-MM-dd') {
            if (isNull(date)) return ''
            date = util.converDate(date)
            return _format(date, fmt)
        }
    }()))

    Vue.filter('countdown', (function () {
        function fix(i) {
            return i < 10 ? '0' + i : i;
        }

        return function (time, curTime) {
            time = util.converDate(time).getTime()
            if (time < curTime) return 'error'
            var remain = (time - curTime) / 1000,
                h = parseInt(remain / 3600),
                m = parseInt(remain / 60 % 60),
                s = parseInt(remain % 60)

            if (h >= 24) {
                let t_d = Math.abs(h / 24);
                let day = parseInt(h / 24)
                return `${fix(day)}天 ${fix(h % 24)}:${fix(m)}:${fix(s)}`
            }

            h = h % 24

            return `${fix(h)}:${fix(m)}:${fix(s)}`

        }
    })())

    Vue.filter('addParams', (v, key, ...vals) => {
        return util.addParam(v, key, vals.join(''))
    })
}