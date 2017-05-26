/*
* @Author: Liu xinqiong
* @Date:   2017-03-13 16:20:21
* @Last Modified by:   Marte
* @Last Modified time: 2017-03-14 10:55:06
*/

'use strict';

var obj={name:'lxq',age:20};

function clone(origin){
    return Object.assign({},origin); //ES6
}
//console.log(clone(obj));

//复习ES5的知识
function Person(name){
    this.name=name;
}
console.log(Person.prototype);
console.log(Person.prototype.constructor);

var p=new Person('xq');

console.log(p.constructor==Person.prototype.constructor);
console.log(Person.prototype.__proto__==Object.prototype);
console.log(Object.prototype.__proto__);