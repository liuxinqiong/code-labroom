class Redpack {
    constructor() {
        this.left = leftArr[parseInt(Math.random() * COL)] + 'px';
        // 随机大小
        const scale = (Math.random() * (12 - 8 + 1) + 8) * 0.1
        this.transforms = `rotate(-45deg) scale(${scale})`
        this.durTime = (Math.random() * (2.5 - 1.2 + 1) + 1.2) + 's'
    }
}

// 红包5列
const COL = 5

const leftArr = (function(){
    var ret = []
    const width = document.documentElement.clientWidth || document.body.clientWidth
    const cell = width / COL
    let start = 0
    for(var i = 0; i < COL; i++) {
        ret.push(start)
        start += cell
    }
    return ret
})()

export default Redpack;