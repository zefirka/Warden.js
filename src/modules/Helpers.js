/* 
  Helpers module
  v.0.2.0
*/

/* 
  Data type checking methods
*/

var Utils = (function(){
  var utils = {};

  utils.is = {
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
  };


  /* 
    Function forEach(@array arr, @function fn):
    Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
  */
  utils.forEach = (function(){
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

  /* Extending objects */
  utils.extend = (typeof $ !== 'undefined' && $.extend) ? $.extend : function (){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g}

  /* 
    Queue class @arr is Array, @maxlength is Number
  */
  utils.Queue = function Queue(max, arr){
    var res = arr || [],
        max = max || 16,
        oldpush = res.push;

    res.push = function(x){
      if(this.length>=max){
        this.shift();
      }
      return oldpush.apply(res, [x]);
    }
    return res;
  }

  utils.$hash = {
    s : 0, //streams
    d : 0, //databuses
    set : function(i){
      var current = parseInt(this[i], 16);
      return this[i] = (current+1) . toString(16);
    }
  };

  /* 
    Datatype analyzer
  */

  utils.Analyze = function(id, i){
    var t = utils.Analyze.MAP[id], yt = typeof i;
    if(t && t.indexOf(yt)==-1){
      throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + yt;
    }
  }

  utils.Analyze.MAP = (function(){
    var o = 'object', s = 'string', f = 'function', n = 'number';
    return {
      extend : [o,f],
      reduce : [f],
      take : [f,n],
      filter : [f],
      skip : [n],
      setup : [f],
      makeStream: [s,f],
      debounce : [n],
      getCollected : [n],
      interpolate : [s],
      mask : [o],
      warn : function(i, context){
        console.warn("Coincidence: property: '" + i + "' is already defined in stream context!", context);
      }
    }
  })();

  return utils;
})();