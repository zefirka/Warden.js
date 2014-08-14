/* Helpers functions */

/*
  Function exists(@mixed x):
  Returns true is x exists and not equal null.
*/
var exists = function(x){
  return typeof x !== 'undefined' && x !== null;
}


/* Typeof methods */
var is = {
  fn : function (x) {
    return typeof x === 'function';
  },
  num : function (x) {
    return typeof x === 'number';
  },
  str : function (x) {
    return typeof x === 'string';
  },
  array : function(x){
    return isArray(x);
  },
  obj : function(x){
    return typeof x === 'object';
  },
  exists : function(x){
    return exists(x);
  },
  map: {
    '_function' : function(x){
      return is.fn(x);
    },
    '_number' : function(x){
      return is.num(x);
    },
    '_string' : function(x){
      return is.str(x);
    },
    '_array' : function(x){
      return is.arr(x);
    },
    '_object' : function(x){
      return is.obj(x);
    }
  }
}

/*
  Function isArray(@mixed x):
  Checks is x param is real array or object (or arguments object)
*/
var isArray = (function(){
  if(Array.isArray){
    return function(x){ 
      return Array.isArray(x); 
    }
  }else{
    return function(x){ 
      Object.prototype.toString.call(x) === '[object Array]';
    }
  }
}());


/*
  Function forWhilte(@array arr, @function fn, @mixed preventVal, @mixed preventRet):
  Applyies @fn to each element of arr while result of applying doesn't equal @preventVal
  Then returns @preventRet or false if @preventRet is not defined
*/
var forWhile = function(arr, fn, preventVal, preventRet){
  for(var i=0, l=arr.length; i<l; i++){
    if(fn(arr[i], i) === preventVal){
      return preventRet && false; 
      break;
    }
  }
};


/* 
  Function forEach(@array arr, @function fn):
  Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
*/
var forEach = (function(){
  if(Array.prototype.forEach){
    return function(arr, fn){ 
      return arr ? arr.forEach(fn) : null;
    }
  }else{
    return function(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        fn(arr[i], i);
      }
    }
  }
}());


/*
  Function filter(@array, @function)
  Filtering @array by @function and returns only mathcing as @function(item) === true  elements
  TODO: Should we keep it here?
*/
var filter = (function(){
  if(Array.prototype.filter){
    return function(arr, fn){
      return arr ? arr.filter(fn) : null;
    }
  }else{
    return function(arr, fn){
      var filtered = [];
      for(var i=0, l=arr.length; i<l; i++){
        var res = fn(arr[i]);
        if(res === true){
          filtered.push(res);
        }
      }
      return filtered;
    }
  }
})();

/* 
  Queue class @arr is Array;
*/
function Queue(maxlength, arr){
  var storage = arr || [],
      length = (arr && arr.length) || 0,
      max = maxlength || 16;

  this.length = function(){
    return length;
  };

  this.push = function(item){
    if(length>=maxlength){
      storage.shift();  
    }
    storage.push(item);
    length = storage.length;
  };

  this.get = function(index){
    return exists(index) ? storage[index] : storage;
  };
}

/* 
  Datatype analyzer
*/

var Analyze = function(className, classMethod, i){
  var res = {};
  if(!Analyze.MAP[className][classMethod](typeof i)){
    throw "TypeError: unexpected type of argument at : " + className + " : " + classMethod;
  }else{
    ['number', 'string', 'function', 'object', 'array'].forEach(function(name){
      res["_" + name] = function(x){
        if(is.map["_" + name](i)){
          x();
        }
        return res;
      }
    });

    return res;
  }
}

Analyze.MAP = {
  Warden : {
    makeStream: function(type){
      return type == 'string' || type == 'function';
    }
  },

}