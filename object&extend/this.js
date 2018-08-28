// 在JavaScript中，this是动态的，在定义的时候确定不了到底指向谁，只有等到函数调用的时候才能确定，this指向的是最终调用它的那个对象

/*
 * 一个函数上下文中确定this值的通用规则如下：在一个函数上下文中，this由调用者提供，由调用函数的方式来决定。如果调用括号()的左边是引用类型的值，this将设为引用类型值的base对象（base object），
 * 在其他情况下（与引用类型不同的任何其它属性），这个值为null。不过，实际不存在this的值为null的情况，因为当this的值为null的时候，其值会被隐式转换为全局对象。
 * 注：第5版的ECMAScript中，已经不强迫转换成全局变量了，而是赋值为undefined
*/

'strict';

function add(y){
	return this.x + y
}
x = 10
add(20)

// alert()

var obj = { x: 20 }
add.call(obj, 20, 30, 50)
add.apply(obj, [20, 30, 50])

var obj = {
	x: 100,
	print: function() {
		console.log(this.x)
	}
}

obj.print()

var f = obj.print
f()

var obj = {
	x: 100,
	y: {
		x: 200,
		print: function() {
			console.log(this.x)
		}
	}
}

obj.y.print()


// 如果去掉y中x:200呢

// 再来个例子
var point = {
	x: 15,
	y: 25,
	f: obj.y.print
}

point.f()

obj.y.print.call(point)

var x = 10
g = obj.y.print
g()

function test() {}

test.call()

// call和apply模拟实现
Function.prototype.call2 = function (context) {
  var context = context || window;
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args +')');
  delete context.fn
  return result;
}

Function.prototype.apply = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;
  var result;
  if (!arr) {
      result = context.fn();
  }
  else {
      var args = [];
      for (var i = 0, len = arr.length; i < len; i++) {
          args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result;
}


// 特殊
var value = 1;
var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}
console.log((foo.bar)())
console.log((foo.bar = foo.bar)());
console.log((false || foo.bar)());
console.log((foo.bar, foo.bar)());
console.log((true && foo.bar)());

// 非严格模式下， this 的值如果为 undefined，默认指向全局对象
var _global = 3
function test() {
	console.log(_global)
}
var b = {_global: 4}
var a = test.bind(b)
a()
(true && a)()
