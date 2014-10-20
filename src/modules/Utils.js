/* 
  Utilities module  
  v.1.1.0

  -- v.1.1.0 --
    - Most of functional style reverted cause it is too slow.

  -- v.1.0.0 --
    - All checing methods changed with functional paradigm.

  -- v.0.0.1 --
    - Datatype checking functions. Array prototype forEach method wrap for ECMAScript 3. 
*/


/* Globals */
var Utils, Analyze;

(function(){
  var _FUN = 'function',
      _NUM = 'number',
      _STR = 'string',
      _OBJ = 'object',
      _ARR = 'array',
      _BOOL = 'boolean',
      _UND = 'undefined';

  Utils = (function(){
    var $let = function $let(predicate){
      var predicates = [predicate],
          all = false;

      var ans = function(x){
        var res = map(predicates, function(pred){
            return pred(x);
        });

        return all ?  res.every(truthy) : res.some(truthy);   
      }

      ans.or = function(predicate){
        predicates.push(predicate);
        return ans;
      }

      ans.and = function(predicate){
        all = true;
        return ans.or(predicate);
      }

      ans.butNot = function(predicate){
        return ans.and(not(predicate));
      }

      return ans;
    },

    protoCheck = function(a, b){
      if(a.prototype[b]){
        return function(arr, fn){
         return a.prototype[b].call(arr, fn);
        }
      }else{
        return false
      }
    },

    each = protoCheck(Array, 'forEach') || function each(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        fn(arr[i], i);
      }
    },

    forWhile = function forWhile(arr, fn, preventValue){
      preventValue = preventValue || false; 
      for(var i=0, l=arr.length; i<l;i++){ 
        if(fn(arr[i], i) === preventValue){
          return null;
        }
      }
    },

    filter = protoCheck(Array, 'filter')|| function filter(arr, fn){
      var filtered = [];
      each(arr, function(i, index){
        if(fn(i, index)===true){
          filtered.push(i);
        }
      });
      return filterd;
    },
    
    map = protoCheck(Array, 'map') || function map(arr, fn){
      var mapped = [];
      each(arr, function(e, i){
        mapped[i] = fn(e, i);
      });
      return mapped;
    },

    truthy = function(x){
      return x ? true : false;
    },


    typeIs = function(n){
      return function(x){
        return typeof x === n;
      }
    },

    not = function(predicate){
      return function(x){
        return !predicate(x);
      }
    },
    
    profile = function(fn, n, gen, fname){
      var t = n, 
          name = fn.name || fname || "function",
          m = [name, "have been ran", t,"times:"].join(" ");

      console.time(m);
      while(n--){
        fn(gen());
      }
      console.timeEnd(m);
    },

    is = {
      exist : function(x){
        return typeof x != 'undefined' && x !== null;
      },
      array : function(x){
        return Array.isArray(x)
      },
      fn : typeIs(_FUN),
      num : typeIs(_NUM),
      str : typeIs(_STR),
      bool : typeIs(_BOOL),
      truthy : truthy,
      falsee : not(truthy),
      equals : function(x){
        return function(y){
          return x === y;
        }
      }
    }
          
    is.obj = function(x){
      return typeIs(_OBJ)(x) && !is.array(x);
    }

    is.not = (function(x){
      var obj = {};
      for(var i in is){
        obj[i] = not(is[i])
      }
      return obj;
    })();
    
               
    return {
      /* 
        Data type and logical statements checking methods
      */
      is : is,

      /* Logical chining method to combine predicates and calculating a final expression like:
        $let([falsee function]).or([truthy function]) -> true
        $let([truthy function]).and([falses function]) -> false
        $let([truthy function]).or([falsee function]).butNot([falsee function]) -> true

        $let(@function predicate) returns object with methods .and, .or, .butNot 
      */
      $let : $let,

      /* 
        Array.prototype functional methods: 
      */ 

      forEach : each,
      each : each, // synonym of forEach
      filter : filter,
      map : map,

      /* Extending objects (deep-extend) */
      extend : function () {;
        function _extend(dest, source) {
          var key, _, _i, _len, _ref;

          for (var property in source) {
            if (source[property] && is.obj(source[property])) {
              dest[property] = dest[property] || {};
              _extend(dest[property], source[property]);
            } else if (is.array(source[property])) {
              dest[property] = dest[property] || [];
              if (is.obj(dest[property][0]) && is.obj(source[property][0])) {
                _ref = source[property];
                for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
                  _ = _ref[key];
                  dest[property][key] = _extend(dest[property][key] || {}, source[property][key]);
                }
              } else {
                dest[property] = source[property];
              }
            } else {
              dest[property] = source[property];
            }
          }
          return dest;
        };

        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(dest, src) {
          return _extend(dest, src);
        });
      } ,
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

  /* Exception manager */

  Analyze = function(id, i, l){
    var t = Analyze.MAP[id], yt = typeof i, tl = t[t.length-1];
    if(t && t.indexOf(yt)==-1){
      throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + yt;
    }
  }

  Analyze.MAP = {
    extend : [_OBJ,_FUN, _ARR],
    reduce : [_FUN],
    take : [_FUN,_NUM],
    filter : [_FUN],
    skip : [_NUM],
    setup : [_FUN],
    makeStream: [_STR,_FUN, _OBJ],
    debounce : [_NUM],
    getCollected : [_NUM],
    interpolate : [_STR],
    mask : [_OBJ],
    lock : [_STR]
  }

})();

Warden.Utils = Utils;
Warden.configure.exceptionManager = Analyze;
Warden.configure.datatypes = function(name, types){
  if(Analyze.MAP[name]){
    throw "This name is already exist";
  }else{
    Analyze.MAP[name] = types;
  }
}