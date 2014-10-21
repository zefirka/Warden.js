/* 
  Utilities module
    specs: specs/src/utilsSpecs.js
    version: 1.2.0

  -- v1.2.0 --
      Fixed data type analyzer. Now it checks not by typeof but by Utils.is[type] method.
      Added .some and .every methods. 
      Added specs for utils.

  -- v1.1.0 --
    - Most of functional style reverted cause it is too slow.

  -- v1.0.0 --
    - All checing methods changed with functional paradigm.

  -- v0.0.1 --
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
          all = false,
          ans = function(x){
            var res = map(predicates, function(pred){return pred(x)});

            return all ?  every(res, truthy) : some(res, truthy);   
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

    protoCheck = function(name, cfn){
      return Array.prototype[name] ? function(arr, fn){return Array.prototype[name].call(arr, fn)} : cfn;
    },

    each = protoCheck('forEach', function each(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        fn(arr[i], i);
      }
    }),

    forWhile = function forWhile(arr, fn, preventValue, depreventValue){
      preventValue = preventValue || false; 
      depreventValue = depreventValue !== undefined ? depreventValue : true;
      for(var i=0, l=arr.length; i<l;i++){ 
        if(fn(arr[i], i) === preventValue){
          return preventValue;
        }
      }
      return depreventValue;
    },

    filter = protoCheck('filter', function filter(arr, fn){
      var filtered = [];
      each(arr, function(i, index){
        if(fn(i, index)===true){
          filtered.push(i);
        }
      });
      return filterd;
    }),
    
    map = protoCheck('map', function map(arr, fn){
      var mapped = [];
      each(arr, function(e, i){
        mapped[i] = fn(e, i);
      });
      return mapped;
    }),

    some = protoCheck('some', function some(arr, fn){
      return forWhile(arr, fn, true, false);
    }),

    every = protoCheck('every', function every(arr, fn){
      return forWhile(arr, fn);
    }),

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
      not: not,

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
      forWhile : forWhile,
      each : each, // synonym of forEach
      filter : filter,
      some : some,
      every : every,
      map : map,


      /* Profiling method */
      profile : profile,

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
        
        res.last = function(){
          return res[res.length-1];
        };
        
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
    var t = Analyze.MAP[id],
        res = !Utils.is.exist(t) ? true : Utils.some(t, function(type){return Utils.is[type](i)});

    if(!res){
      t = Utils.map(t, function(x){return Analyze.dict[x] || x;});
      throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + typeof i;
    }
  }

  Analyze.dict = {
    'obj' : _OBJ,
    'fn' : _FUN,
    'num' : _NUM,
    'str' : _STR,
  }

  Analyze.MAP = {
    extend : ['obj','fn','array'],
    reduce : ['fn'],
    take : ['fn','num'],
    filter : ['fn'],
    skip : ['num'],
    setup : ['fn'],
    makeStream: ['str','fn', 'obj'],
    debounce : ['num'],
    getCollected : ['num'],
    interpolate : ['str'],
    mask : ['obj'],
    lock : ['str']
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