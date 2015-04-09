/* Globals */
var Utils;

var _FUN = 'function',
    _NUM = 'number',
    _STR = 'string',
    _OBJ = 'object',
    _ARR = 'array',
    _BOOL = 'boolean',
    _UND = 'undefined';

function each(arr, fn){ 
  for(var i=0, l=arr.length; i<l;i++){ 
    fn(arr[i], i);
  }
}

function forWhile(arr, fn, preventValue, depreventValue){
  preventValue = preventValue || false; 
  for(var i=0, l=arr.length; i<l;i++){ 
    if(fn(arr[i], i) === preventValue){
      return preventValue;
    }
  }
  return depreventValue !== undefined ? depreventValue : true;
}

function filter(arr, fn){
  var filtered = [];
  each(arr, function(i, index){
    if(fn(i, index)===true){
      filtered.push(i);
    }
  });
  return filtered;
}

function reduce(arr, fn){
  var res = arr[0];
  for(var i=1,l=arr.length;i<l;i++){
    res = fn(res, arr[i]);
  }
  return res;
}

function map(arr, fn){
  var mapped = [];
  each(arr, function(e, i){
    mapped[i] = fn(e, i);
  });
  return mapped;
}

function some(arr, fn){
  return forWhile(arr, fn, true, false);
}

function every(arr, fn){
  return forWhile(arr, fn);
}

function truthy(x){
  return x ? true : false;
}

function typeIs(n){
  return function(x){
    return typeof x === n;
  }
}

function trim(str){
  return str.replace(/^\s+|\s+$/g, '')
}

function not(predicate){
  return function(x){
    return !predicate(x);
  }
}

var is = {
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
  equals : function(x){
    return function(y){
      return x === y;
    }
  }
}

is.obj = function(x){
  return typeIs(_OBJ)(x) && !is.array(x);
}

function toArray(a){
  if(is.obj(a) && !is.exist(a.length)){
    a.length = Object.keys(a).length;
  }
  return Array.prototype.slice.call(a);
}

/* Extending objects (not deep extend) */
function extend() {
  function _extend(origin, add) {
    if (!add || typeof add !== 'object') return origin;
    var keys = Object.keys(add), i = keys.length;

    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  }

  return reduce(toArray(arguments),function(dest, src) {
    return _extend(dest, src);
  });
}

var hashc = (function(){
  var hash = {};
  return {
    get : function(n){
      return hash[n];
    },
    set : function(i){
      return hash[i] = ((parseInt(hash[i], 16) || 0 )+1) . toString(16);
    }
  }
})();

Utils = {
      /* 
        Data type and logical statements checking methods
      */
    is : is,
    not: not,

    /* 
      Array.prototype functional methods: 
    */ 
    forWhile : forWhile,
    each : each, // synonym of forEach
    filter : filter,
    some : some,
    every : every,
    map : map,
    reduce : reduce,
    toArray: toArray,
    /* Interpolation */
    interpolate : function(str){
      var data = {},
          argc = arguments.length,
          argv = Utils.toArray(arguments),
          reg = /{{\s*[\w\.\/\[\]]+\s*}}/g;

      if(argc==2 && is.obj(argv[1])){
        data = argv[1];
      }else{
        each(argv.slice(1, argc), function(e, i){
          data[i] = e;
        });
      }       

      return str.replace(reg, function(i){
        var res = Utils.getObject(data, i.slice(2,-2)),
            arg = is.exist(res) ? res : i;
        if(is.obj(arg)){
          arg=JSON.stringify(arg);
        }          
        return arg;
      });
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
    extend: extend,
    trim: trim,

    getObject : function(data, s){
      if(!is.obj(data)){
        return data;
      }

      each(s.split('/'), function(elem){
        if(!is.exist(data)){
          return data;
        }

        var cand;

        if(elem[0]=='[' && elem[elem.length-1]==']'){
          cand = elem.slice(1,-1);
          if(is.exist(cand)){
            if(is.num(parseInt(cand))){
              elem = parseInt(cand);
            }else{
              throw "Wrong syntax";
            }
          }
        }else{
          if(!is.exist(data[elem])){
            data = {}
          }
        }

        data=data[elem];

      });
      return data;
    },

    /* 
      Queue class @arr is Array, @maxlength is Number
    */
    Queue : function Queue(max, arr){
      var res = arr || [],
          max = max || 16,
          oldpush = res.push;
      
      res.last = function(){
        return res[res.length-1] || null;
      };
      
      res.push = function(x){
        if(this.length>=max){
          this.shift();
        }
        return oldpush.apply(res, [x]);
      }
      return res;
    },

    $hash : hashc
  }

  Warden.Utils = Utils;