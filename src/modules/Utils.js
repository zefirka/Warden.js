/* 
  Utilities module
  v.1.0.0
*/


var Utils = (function(){
  var _FUN = 'function',
      _NUM = 'number',
      _STR = 'string',
      _OBJ = 'object',
      _ARR = 'array',
      _BOOL = 'boolean',
      _UND = 'undefined';
  
  function equals(x){
      return function(y){
          return x === y;
      }
  }

  function truthy(x){
       return x ? true : false;
  }
  
  function $let(predicate){
    var predicates = [predicate],
        all = false;

    var ans = function(x){
        var res = map(predicates, function(pred){
            return pred(x);
        });

        return all ?  res.every(truthy) : res.some(truthy);		
    }


    ans.and = function(predicate){
        ans.or(predicate);
        all = true;
        return ans;
    }

    ans.or = function(predicate){
        predicates.push(predicate);
        return ans;
    }

    return ans;
  }
  
  function filter(arr, fn){
    var filterd = [];
    for(var i=0, l=arr.length; i<l; i++){
      if(fn(arr[i])===true){
        filterd.push(arr[i]);
      }
    }
    return filterd;
  }
	
  function map(arr, fn){
    var mapped = [];
    for(var i=0, l=arr.length; i<l; i++){
      mapped[i] = fn(arr[i], i)
    }
    return mapped;
  }
  
  function typeIs(n){
    return function(x){
      return typeof x === n;
    }
  }

  function not(predicate){
    return function(x){
      return !predicate(x);
    }
  }	
  
  /* 
    Data type checking methods
  */
  var is = {
    exist : $let(not(typeIs(_UND))).and(not(equals(null))),
	array : function(x){
		return Array.isArray(x)
	},
	fn : typeIs(_FUN),
	num : typeIs(_NUM),
	str : typeIs(_STR),
	bool : typeIs(_BOOL),
	truthy : truthy,
	falsee : not(truthy)
  }
        
  is.obj = $let(typeIs(_OBJ)).and(not(is.arr)),
	
  is.not = (function(x){
    var obj = {};
    for(var i in is){
      obj[i] = not(is[i])
    }
    return obj;
  })();
	
             
  return {
    is : is,

    /* 
      Function forEach(@array arr, @function fn):
      Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
    */
    forEach : (function(){
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

    /* Extending objects */
    extend : (typeof $ !== 'undefined' && $.extend) ? $.extend : function (){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},

    /* 
      Queue class @arr is Array, @maxlength is Number
    */
    Queue : function Queue(max, arr){
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
    },

    $hash : (function(){
      var hash = {};
      return {
        get : function(n){
          return hash[n];
        },
        set : function(i){
          var current = parseInt(hash[i], 16) || 0;      
          return hash[i] = (current+1) . toString(16);
        }
      }
    })()
  }
})();

Warden.Utils = Utils;

/* Exception manager */
var Analyze = function(id, i, l){
  var t = Analyze.MAP[id], yt = typeof i, tl = t[t.length-1];
  if(t && t.indexOf(yt)==-1){
    throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + yt;
  }
}

Analyze.MAP = (function(){
  var o = 'object', 
      s = 'string', 
      f = 'function', 
      n = 'number';
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

Warden.configure.datatypes = function(name, types){
  if(Analyze.MAP[name]){
    throw "This name is already exist";
  }else{
    Analyze.MAP[name] = types;
  }
}