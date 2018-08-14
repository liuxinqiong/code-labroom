// what why how

// 知识点：作用域提升，函数级作用域

function test() {
    var a 
    console.log(a)
    if(false) {
        a = 123
    }
}
add(1,2)
// 方式1
function add(a, b) {
    return a + b
}

add(1,2)
// 方式2
var add = function(a, b) {
    return a + b
}

// TODO:思考如上两种方法定义函数的缺陷

var MathUtil = {
    age: 20,
    name: 'lxq',
    add: function() {
        return a + b
    },
    sub() {

    }
}

// 类比与面向对象的静态函数和属性
function MathUtil() {
    this.name = '123'
}
MathUtil.add = function(a, b) {
    return a + b
}

function MathUtil() {
    return {
        add: function() {
            return a + b
        }
    }
}
var a = MathUtil()
a.add(1, 2)

// 这种方式的缺陷

// 属性私有，方法共有
function MathUtil() {
    this.name = 'ethan'
    this.colors = ['red','yellow']
    this.add = function(a, b) {
        return a + b
    }
    this.sayName = function() {
        return this.name
    }
}

function Person(age) {
    this.age = 20;
    this.sayAge = function() {
        return this.age
    }
}

// call & apply
var object = {
    name: 'wd',
    sayName() {
        return this.name
    }
}
var other = {
    name: 'lxq'
}
object.sayName()
object.sayName.call(other)

// new 关键字到底做了什么
// 1. 创建对象
// 2. 将对象原型指向 Constructor.prototype
// 3. 执行构造函数（给对象赋值）
// 4. 返回对象

// 思考上述方式有何问题
function MathUtil() {
    this.name = 'ethan'
    this.colors = ['red','yellow']
}
MathUtil.prototype.add = function(a, b) {
    return a + b
}
MathUtil.prototype.sub = function(a, b) {
    return a - b
}

MathUtil.prototype = {
    // 修正
    constructor: MathUtil,
    add: function(){},
    sub: function(){}
}

// 在JavaScript中，函数是一等公民

// 扩展：以下语句直接执行会如何
function MathUtil() {
    this.name = 'ethan'
    this.colors = ['red','yellow']
}

// 安全模式
function MathUtil() {
    if(this instanceof MathUtil) {
        this.name = 'ethan'
        this.colors = ['red','yellow']
    } else {
        return new MathUtil()
    }
}

// 继承方式一：类式继承（原型链继承）
function SuperClass(id) {
    this.colors = ['red', 'yellow']
    this.superValue = true
}
SuperClass.prototype.getSuperVulue = function () {
    return this.superValue
}
function SubClass(name,age) {
    this.subValue = false
}
SubClass.prototype = new SuperClass()
SubClass.prototype.getSubValue = function() {
    return this.subValue
}

// 缺点：1. 父元素引用类型值被所有子元素公用 2. 无法向父类传参

// 继承方式2 构造函数继承
function SuperClass(id) {
    this.id = id
    this.colors = ['red', 'yellow']
    this.superValue = true
}
SuperClass.prototype.getSuperVulue = function () {
    return this.superValue
}
function SubClass(id) {
    SuperClass.call(this, id)
    this.subValue = false
}
SubClass.prototype.getSubValue = function() {
    return this.subValue
}

// 这种方式缺点：没有涉及到原型prototype

// 组合继承
function SuperClass(id) {
    this.id = id
    this.colors = ['red', 'yellow']
    this.superValue = true
}
SuperClass.prototype.getSuperVulue = function () {
    return this.superValue
}
function SubClass(id) {
    SuperClass.call(this, id)
    this.subValue = false
}
SubClass.prototype = new SuperClass()
SubClass.prototype.getSubValue = function() {
    return this.subValue
}

// 缺点：父类构造函数执行了两次，空间的浪费  ---> 最终解决方案: 只需要你的原型对象（不需要你的属性，只需要方法）

// 接下来看如何一步一步优化

// 原型式继承（根据已有对象创建新的对象）
var book = {
    name:'js',
    alikeBook:['html','css']
}

function inheritObject(o) {
    // F函数在某种情况下就可以理解成父亲实例
    function F() {} // 过渡函数，避免子元素原型影响到父原型
    F.prototype = o
    return new F()
}

// 相比类式继承，缺点全都有，由于是空对象，没有自己的属性和方法

// 寄生式继承
function createBook(obj) {
    var o = new inheritObject(obj)
    o.getName = function() {
        return this.name
    }
    return o
}

// 最终方案，寄生组合式继承
function inheritObject(o) {
    function F() {} // 过渡函数，避免子元素原型影响到父原型，空函数执行，降低性能浪费
    F.prototype = o
    return new F()
}
function inheritPrototype(SubClass, SuperClass) {
    var p = inheritObject(SuperClass.prototype)
    p.constructor = SubClass
    // SubClass.prototype = p
    // SubClass.prototype = SuperClass.prototype // 错误的，没有继承层级关系
}

function SuperClass(id) {
    this.id = id
    this.colors = ['red', 'yellow']
    this.superValue = true
}
SuperClass.prototype.getSuperVulue = function () {
    return this.superValue
}
function SubClass(id) {
    // 得到父亲属性
    SuperClass.call(this, id)
    this.subValue = false
}
// SubClass.prototype = new SuperClass() 造成缺点的关键
inheritPrototype(SubClass, SuperClass)
SubClass.prototype.getSubValue = function() {
    return this.subValue
}

// 扩展：参数传递
var object = {
    name: 1
}

function changeName(o) {
    o.name = 123
}