function isPC() {
    var sUserAgent = navigator.userAgent.toLowerCase()
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
    var bIsMidp = sUserAgent.match(/midp/i) == "midp"
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
    var bIsAndroid = sUserAgent.match(/android/i) == "android"
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"

    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        return true;
    }

    return false;
}

function scrollToElement({el, scroll}) {
    scroll.scrollTop = scroll.scrollTop + el.getBoundingClientRect().top
}

// 转换时间
function converDate(date) {
    if (Object.prototype.toString.call(date) === '[object String]') {
        return new Date(date.replace(/-/g, '/'))
    }
    if (Object.prototype.toString.call(date) === '[object Number]') {
        return new Date(date)
    }
    return date
}

export {
    isPC,
    scrollToElement,
    converDate
}