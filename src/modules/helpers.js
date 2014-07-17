/* Helpers module */

// function exists(i)
// returns true is i exists;
var exists = function(i){
  return typeof f !== 'undefined';
}

// function isArray(x)
// checks is x param is real array or object (or arguments object)
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

// function forEach(@array arr, @function fn)
// applies @fn for each item from array @arrm usage: forEach([1,2], function(item){...});
var forEach = (function(){
  if(Array.prototype.forEach){
    return function(arr, fn){ 
      return arr ? arr.forEach(fn) : null;
    }
  }else{
    return function(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        if(fn(arr[i], i) === false) break;
      }
    }
  }
}());

// function filter(@array, @function)
// filtering @array by @function and returns only mathcing as @function(item) === true  elements
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