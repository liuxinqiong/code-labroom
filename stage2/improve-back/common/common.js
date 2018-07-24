class common {
    setQueryString(name, value, url, isHashMode) {
        if (typeof name == 'undefined' || typeof value == 'undefined' || typeof url == 'undefined') {
            return url;
        }
        var reg = new RegExp("(^|&|\\?|#)" + name + "=([^&]*?)(&|#|$)"),
            tempHash = url.match(/#.*/) ? url.match(/#.*/)[0] : "";

        url = url.replace(/#.*/, "");
        if (isHashMode === true) {
            if (reg.test(tempHash)) {
                tempHash = tempHash.replace(reg, function (m, r1, r2, r3) {
                    return r1 + name + "=" + encodeURIComponent(value) + r3
                });
            } else {
                var separator = tempHash.indexOf("#") === -1 ? "#" : "&";
                tempHash = tempHash + separator + name + "=" + encodeURIComponent(value)
            }
            tempHash = tempHash.replace(reg, function (m, r1, r2, r3) {
                return r1 + name + "=" + encodeURIComponent(value) + r3
            })
        } else if (reg.test(url)) {
            url = url.replace(reg, function (m, r1, r2, r3) {
                return r1 + name + "=" + encodeURIComponent(value) + r3
            });
        } else {
            var separator = url.indexOf("?") === -1 ? "?" : "&";
            url = url + separator + name + "=" + encodeURIComponent(value)
        }
        return url + tempHash
    };

    IsNum(e) {
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {} else {
            if (window.event) {
                window.event.returnValue = false;
            } else {
                e.preventDefault(); //for firefox 
            }
        }
    }
}