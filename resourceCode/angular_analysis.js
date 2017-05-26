/*
 * @Author: SKY
 * @Date:   2017-03-02 10:21:46
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-03-11 11:39:36
 * @function angular源码，1.体会严谨的思维 2.锻炼技术
 */

'use strict';


var dst = {
  name: "sky",
  age: 20
};

var src = {
  name: "sky1",
  sex: 1
};

//自定义异常
function BaseException() {}
BaseException.prototype = new Error();
BaseException.prototype.constructor = BaseException;
BaseException.prototype.toString = function() {
  // note that name and message are properties of Error
  return this.name + ": " + this.message;
};

function DataException(name, message) {
  this.name = name;
  this.message = message;
}
DataException.prototype = new BaseException();
DataException.prototype.constructor = DataException;


//Object对象详解
/**
 * Javascript提供一个原生对象Object对象，所有其他对象都继承自这个对象！
 * new Object()等同{}
 * 属性:
 * constructor  返回创建该对象的构造函数
 * prototype 返回创建该对象的函数的原型对象
 * 静态方法:
 * Object() 构造函数将任意数据包装为对象，返回一个与指定参数对应类型的对象。
 * keys(obj)返回一个由给定对象的所有可枚举自身属性的属性名组成的数组，数组中属性名的排列顺序和使用for-in循环遍历该对象时返回的顺序一致
 * values 返回一个包含指定对象所有的可枚举属性值的数组，数组中的值顺序和使用for…in循环遍历的顺序一样。
 * hasOwnProperty(x) 指示对象是否具有指定名称的属性。
 * isPrototypeOf(x)  指示对象是否存在于另一个对象的原型链中。
 * propertyIsEnumerable(x) 指示指定属性是否为对象的一部分以及该属性是否是可枚举的。
 * getOwnPropertyNames(obj)：返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性）组成的数组。
 * getPrototypeOf(object)：返回该对象的原型。
 * toLocaleString()  以字符串的形式返回值，该值适合于宿主环境的当前区域设置。
 * toString()  返回表示对象的字符串。
 * valueOf()
 */

//引用原型的方法
var
  slice = [].slice,
  splice = [].splice,
  push = [].push,
  toString = Object.prototype.toString,
  getPrototypeOf = Object.getPrototypeOf,
  hasOwnProperty = Object.prototype.hasOwnProperty;

//part1 常用基础方法封装
function isUndefined(value) {
  return typeof value === 'undefined';
}

function isDefined(value) {
  return typeof value !== 'undefined';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

//Object.getPrototypeOf 返回object参数的原型。原型也是对象。
function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !getPrototypeOf(value);
}

function isString(value) {
  return typeof value === 'string';
}

function isNumber(value) {
  return typeof value === 'number';
}

//Object.prototype.toString.call()
function isDate(value) {
  return toString.call(value) === '[object Date]';
}

function isFunction(value) {
  return typeof value === 'function';
}

function isRegExp(value) {
  return toString.call(value) === '[object RegExp]';
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isWindow(obj) {
  return obj && obj.window === obj;
}

function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}

function isFile(obj) {
  return toString.call(obj) === '[object File]';
}

function isFormData(obj) {
  return toString.call(obj) === '[object FormData]';
}

function isBlob(obj) {
  return toString.call(obj) === '[object Blob]';
}

function isTypedArray(value) {
  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
}

var isArray = Array.isArray;

function isArrayBuffer(obj) {
  return toString.call(obj) === '[object ArrayBuffer]';
}

/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike(obj) {

  // `null`, `undefined` and `window` are not array-like
  if (obj == null || isWindow(obj)) return false;

  // arrays, strings and jQuery/jqLite objects are array like
  // * jqLite is either the jQuery or jqLite constructor function
  // * we have to check the existence of jqLite first as this method is called
  //   via the forEach method when constructing the jqLite object in the first place
  if (isArray(obj) || isString(obj) || (jqLite && obj instanceof jqLite)) return true;

  // Support: iOS 8.2 (not reproducible in simulator)
  // "length" in obj used to prevent JIT error (gh-11508)
  var length = "length" in Object(obj) && obj.length;

  // NodeList objects (with `item` method) and
  // other objects with suitable length characteristics are array-like
  return isNumber(length) &&
    (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item == 'function');

}

//True if `value` is a DOM element (or wrapped jQuery element).
function isElement(node) {
  return !!(node &&
    (node.nodeName // we are a direct element
      || (node.prop && node.attr && node.find))); // we have an on and find method part of jQuery API
}

var lowercase = function(string) {
  return isString(string) ? string.toLowerCase() : string;
};
var uppercase = function(string) {
  return isString(string) ? string.toUpperCase() : string;
};

function toInt(str) {
  return parseInt(str, 10);
}

function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value && document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}

/**
 * 详解JSON.stringify
 * 参数
 * param1:对象或者数组
 * param2:用于转换结果的函数或数组
 * 如果第二个参数为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。
 * 如果第二个参数是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。当第一个参数也为数组时，将忽略第二个参数的数组。
 * param3:第三个参数也是可选的。它向返回值 JSON 文本添加缩进、空格和换行符以使其更易于读取。
 */
function toJson(obj, pretty) {
  if (isUndefined(obj)) return undefined;
  if (!isNumber(pretty)) {
    pretty = pretty ? 2 : null;
  }
  return JSON.stringify(obj, toJsonReplacer, pretty);
}

function fromJson(json) {
  return isString(json) ? JSON.parse(json) : json;
}

/**
 * [forEach description]
 * @param  {[type]} obj      [description]
 * @param  {[type]} iterator [description]
 * @param  {[type]} context  [description]
 * @return {[type]}          [description]
 * var values = {name: 'misko', gender: 'male'};
   var log = [];
   angular.forEach(values, function(value, key) {
   this.push(key + ': ' + value);
   }, log);
   我只能说这是一个非常牛逼的遍历方法，遍历的是object时，iterator参数表示value,key,obj,遍历是数组时，iterator参数表示value,index，obj。同时提供第三个参数用于指定iterator的上下文，也就是this
   好好体会设计思想！
   本质：对各种情况做for in回调！
 */
function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        // Need to check if hasOwnProperty exists,
        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
        if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      //原始类型
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) { //如果对象自带forEach方法，则调用自身的方法
      obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') { //确保有这个方法
      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

/**
 * [setHashKey description]
 * @param {[type]} obj [description]
 * @param {[type]} h   [description]
 * hash数组
 * JavaScript中的关联数组，关联数组因为有key值的索引，所以在数组查找中比较便利，同时也使得相应的代码算法实现显得更清晰，易读易维护.
 * 添加元素
 * myhash['new'] = 'newval';
 * 删除元素
 * delete myhash['new'];
 * 访问元素
 * myhash['new']; // 跟上键名就能访问
 * 遍历，不能使用常规for，必须使用超级for循环
 * for(var key in myhash)
 */
function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}

function baseExtend(dst, objs, deep) {
  var h = dst.$$hashKey;

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    //不是对象且不是方法，即忽略[如何传递方法进行合并呢]
    if (!isObject(obj) && !isFunction(obj)) continue;
    //直接得到对象的key方法
    //对应的还有对象的values方法
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (isDate(src)) {
          dst[key] = new Date(src.valueOf());
        } else if (isRegExp(src)) {
          dst[key] = new RegExp(src);
        } else if (src.nodeName) {
          dst[key] = src.cloneNode(true);
        } else if (isElement(src)) {
          //克隆对象
          dst[key] = src.clone();
        } else {
          if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        }
      } else {
        dst[key] = src;
      }
    }
  }

  setHashKey(dst, h);
  return dst;
}

//传递数组时，key其实就是数组下标，浅拷贝的话就是简单的赋值了
function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

//传递数组时，key其实就是数组下标，深拷贝可以针对数组按照下标一一对应对象进行拷贝
function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

function copy(source, destination) {
  var stackSource = [];
  var stackDest = [];

  if (destination) {
    if (isTypedArray(destination) || isArrayBuffer(destination)) {
      throw new DataException('cpta', "Can't copy! TypedArray destination cannot be mutated.");
    }
    if (source === destination) {
      throw new DataException('cpi', "Can't copy! Source and destination are identical.");
    }

    // Empty the destination object
    if (isArray(destination)) {
      destination.length = 0;
    } else {
      forEach(destination, function(value, key) {
        if (key !== '$$hashKey') {
          delete destination[key];
        }
      });
    }

    stackSource.push(source);
    stackDest.push(destination);
    return copyRecurse(source, destination);
  }

  return copyElement(source);

  //递归，数组，对象，方法，其他...为什么判断这么多，目前理解不了
  function copyRecurse(source, destination) {
    var h = destination.$$hashKey;
    var key;
    if (isArray(source)) {
      for (var i = 0, ii = source.length; i < ii; i++) {
        destination.push(copyElement(source[i]));
      }
    } else if (isBlankObject(source)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in source) {
        destination[key] = copyElement(source[key]);
      }
    } else if (source && typeof source.hasOwnProperty === 'function') {
      // Slow path, which must rely on hasOwnProperty
      for (key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    } else {
      // Slowest path --- hasOwnProperty can't be called as a method
      // 对象本身没有方法，则调用Object的方法
      for (key in source) {
        if (hasOwnProperty.call(source, key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    }
    setHashKey(destination, h);
    return destination;
  }

  function copyElement(source) {
    // Simple values
    if (!isObject(source)) {
      return source;
    }

    // Already copied values
    var index = stackSource.indexOf(source);
    if (index !== -1) {
      return stackDest[index];
    }

    if (isWindow(source) || isScope(source)) {
      throw new DataException('cpws',
        "Can't copy! Making copies of Window or Scope instances is not supported.");
    }

    var needsRecurse = false;
    var destination = copyType(source);

    if (destination === undefined) {
      destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
      needsRecurse = true;
    }

    stackSource.push(source);
    stackDest.push(destination);

    return needsRecurse ? copyRecurse(source, destination) : destination;
  }

  function copyType(source) {
    switch (toString.call(source)) {
      case '[object Int8Array]':
      case '[object Int16Array]':
      case '[object Int32Array]':
      case '[object Float32Array]':
      case '[object Float64Array]':
      case '[object Uint8Array]':
      case '[object Uint8ClampedArray]':
      case '[object Uint16Array]':
      case '[object Uint32Array]':
        return new source.constructor(copyElement(source.buffer));

      case '[object ArrayBuffer]':
        //Support: IE10
        if (!source.slice) {
          var copied = new ArrayBuffer(source.byteLength);
          new Uint8Array(copied).set(new Uint8Array(source));
          return copied;
        }
        return source.slice(0);

      case '[object Boolean]':
      case '[object Number]':
      case '[object String]':
      case '[object Date]':
        return new source.constructor(source.valueOf());

      case '[object RegExp]':
        var re = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
        re.lastIndex = source.lastIndex;
        return re;

      case '[object Blob]':
        return new source.constructor([source], {
          type: source.type
        });
    }

    if (isFunction(source.cloneNode)) {
      return source.cloneNode(true);
    }
  }
}

//参数数组或对象均可
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1,
    t2 = typeof o2,
    length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (isArray(o1)) {
      if (!isArray(o2)) return false;
      if ((length = o1.length) == o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else if (isDate(o1)) {
      if (!isDate(o2)) return false;
      return equals(o1.getTime(), o2.getTime());
    } else if (isRegExp(o1)) {
      if (!isRegExp(o2)) return false;
      return o1.toString() == o2.toString();
    } else {
      if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
        isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
      keySet = createMap();
      //对象属性的比较
      for (key in o1) {
        if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
        if (!equals(o1[key], o2[key])) return false;
        //用来存储对象一有哪些属性，有可能存在对象1的属性值和对象二都相等，但是对象二多余的属性
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) &&
          key.charAt(0) !== '$' &&
          isDefined(o2[key]) && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

function createMap() {
  //E5中提出的一种新的对象创建方式
  //第一个参数是要继承的原型，如果不是一个子函数，可以传一个null
  //第二个参数是对象的属性描述符，这个参数是可选的。
  return Object.create(null);
}


(function test() {
  var myhash = new Array();
  myhash['new'] = 'newval';
  myhash['new2'] = 'newval_2';
  for (var key in myhash) {
    console.log(key); //key 获取的是键名
    myhash[key]; // 获取值
  }
})();

function aaa() {
  this.test = "test";
}