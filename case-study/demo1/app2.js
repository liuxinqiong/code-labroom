// 有没有更直观的解决办法呢，巧妙利用js基本类型是按值传递的原理
var output = function (i) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
};

for (var i = 0; i < 5; i++) {
    output(i);  // 这里传过去的 i 值被复制了
}

console.log(new Date, i);