// 期望代码的输出变成：5 -> 0,1,2,3,4,使用闭包
// 巧妙的利用 IIFE（Immediately Invoked Function Expression：声明即执行的函数表达式）来解决闭包造成的问题
for (var i = 0; i < 5; i++) {
    (function(j) {  // j = i
        setTimeout(function() {
            console.log(new Date, j);
        }, 1000);
    })(i);
}

console.log(new Date, i);