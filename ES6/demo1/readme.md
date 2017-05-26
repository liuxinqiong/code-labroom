###普通对象和函数对象
普通对象与函数对象：凡是通过 new Function() 创建的对象都是函数对象，其他的都是普通对象。一下三种方式本质都是new Function
function f1(){};
var f2 = function(){};
var f3 = new Function('str','console.log(str)');
在JavaScript 中，每当定义一个对象（函数）时候，对象中都会包含一些预定义的属性。其中函数对象的一个属性就是原型对象 prototype。注：普通对象没有prototype,但有__proto__属性。
在JavaScript中，类的概念是由构造函数和其原型对象共同定义的。构造函数中负责构造每个对象特有的属性,而其原型对象中负责存放所有对象共有的属性

###prototype
JS对象的组成：
1.__proto__的内置属性，用于指向创建它的函数对象的原型对象prototype。
2.自身属性列表

###/prototype 与 _proto_ 的关系
_proto_是站在对象角度来说的
prototype 是站在构造函数角度来说的

###constructor
原型对象prototype中都有个预定义的constructor属性，用来引用它的函数对象。这是一种循环引用
person.prototype.constructor === person //true
Function.prototype.constructor === Function //true
Object.prototype.constructor === Object //true
ps:注意Person.constructor不等于Person.prototype.constructor.Function实例自带constructor属性,p.constructor===Person.prototype.constructor===Person,直接打印Person.constructor为 function Function() { [native code] }

###原型链
1.原型和原型链是JS实现继承的一种模型。
2.原型链的形成是真正是靠__proto__ 而非prototype

###new
a.创建一个空白对象
b.创建一个指向Person.prototype的指针，__proto__属性
c.将这个对象通过this关键字传递到构造函数中并执行构造函数。

###实现继承
a.Person.prototype = new Animal();
b.Person.prototype  = Animal.prototype;

###API
prototype:一般用来为一个类型建立它的原型继承对象。
getPropertyOf:Object.getPropertyOf(obj)是ES5中用来得到obj对象的原型对象的标准方法。
__proto__:obj.__proto__是一个非标准的用来得到obj对象的原型对象的方法。
Object.hasOwnProperty() 是否本身有有个属性