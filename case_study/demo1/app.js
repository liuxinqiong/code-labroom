for (var i = 0; i < 5; i++) {
	setTimeout(function() {
		console.log(new Date, i);
	}, 1000);
}

console.log(new Date, i);
//the result is 5 5 5 5 5
// 约定，用箭头表示其前后的两次输出之间有 1 秒的时间间隔，而逗号表示其前后的两次输出之间的时间间隔可以忽略
//the result is 5 -> 5,5,5,5,5