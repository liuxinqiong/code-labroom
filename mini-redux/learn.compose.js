function compose(...funcs){
	if(funcs.length === 0 ){
		return arg => arg
	}
	if(funcs.length === 1){
		return funcs[0];
	}
	return funcs.reduce((ret,item)=> (...args) => ret(item(...args)))
}

// 仅支持打印原本数据
function originFun(target){
	console.log(target);
	return target;
}

// 我们增强它，如果是数组，大声说出来
function middlewareArray(origin){
	return function(next){
		console.log(next);
		return function(target){
			console.log('middlewareArray');
			if(Array.isArray(target)){
				console.log('I am a Array');
				return origin(target);
			}
			return next(target);
		}
	}
}

// 我们增强它，如果是数字，大声说出来
function middlewareNumber(origin){
	return function(next){
		console.log(next);
		return function(target){
			console.log('middlewareNumber');
			if(typeof target === 'number'){
				console.log('I am a Number');
				return origin(target);
			}
			return next(target);
		}
	}
}

function middlewareBoolean(origin){
	return function(next){
		console.log(next);
		return function(target){
			console.log('middlewareBoolean');
			if(typeof target === 'boolean'){
				console.log('I am a boolean');
				return origin(target);
			}
			return next(target);
		}
	}
}

// origin表示最原始的，next一开始也是原始的，然后就是被处理过的啦
var newOrigin = compose(middlewareNumber(originFun),middlewareArray(originFun),middlewareBoolean(originFun))(originFun);
// newOrigin(true);