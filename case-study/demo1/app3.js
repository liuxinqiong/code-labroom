for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
}

console.log(new Date, i);
//此时0,1,2,3,4正常打印，但是因为let声明的变量是块级作用域，因此最后一行会报错！