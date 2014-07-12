/* Helpers module */

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

var forEach = (function(){
  if(Array.prototype.forEach){
    return function(arr, fn){ 
      return arr ? arr.forEach(fn) : undefined;
    }
  }else{
    return function(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        fn(arr[i], i) 
      }
    }
  }
}());