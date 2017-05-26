/*
 * @Author: Marte
 * @Date:   2017-03-06 16:36:10
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-03-06 17:18:36
 */

'use strict';

function subsString(arr) {
    var b = [];
    var k = 0;
    for (var i = 0; i < arr.length; i++) {
        var temp1 = [];
        temp1[0] = arr[i];
        console.log(temp1);
        b[k++] = temp1;
        for (var j = i + 1; j < arr.length; j++) {
            var temp2 = copy(b[k - 1]);
            temp2.push(arr[j]);
            console.log(temp2);
            b[k++] = temp2;
        }
    }
    return b;
}

var a=[1,2,3,4,5,6,7,8,9];

console.log(subsString(a));

function isPrimitive(obj){
    return  typeof obj !== 'object';
}

function copy(obj){
    if(isPrimitive(obj)){
        return obj;
    }
    if(obj instanceof Array){
        var ary=[];
        for(var i=0;i<obj.length;i++){
            var t1=obj[i];
            if(isPrimitive(t1)){
                ary.push(t1);
            }else{
                ary.push(copy(t1));
            }
        }
        return ary;
    }else{
        var object={};
        var keys=Object.keys(obj);
        for(var j=0;j<keys.length;j++){
            var key=keys[j];
            var t2=obj[key];
            if(isPrimitive(t2)){
                object[key]=t2;
            }else{
                object[key]=copy(t2);
            }
        }
        return object;
    }
}