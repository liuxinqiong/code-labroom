function getParamter(name, url) {
    if (url === undefined) {
        url = location.href;
    }
    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)");
    var m = url.match(r);
    return (!m ? undefined : decodeURIComponent(m[2]));
}

function addParam(url, param, value) {
    // &amp; => &，利用 a 标签 search 属性
    var a = document.createElement('a'), regex = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/gi;
    var params = {}, match, str = [];
    a.href = url;
    while (match = regex.exec(a.search))
        if (encodeURIComponent(param) != match[1])
            str.push(match[1] + (match[2] ? "=" + match[2] : ""));
    str.push(encodeURIComponent(param) + (value ? "=" + encodeURIComponent(value) : ""));
    a.search = str.join("&");
    return a.href;
}

export {
    getParamter,
    addParam
}