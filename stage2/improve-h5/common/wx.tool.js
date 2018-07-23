var wxTool = Object.create(null);

wxTool.is_weixin = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

wxTool.setTitle = (title)=> {
    var $body = $('body')
    document.title = title
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe class="hide" src="/favicon.ico"></iframe>').on('load', function () {
        setTimeout(function () {
            $iframe.off('load').remove()
        }, 0)
    }).appendTo($body)
}

// wx相关config设置，必须在ready前提下才可以，比如设置微信分享

var funcs = [], isReady = false
wx.ready(() => {
    funcs.forEach(item => {
        item()
    })
    isReady = true
})

wxTool.setShare = options => {
    var defaultConfig = {
        imgUrl: '',
        link: '',
        desc: '',
        title: '',
        type: '',
        dataUrl: '',
        success: function() {

        },
        cancle: function() {

        }
    }
    // underscore api
    _extend(defaultConfig, options)
    var fn = function() {
        wx.onMenuShareAppMessage(defaultConfig);
        wx.onMenuShareTimeline(defaultConfig);
        wx.onMenuShareQQ(defaultConfig);
        wx.onMenuShareWeibo(defaultConfig);
    }
    if (isReady) {
        fn();
    } else {
        funcs.push(fn)
    }
}

// 选择图片，微信环境下使用微信api
wxTool.chooseSingleImg = (count = 1)=> {
    if (!wxTool.is_weixin()) {
        return new Promise((resolve, reject)=> {
            var inputFile = document.createElement("input")
            inputFile.setAttribute("type", "file");
            inputFile.addEventListener("change", function () {
                var file = this.files[0];
                //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件 
                if (!/image\/\w+/.test(file.type)) {
                    alert("请确保文件为图像类型");
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var baee64 = e.target.result;
                    resolve({
                        localId: baee64
                    });
                }

            });
            inputFile.click();
        });
    }


    return new Promise((resolve, reject)=> {
        wx.chooseImage({
            count, // 默认9
            sizeType: [/*'original',*/ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                const ids = res.localIds// res.localIds; 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                Promise.all(ids.map(item => wxTool.uploadImage(item))).then(values => {
                    if (ids.length > 1) {
                        resolve(values)
                    } else {
                        resolve(values[0])
                    }
                })
            }
        });
    });
};

// 上传
wxTool.uploadImage = function (localId) {
    return new Promise(resolve => {
        wx.uploadImage({
            localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                resolve({
                    localId,
                    serverId
                });
            }
        })
    })
}

export default wxTool;