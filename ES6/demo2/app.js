function* genFuncWithReturn() {
	yield 'a';
	yield 'b';
	return 'The result';
}

function* logReturned(genObj) {
	let result = yield * genObj;
	console.log(result);
}

[...logReturned(genFuncWithReturn())]

function* longRunninigTask() {
	var value1 = yield step1();
	var value2 = yield step2(value1);
	var value3 = yield step3(value2);
	var value4 = yield step4(value3);
	console.log(value4);
}

function step1(val) {
	console.log(1,val);
}

function step2(val) {
	console.log(2,val);
}

function step3(val) {
	console.log(3,val);
}

function step4(val) {
	console.log(4,val);
}

function scheduler(task){
	setTimeout(function(){
		var taskObj=task.next(task.value);
		if(!taskObj.done){
			task.value=taskObj.value;
			scheduler(task);
		}
	},0);
}

scheduler(longRunninigTask());