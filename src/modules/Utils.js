/* 
  Utilities module
    specs: specs/src/utilsSpecs.js
    version: 1.3.0
  
  -- v.1.3.0
    Added reduce
    Make global optiomization

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
    function protoCheck(name, cfn){
      return Array.prototype[name] ? function(arr, fn){return Array.prototype[name].call(arr, fn)} : cfn;
    }

    var each = protoCheck('forEach', function(arr, fn){ 
      for(var i=0, l=arr.length; i<l;i++){ 
        fn(arr[i], i);
      }
    }),

    forWhile = function(arr, fn, preventValue, depreventValue){
      preventValue = preventValue || false; 
      for(var i=0, l=arr.length; i<l;i++){ 
        if(fn(arr[i], i) === preventValue){
          return preventValue;
        }
      }
      return depreventValue !== undefined ? depreventValue : true;
    },

    filter = protoCheck('filter', function(arr, fn){
      var filtered = [];
      each(arr, function(i, index){
        if(fn(i, index)===true){
          filtered.push(i);
        }
      });
      return filtered;
    }),
    
    reduce = protoCheck('reduce', function(arr, fn){
      var res = arr[0];
      for(var i=1,l=arr.length;i<l;i++){
        res = fn(res, arr[i]);
      }
      return res;
    }),

    map = protoCheck('map', function(arr, fn){
      var mapped = [];
      each(arr, function(e, i){
        mapped[i] = fn(e, i);
      });
      return mapped;
    }),

    some = protoCheck('some', function(arr, fn){
      return forWhile(arr, fn, true, false);
    }),

    every = protoCheck('every', function(arr, fn){
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
      reduce : reduce,

      toArray : function(a){
        if(is.obj(a) && is.not.exist(a.length)){
          a.length = Object.keys(a).length;
        }
        return Array.prototype.slice.call(a);
      },

      /* Interpolation */
      interpolate : function(str){
        var data = {},
            argc = arguments.length,
            argv = Utils.toArray(arguments),
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

      log : function(){
        console.log(interpolate.apply(this, arguments));
      },

      flatten : function(arr) {
        var r = [];
        each(arr, function(v){
          if(is.array(v)){
            r = r.concat(Utils.flatten(v));
          } else {
            r.push(v);
          }
        });
        return r;
      },

      trim: function(str){return str.replace(/^\s+|\s+$/g, '')},    

      /* Extending objects (not deep extend) */
      extend : function () {;
        function _extend(origin, add) {
          if (!add || typeof add !== 'object') return origin;
          var keys = Object.keys(add),
              i = keys.length;

          while (i--) {
            origin[keys[i]] = add[keys[i]];
          }
          return origin;
        }
        return Utils.toArray(arguments).reduce(function(dest, src) {
          return _extend(dest, src);
        });
      },

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
            return hash[i] = ((parseInt(hash[i], 16) || 0 )+1) . toString(16);
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
    include : [_STR],
    take : [_NUM],
    filter : [_FUN],
    skip : [_NUM],
    setup : [_FUN],
    makeStream: [_UND, _STR, _FUN, _ARR],
    debounce : [_NUM],
    getCollected : [_NUM],
    interpolate : [_STR],
    mask : [_OBJ],
    unique : [_FUN, _UND],
    lock : [_STR],
    nth : [_NUM],
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