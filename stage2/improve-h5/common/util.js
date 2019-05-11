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

function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function isAnOrIp() {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        return 'ios'
    } else if (/android/.test(ua)) {
        return 'android'
    }
}

function openInApp() {
    if (isAnOrIp() == 'ios') {
        var appJson = {}
        location.href = `schema://url?appJson=${encodeURIComponent(JSON.stringify(appJson))}`

    } else if (isAnOrIp() == 'android') {
        var ifr = document.createElement("iframe");
        var appJson = {}
        ifr.src = `schema://hefei/android?appJson=${encodeURIComponent(JSON.stringify(appJson))}`
        ifr.style.display = "none";
        document.body.appendChild(ifr);
    }
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

// 下载跳转：iOS：https://itunes.apple.com/cn/app/id${appid} android 直接下载链接即可
// 平台判断：微信判断、iOS 判断、android 判断、PC 判断
// app 跳转：伪协议

export {
    isPC,
    scrollToElement,
    converDate
}