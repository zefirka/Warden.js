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