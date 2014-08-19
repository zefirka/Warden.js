/* 
  Helpers module
  v.0.1.0
*/

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

  /*
    Function isArray(@mixed x):
    Checks is x param is real array or object (or arguments object)
  */

  array : (function(){    
    if(Array.isArray){
      return function(x){ 
        return Array.isArray(x); 
      }
    }else{
      return function(x){ 
        Object.prototype.toString.call(x) === '[object Array]';
      }
    }
  }()),
  obj : function(x){
    return typeof x === 'object';
  },
  exist : function(x){
    return typeof x !== 'undefined' && x !== null;
  }
}


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
  Queue class @arr is Array, @maxlength is Number
*/
function Queue(maxlength, arr){
  var storage = arr || [],
      max = maxlength || 16;

  this.length = (arr && arr.length) || 0;

  this.push = function(item){
    if(this.length>=max){
      storage.shift();  
    }else{
      this.length++;  
    }
    storage.push(item);
  };

  this.pop = function(){
    storage.pop();
    this.length--;
  }

  this.get = function(index){
    return is.exist(index) ? storage[index] : storage;
  };

}

/* 
  Datatype analyzer
*/

var Analyze = function(id, i){
  var t = Analyze.MAP[id];
  if(t.indexOf(typeof i)==-1){
    throw "TypeError: unexpected type of argument at : " + id+ ". Expect: " + t.join(' or ') + ".";
  }
}

Analyze.MAP = {
  extend : ['object', 'function'],
  makeStream: ['string', 'function']
}