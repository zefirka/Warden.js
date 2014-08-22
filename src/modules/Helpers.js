/* 
  Helpers module
  v.0.2.0
*/


/* 
  Data type checking methods
*/
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
  obj : function(x){
    return typeof x === 'object' && !this.array(x);
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

  /*
    Function exists(@mixed x):
    Returns true is x exists and not equal null.
  */
  exist : function(x){
    return typeof x !== 'undefined' && x !== null;
  }
},

/*
  Function forWhilte(@array arr, @function fn, @mixed preventVal, @mixed preventRet):
  Applyies @fn to each element of arr while result of applying doesn't equal @preventVal
  Then returns @preventRet or false if @preventRet is not defined
*/
forWhile = function(arr, fn, preventVal, preventRet){
  for(var i=0, l=arr.length; i<l; i++){
    if(fn(arr[i], i) === preventVal){
      return preventRet && false; 
      break;
    }
  }
},

/* 
  Function forEach(@array arr, @function fn):
  Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
*/
forEach = (function(){
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
}()),

/*
  Function filter(@array, @function)
  Filtering @array by @function and returns only mathcing as @function(item) === true  elements
  TODO: Should we keep it here?
*/
filter = (function(){
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
})(),

/* Extends flat objects */

extend = ($ && $.extend) ? $.extend : function (){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g}


/* 
  Queue class @arr is Array, @maxlength is Number
*/
function Queue(maxlength, arr){
  var max = maxlength || 16, storage = (arr && arr.slice(0, max)) || [];

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
  var t = Analyze.MAP[id], yt = typeof i;
  if(t && t.indexOf(yt)==-1){
    throw "TypeError: unexpected type of argument at : " + id+ ". Expect: " + t.join(' or ') + ". Your argument is type of: " + yt;
  }
}

Analyze.MAP = (function(){
  var o = 'object', s = 'string', f = 'function', n = 'number';
  return {
    extend : [o,f],
    reduce : [f],
    take : [f,n],
    filter : [f],
    skip : [n],
    makeStream: [s,f],
    debounce : [n],
    getCollected : [n],
    warn : function(i, context){
      console.log("Coincidence: property: '" + i + "' is already defined in stream context!", context);
    }
  }
})();