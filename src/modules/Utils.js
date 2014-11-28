/* 
  Utilities module
    specs: specs/src/utilsSpecs.js
    version: 1.2.3

  -- v1.2.3 --
      Derived .log  to .interpolate (common interpolation method) and .log (logs with interpolation)
      Added toArray method
      Added trim method

  -- v1.2.2 --
      Added some props to analyzator's ,ap
      Added Flatten method

  -- v1.2.1 --
      Added .log function (logging with interpolation)
      Divided Warden core Analyzer with user's

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
var Utils, Analyze, UserMap = {};

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
      var name = fn.name || fname || "function",
          m = [name, "have been ran", n,"times:"].join(" ");

      console.time(m);
      for(var i=0; i<n; i++){
        fn(gen ? gen(n) : n);
      }
      console.timeEnd(m);
    },

    toArray = function(a){
      if(is.obj(a) && is.not.exist(a.length)){
        a.length = Object.keys(a).length;
      }
      return Array.prototype.slice.call(a);
    },

    interpolate = function(str){
      var data = {},
        argc = arguments.length,
        argv = toArray(arguments),
        reg = /{{\s*[\w\.]+\s*}}/g;

      if(argc==2 && is.obj(argv[1])){
        data = argv[1];
      }else{
        each(argv.slice(1, argc), function(e, i){
          data[i] = e;
        });
      }       

      return str.replace(reg, function(i){
        var arg = data[i.slice(2,-2)] || i;
        if(is.obj(arg)){
          arg=JSON.stringify(arg);
        }
        return arg;
      });
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


      toArray : toArray,

      /* Profiling method */
      profile : profile,

      /* Interpolation */
      interpolate : interpolate, 
      log : function(){
        console.log(interpolate.apply(this, arguments));
      },

      flatten : function(arr) {
        var r = [];
        each(arr, function(v){
          if(is.array(v)){
            arr.push.apply(flatten(v));
          } else {
            r.push(v);
          }
        });
        return r;
      },

      trim: function(str){return str.replace(/^\s+|\s+$/g, '');},    

      /* Extending objects (deep-extend) */
      extend : function () {;
        function _extend(dest, source) {
          var key, _, _i, _len, _ref;

          for (var prop in source) {
            if (source[prop] && is.obj(source[prop])) {
              dest[prop] = dest[prop] || {};
              _extend(dest[prop], source[prop]);
            } else if (is.array(source[prop])) {
              dest[prop] = dest[prop] || [];
              if (is.obj(dest[prop][0]) && is.obj(source[prop][0])) {
                _ref = source[prop];
                for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
                  dest[prop][key] = _extend(dest[prop][key] || {}, source[prop][key]);
                }
              } else {
                dest[prop] = source[prop];
              }
            } else {
              dest[prop] = source[prop];
            }
          }
          return dest;
        };

        var args = toArray(arguments);
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

  function setAnalyzer(map){
    return function(id, i, l){
      var t = map[id],
          res = !Utils.is.exist(t) ? true : Utils.some(t, function(type){return typeof i === type});

      if(!res){
        throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + typeof i;
      }
    }
  }

  Analyze = setAnalyzer({
    extend : [_OBJ,_FUN, _ARR],
    listen : [_STR],
    stream : [_STR],
    unlisten : [_STR],
    reduce : [_FUN],
    take : [_FUN,_NUM],
    filter : [_FUN],
    skip : [_NUM],
    setup : [_FUN],
    makeStream: [_UND, _STR, _FUN, _ARR],
    debounce : [_NUM],
    getCollected : [_NUM],
    interpolate : [_STR],
    mask : [_STR],
    unique : [_FUN, _UND],
    lock : [_STR],
    nth : [_OBJ],
    get : [_STR]
  });

  Warden.configure.exceptionMap = {};
  Warden.configure.exceptionManager = setAnalyzer(Warden.configure.exceptionMap);

})();

Warden.Utils = Utils;

Warden.configure.datatypes = function(name, types){
  if(Analyze.MAP[name]){
    throw "This name is already exist";
  }else{
    Analyze.MAP[name] = types;
  }
}