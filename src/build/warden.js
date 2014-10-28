((function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    if(root.Warden == null){ //initialize Warden
      Warden = {};
    }
    factory(Warden);
    if (typeof define === "function" && define.amd) {
      define(Warden); // AMD
    } else {
      root.Warden = Warden; // <script>
    }
  }
})(this, function(Warden){
  
  'use strict';
  Warden.version = "0.1.0"; 
  Warden.configure = {};
  
  /* 
    Globals: 
      Utils
      Analyze
  */
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

    function setAnalyzer(p){
      var Dict = {
        'obj' : _OBJ,
        'fn' : _FUN,
        'num' : _NUM,
        'str' : _STR,
      }
      return function(id, i, l){
        var t = p[id],
            res = !Utils.is.exist(t) ? true : Utils.some(t, function(type){return Utils.is[type](i)});

        if(!res){
          t = Utils.map(t, function(x){return Dict[x] || x;});
          throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + typeof i;
        }
      }
    }

    Analyze = setAnalyzer({
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
      lock : ['str'],
      nth : ['array'],
      get : ['str']
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

  /*
    Globals:
      Warden.extend
  */
  /* 
    Extend module: 
      docs: ./docs/Extend.md
      version: v1.0.1

    -- v1.0.1 --
      Removed maximal handlers counter
      Changed array observation methods, now it's own properties of new array (extented)

    -- v1.0.0 --
      Added array changes observation.
      Stabilized default configuration behavior with current deepExtend (Utils/extend) method.
      Changed all functions from ES5 to Utils module analogues.

    This methods extends @obj which can be function, object or array with Warden.js methods .emit(), .listen(), .unlisten() and .stream() 
  */

  Warden.extend = (function(){
    var each = Utils.each, 
      is = Utils.is,
      map = Utils.map,
      filter = Utils.filter,
      extend = Utils.extend,
      nativeListener = "addEventListener",
      alternativeListener = "attachEvent",

      defaultConfig = {
        arrayMethods : ['pop', 'push', 'slice', 'splice',  'reverse', 'join', 'concat', 'shift', 'sort', 'unshift' ],
        names : {
          emit : 'emit',
          listen : 'listen',
          stream : 'stream',
          unlisten : 'unlisten'
        },
        emitter : null, /* custom event emitter if exists */
        listener : null /* custrom event listener if exists */
      }

    Warden.configure.changeDefault = function(newConfig){
      return Utils.extend(defaultConfig, newConfig);
    }

    Warden.configure.natives = function(obj){
      nativeListener = obj.listener;
      alternativeListener = obj.altenativeListener;
    }

    return function(obj, conf) {
      Analyze('extend', obj);

      var config = extend({}, defaultConfig, conf || {}), // default configuration 
          inheritor = obj, // final object to expand
          isConstructor = true, //obj is constructor
          names = config.names;
      /* 
        Choose object to extend,
        if fn is constructor function, then that's prototype, else
        use actual object element 
      */    
      if(is.fn(obj)){
        inheritor = obj.prototype;
      }else{
        isConstructor = false;

        if(is.array(obj)){
            var functionalObjects = map(config.arrayMethods, function(fn){
              return {
                name: fn,
                fun: Array.prototype[fn] }
            });

          /* Extending methods of a current array with stream evaluation */
          each(functionalObjects, function(item){
            obj[item.name] = function(){
              var argv = Array.prototype.slice.call(arguments);
              item.fun.apply(obj, argv);
              obj.emit({
                type: item.name, 
                current: obj,
                data: argv
              });
            }
          });      
        }

      }

      var overwrite = inheritor[names.emit] || inheritor[names.listen] || 
                      inheritor[names.unlisten] || inheritor[names.stream];

      /* Checking free namespace */
      if(is.exist(overwrite)){
        throw new Error("Can't overwrite: " + (overwrite.name ? overwrite.name : overwrite) + " of object");
      }
      
      /* 
        Setting up standart DOM event listener 
        and emitters  function to not overwrite them 
        and user should do not use that in config 
      */
      if(typeof jQuery!=="undefined" && (!isConstructor ? obj instanceof jQuery : true)){
        config.emitter = config.emitter || 'trigger';
        config.listener = config.listener || 'on';    
      }else
      if(is.fn(inheritor[nativeListener]) || is.fn(inheritor[alternativeListener])){
        config.listener = config.listener || (is.fn(inheritor[nativeListener]) ? nativeListener : alternativeListener);
      }
          
      /* Emitter method */
      inheritor[names.emit] = function(ev, data){
        var self = this,
            type = is.str(ev) ? ev : ev.type,
            data = is.obj(ev) ? ev : data || ev,
            callbacks = filter(this['$$handlers'], function(i){
              return i.type == type;
            });
        
        each(callbacks, function(callback){
          callback.callback.call(self, data);
        });
          
        return this;
      };

      /* listen events of @type */
      inheritor[names.listen] = function(type, callback){
        var self = this,
            handlers = this['$$handlers'] = this['$$handlers'] || [];
        
        if(!filter(handlers, function(i){return i.type == type;}).length && this[config.listener]){
          this[config.listener].apply(this, [type, function(event){ 
            self.emit(event)
          }]);
        }
      
        this['$$handlers'].push({
          type: type,
          callback: callback
        });

        return this;
      };

      
      inheritor[names.unlisten] = function(type, name){
        var self = this;
        if(self['$$handlers']){
          var indexes = [];
          each(self['$$handlers'], function(i, index){
            if(i.callback.name == (name.name || name)){
              indexes.push(index);
            }
          });
          each(indexes, function(i){
            self['$$handlers'].splice(i,1);
          });
        }
        return this;
      };

      /* Creates stream */
      inheritor[names.stream] = function(type, cnt) {
        var stream = Warden.makeStream(type, cnt || this),
            handlers = this['$$handlers'] = this['$$handlers'] || [];
           
        if(!filter(handlers, function(i){return i.type == type;}).length && this[config.listener]){
          this[config.listener].apply(this, [type, function(event){     
            stream.eval(event);      
          }]);
        }

        this['$$handlers'].push({
          type: type,
          callback: function(event){
            stream.eval(event);
          }
        });

        return stream.get();
      };

      return obj;
    };
  })();

  /* 
    Globals:
      Processor
  */
  /*
    Processor module: 
    Implements interface to processing all databus methods.
    Version: v0.1.1;
  */

  function Processor(proc, host){
    var processes = proc || [], locked = 0, i = 0,

        /* Functional methods to manipulate DataBus processing workflow */
        fns = {
          /* Continue processing with @data */
          $continue: function(data){
             return self.tick(data);
          },
          /* Break processing */
          $break: function(){
            return self.tick({}, 1);
          },
          /* Locks DataBus evaluation */
          $lock: function(){
            return locked = 1;
          },
          /* Unlocks DataBus evaluation */
          $unlock: function(){
            return locked = 0;
          },
          $update: function(){
            host.update();
          },
          /* Returns current DataBus */
          $host: function(){
            return host;
          }
        };
    
    var self = {
      /* Add process if @p exists or return all processes of this Processor */
      process : function(p){
        return Utils.is.exist(p) ? processes.push(p) : processes;
      },

      /* Start processing */
      start : function(event, context, fin){
        self.ctx = context;
        self.fin = fin;    
        
        i = locked ? 0 : i;
        
        if(i==processes.length){
          i = 0;
          return fin(event);
        }

        this.tick(event);
      },

      /* Ticking processor to the next process */
      tick : function(event, breaked){        
        if(breaked){
          return i = 0;
        }
        
        if(i==processes.length){
          i = 0;
          return self.fin(event);
        }

        i++;      
        processes[i-1].apply(self.ctx, [event, fns]);
        
      }
    }
    return self;
  }

  /*
    Globals:
      Warden.makeStream
  */
  /*
    Streams module:
      docs: ./docs/Streams.md
      version: 0.3.3
      
    -- v0.3.3 -- 
      - Added $context in object. Removed class name.
    
    -- v0.3.2 --
      - Fixed mistakes in pop and push down and up

    -- v0.3.0 --
      - Stream strict checking argument now must be only boolean true
      
    -- v0.2.0 -- 
      Added @popAllDown and @popAllUp methods;

    Creates stream of data.
    If @x is string, that it interprets as datatype
    else if @x is function, than x's first arg is emitting data function
  */

  Warden.makeStream = (function(){
    var each = Utils.each, 
        is = Utils.is;

    /* Stream constructor */
    function Stream(context){
      var drive = [];

      return {
        $$id : Utils.$hash.set('s'), // stream id
        $$context : context, // saving context
        /* 
          Evaluating the stream with @data 
        */
        eval : function(data){
          each(drive, function(bus){
            bus.fire(data, context);
          });
        },
        
        /* 
          Push into executable drive @bus.
          Bus is DataBus object.
        */
        push : function(bus){
          drive.push(bus);
          return bus;
        },

        pushAllUp : function(bus){
          var self = this;
          drive.push(bus);
          function pParent(x){
            if(is.exist(x.parent)){
              drive.push(x.parent);
              pParent(x.parent);
            }
          }
          pParent(bus);
        },

        pushAllDown : function(bus){
          var self = this;
          each(self.push(bus).children, function(b){
            self.pushAllDown(b);
          });
        },

        /* 
          Removes from executable drive @bus.
          Bus must be DataBus object.
        */
        pop : function(bus){
          each(drive, function(b, i){
            if(bus.$$id == b.$$id){
              drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
            }
          });
          return bus;
        },

        /* 
          Removes from executable drive @bus and all @bus children;
          @bus must be DataBus object.
        */
        popAllDown : function(bus){
          var self = this;
          each(self.pop(bus).children, function(e){
            self.popAllDown(e);
          });
        },

        /* 
          Removes from executable drive @bus, @bus.parent and @bus.parent.parent etc
          @bus must be DataBus object
        */
        popAllUp : function(bus){
          var match = this.pop(bus);
          if(is.exist(match.parent)){
            this.popAllUp(match.parent);
          }
        },

        /*
          Creates empty DataBus object and hoist it to the current stream
        */
        get : function(){
          var bus = new DataBus();
          bus.host(this);
          return bus;
        }
      };
    }

    /* 
      Creates stream of @x on context @context;
      If @strict argument is truly, than it warns about the coincidence 
      in the context to prevent overwriting;
    */
    return function(x, context, strict){
      var stream, xstr, reserved = [], i;

      Analyze("makeStream", x);
      
      context = context || {};  
      stream = Stream(context);

      if(is.fn(x)){

        /* If we strict in context */
        if(strict===true){
          xstr = x.toString();

          for(i in context){
            if(context.hasOwnProperty(i))
              reserved.push(i);
          }

          each(reserved, function(prop){
            if(xstr.indexOf("this."+prop)>=0){
              /* If there is a coincidence, we warn about it */
              console.error("Coincidence: property: '" + prop + "' is already defined in stream context!", context);
            }
          });    
        }

        x.call(context, function(expectedData){
          stream.eval(expectedData);
        });  
      }
      return stream;
    };
  })();

  /*
    Globals:
      DataBus
  */
  /*
    DataBus module.
    Version: v1.0.1
    Implements data processing through stream. 

    -- v1.0.1 --
      Fixed bindings array

    -- v1.0.0 --
      Incapsulated properties of data bus [fire, process, binding, host, setup] 
      and all these properties now configures from prototype's methods
  */

  var DataBus = (function(){
    var each = Utils.each, is = Utils.is,
    _private = (function(){
      var collection = {};
      return function (id, param, value){
        if(is.exist(value)){
          if(is.fn(value)){
            collection[id][param] = value(collection[id][param]);  
          }else{
            collection[id][param] = value;
          }         
        }else{
          if(collection[id] && is.exist(collection[id][param])){
            return collection[id][param]
          }else{
            collection[id] = param;
            return collection[id];
          }
        }
        return collection[id][param];
      }
    })();

    
    function inheritFrom(child, parent){
      child.parent = parent;
      parent.children.push(child);
    }

    function process(p){
      var nprocess, nbus, processor = _private(this.$$id, 'processor');
      if(!p){
        return processor;
      }
       /* Copying process */
      nprocess = [];
      each(processor.process(), function(i){
        nprocess.push(i);
      });
      nprocess.push(p);
      nbus = new DataBus(nprocess);
      nbus.host(this.host());
      inheritFrom(nbus, this);
      return nbus;  
    }

    /* **************************************************** */
    /* DATABUS CONSTRUCTOR AND PROTOTYPE ****************** */
    /* **************************************************** */

    function DataBus(proc){
      var self = this,
          bindings = [];

      this.$$id = Utils.$hash.set('d');

      _private(this.$$id, {
        processor : new Processor(proc || [], self),
        host : 0,
        handlers : [],
        setup : function(x){ return x}
      });

      this.parent = null;
      this.children = [];
      this._ = {  
        fires : new Utils.Queue(),
        takes : new Utils.Queue(),
        last : null
      };
      
      this.bindTo = function(a,b,c) {
        var binding = Warden.watcher(this, a, b, c);
        bindings.push(binding);      
        return binding;
      };

      this.update = function(e) {
        bindings.length && each(bindings, function(binding){
          binding.update(e || self._.takes.last());
        });
      };
    }

    DataBus.prototype.fire = function(data, context) {
      var id = this.$$id,
          self = this,
          handlers = _private(id, 'handlers'),
          processor = _private(id, 'processor');

      data = _private(id, 'setup')(is.exist(data) ? data : {}); //setting up data

      this._.fires.push(data); // pushing fired data to @fires queue

      processor.start(data, context, function(result){
        self._.takes.push(result); // pushing taked data to @takes queue 
        self._.last = result;
        self.update(result);

        /* Executing all handlers of this DataBus */
        each(handlers, function(handler){
          handler.apply(context, [result]);
        });

      });
    };
    
    DataBus.prototype.setup = function(fn) {
      Analyze('setup', fn);
      _private(this.$$id, 'setup', function(setup){
        return fn
      });
    };  

    DataBus.prototype.host = function(host) {
      return host ? _private(this.$$id, 'host', host) : _private(this.$$id, 'host');
    };

    /* 
      Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus 

      This function don't create new DataBus object it just puts to the current data bus 
      object's handlers list new handler and push it's to the executable drive of hoster stream 
    */
    DataBus.prototype.listen = function(x){
      var self = this;
      _private(this.$$id, 'handlers' , function(handlers){
        handlers.push(is.fn(x) ? x : function(){console.log(x)});
        if(handlers.length<=1){
          self.host().push(self);
        }
        return handlers;
      });
      return this;
    };

    /*
      Unbinds handler with name @x (if @x is string) or @x handler (if @x is function) 
      If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
    */
    DataBus.prototype.mute = function(x){
      x = is.fn(fn) ? x.name : x;
      
      each(_private(this.$$id, 'handlers'), function(handler, index){
        if(handler.name == x){
          _private(this.$$id, 'handlers', function(handlers){
            return handlers.slice(0,index).concat(handlers.slice(index+1,handlers.length));
          });
        }
      });
      return this;
    };

    /* Logging recieved data to console or logger */
    DataBus.prototype.log = function(){
      return this.listen(function(data){
        return console.log(data);
      });
    };

    /* 
      Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
    */
    DataBus.prototype.filter = function(x) {
      Analyze('filter', x);
      return process.call(this, function(e, drive){
        return x.apply(this, [e]) === true ? drive.$continue(e) : drive.$break();
      });
    };

    /*
      Mapping recieved data and transmit mapped to the next processor 
      If @x is string:
        and data[x] exists : result = data[x],
        and data[x] doesn't exist: result = x
      else @x is function:
        anyway: result = x(data)
      else @x is array:
        (recurently with each index of array)
      else @x is object:
        (recurently with each property of array with name data[x] : x)
      else
        reulst = x
    */
    DataBus.prototype.map = function(x) {
      var fn, es;
      if(is.fn(x)){
        fn = function(e, drive){
          return drive.$continue(x.call(this, e));
        }
      }else
      if(is.str(x)){      
        
        if(x.indexOf('/')>=0){
          return this.get(x);
        }

        fn = function(e, drive){
          var t = e[x], 
              r = is.exist(t) ? t : x;
          return drive.$continue(r);
        }
      }else
      if(is.array(x)){      
        fn = function(e, drive){
          var res = [];
          each(x, function(i){
            var t = e[i];
            res.push(is.exist(t) ? t : i);
          }); 
          return drive.$continue(res);
        }
      }else
      if(is.obj(x)){
        fn = function(e, drive){
          var res = {}, t;
          for(var prop in x){
            t = e[x[prop]];
            res[prop] = is.exist(t) ? t : x[prop];
          }
          return drive.$continue(res);
        }
      }else{
        fn = function(e, drive){
          return drive.$continue(x);
        }
      }
      return process.call(this, fn);
    };

    DataBus.prototype.nth = function(x) {
      Analyze('nth', x);
      process.call(this, function(e, drive){
        return drive.$continue(e[x]);
      });
    }

    DataBus.prototype.get = function(s) {
      Analyze('get', s);

      var map = s.split('/');

      return process.call(this, function(data, drive){
        var current = data;

        each(map, function(elem){
          var cand, last = elem.length-1;

          if(elem[0]=='[' && elem[last]==']'){
            cand = elem.slice(1,last);
            if(is.exist(cand)){
              if(is.num(parseInt(cand))){
                elem = parseInt(cand);
              }else{
                throw "Wrong syntax at DataBus.get() method";
              }
            }
          }else{
            if(!is.exist(current[elem])){
              throw "Can't find " + elem + " property";
            }
          }

          current=current[elem];

        });

        return drive.$continue(current);
      });
    }

    /* 
      Appying @fn function ot the previos and current value of recieved data 
      If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
    */
    DataBus.prototype.reduce = function(init, fn){
      if(arguments.length==1){
        fn = init;
        init = undefined;
      }
      Analyze('reduce', fn);
      return process.call(this, function(event, drive){
        var bus = drive.$host(), prev = init, cur = event;

        if(bus._.takes.length > 0){
          prev = bus._.takes.last();
        }
        return drive.$continue(fn.call(this, prev, cur));
      });   
    };

    /* 
      Take only @x count or (if @x is function) works like .filter()
    */
    DataBus.prototype.take = function(x){
      Analyze('take', x);
      if(is.fn(x)){
        return this.filter(x);
      }else{
        return process.call(this, function(e, drive){
          var bus = drive.$host();
          bus._.limit = bus._.limit || x;
          if(bus._.takes.length === bus._.limit){
            return drive.$break();
          }else{
            return drive.$continue(e);
          }
        });
      }
    };

    
    DataBus.prototype.include = function() {
      var argv = arguments, 
          argc = argv.length;

      return process.call(this, function(data, drive){
        var bus = drive.$host(), prop;
        
        for(var i=0, l=argc; i<l; i++){
          prop = argv[i];
          if(is.array(prop)){
            for(var j=0, k=prop.length;j<k;j++){
              if(is.exist(bus._[prop[j]])){
                data[prop[j]] = bus._[prop[j]]
              }
            }
          }else{
            if(is.exist(bus._[prop])){
              data[prop] = bus._[prop];
            }
          }
        }
      
        return drive.$continue(data);
      });  
    };

    /*
      Skips data [Integer] @c times
    */
    DataBus.prototype.skip = function(c) {
      Analyze('skip', c);
      return process.call(this, function(e, drive){
        var bus = drive.$host();
        if(bus._.fires.length <= c){
          drive.$break();
        }else{
          return drive.$continue(e);
        }
      });  
    };

    /*
      Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.interpolate = function(s, reg){
      Analyze('interpolate', s);
      return process.call(this, function(event, drive){
        var regex = reg || /{{\s*[\w\.]+\s*}}/g;
        return drive.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
      })
    };

    /*
      Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.mask = function(o, reg){
      Analyze('mask', o);
      return process.call(this, function(event, drive){
        var regex = reg || /{{\s*[\w\.]+\s*}}/g;
        return drive.$continue(event.replace(regex, function(i){
          return o[i.slice(2,-2)];
        }));
      });
    };

    /* 
      Transfers only unique datas through bus. 
      [Function] @cmp - is comparing method that returns 
      [Boolean] 'true' if first argument of @cmp is equals to second argument

      By default: @cmp compares arguments with === operator
    */
    DataBus.prototype.unique = function(cmp){
      cmp = is.fn(cmp) ? cmp : function(a,b){
        return a===b;    
      }
      return process.call(this, function(event, drive){
        var fires = drive.$host()._.fires;
        var takes = drive.$host()._.takes;
        if( (fires.length > 1 || takes.length > 0) && (cmp(event, fires[fires.length-2]) || cmp(event, takes.last())) ){      
          return drive.$break();
        }else{
          return drive.$continue(event);
        }  
      });
    };

    /*
      Debounce data bus on [Integer] @t miliseconds
    */
    DataBus.prototype.debounce = function(t) {
      Analyze('debounce', t)
      return process.call(this, function(e, drive){
        var self = this, bus = drive.$host();
        clearTimeout(bus._.dbtimer);
        bus._.dbtimer = setTimeout(function(){
          delete bus._.dbtimer;
          drive.$unlock();
          drive.$continue(e);
        }, t);      
        drive.$lock();
      });
    };

    /* 
      Collecting events for [Integer] @t miliseconds and after it transmitting an array of them 
    */
    DataBus.prototype.getCollected = function(t){
      Analyze('getCollected', t);
      return process.call(this, function(e, drive){
        var self = this, 
            bus = drive.$host(),
            fired = bus._.fires.length-1;
        bus._.tmpCollection = bus._.tmpCollection || [];
        bus._.tmpCollection.push(e);
        if(!bus._.timer){
          bus._.timer = setTimeout(function(){
            var collection = bus._.tmpCollection;

            clearTimeout(bus._.timer);
            delete bus._.timer;
            delete bus._.tmpCollection
            
            drive.$unlock();
            drive.$continue(collection);
          }, t);
          drive.$lock();
        }else{
          drive.$lock();
        }
      });
    };

    DataBus.prototype.after = function(bus, flush){
      var busExecuted = false;
      bus.listen(function(){
        busExecuted = true;
      });
      return process.call(this, function(event, drive){
        if(busExecuted){
          busExecuted = flush === true ? false : true;
          drive.$unlock();
          drive.$continue(event);
        }else{
          drive.$lock();
        }
      });
    };

    DataBus.prototype.waitFor = function(bus){
      var self = this;
      return Warden.makeStream(function(emit){
        var exec = false, val,         
            clear = function(){
              val = null; 
              exec = false;
            };

        bus.listen(function(data){
          if(exec){
            emit(val);
            clear();
          }
        });

        self.listen(function(data){
          val = data;
          exec = true;
        });

      }).get();
    };

    /* 
      Merges with @bus 
    */
    DataBus.prototype.merge = function(bus){
      var self = this,
      nbus = Warden.makeStream(function(emit){
        bus.listen(emit);
        self.listen(emit);
      }).get();
      
      return nbus;
    };


    DataBus.prototype.resolveWith = function(bus, fn) {
      var self = this, ctx = this.host().$$context;
      return Warden.makeStream(function(emit){
        self.sync(bus).listen(function(data){
          var d1 = data[0], d2 = data[1];
          emit(fn.call(ctx, d1, d2));
        });
      }, ctx).get();
    };

    DataBus.prototype.combine = function(bus, fn, ctx){
      var self = this, ctx = ctx || this.host().$$context, a, b;
      bus.listen(function(event){b = event;});
      this.listen(function(event){a = event;});

      return Warden.makeStream(function(emit){
        function e(x){emit(fn.call(ctx, a,b));}
        self.listen(e);
        bus.listen(e);
      }, ctx).get();
    };

    /* Synchronizes two buses */

    DataBus.prototype.sync = function(bus){
      var self = this,
      bus = Warden.makeStream(function(emit){
        var exec1 = false, exec2 = false, val1, val2,
            clear = function(){
              val1 = null; 
              val2 = null;
              exec1 = false,
              exec2 = false;
            };

        bus.listen(function(data){
          if(exec1){
            emit([val1, data]);
            clear();
          }else{
            val2 = data,
            exec2 = true;
          }
        });

        self.listen(function(data){
          if(exec2){
            emit([data, val2]);
            clear();
          }else{
            val1 = data;
            exec1 = true;
          }
        })
      }).get();
      inheritFrom(bus, this);
      return bus;
    };

    /*
      Locking evaluation of current bus
    */
    DataBus.prototype.lock = function(params){
      if(!is.exist(params)){
        this.host().pop(this)
      }else{
        Analyze('lock', params);
        switch(params){
          case '-c':
            this.lockChildren();
          break;
          case '-P':
            this.lockParents();
          break;
          case '-p':
            this.host().pop(this.parent);
          break;
        }
      }
    };

    /*
      Locking evaluation of current bus and all of his children buses
    */
    DataBus.prototype.lockChildren = function() {
      this.host().popAllDown(this);
    };

    /*
      Locking evaluation of current bus' parent
    */
    DataBus.prototype.lockParents = function() {
      this.host().popAllUp(this);
    };

    /* Unlocks current bus */
    DataBus.prototype.unlock = function(){
      this.host().push(this);
    };

    DataBus.prototype.unlockChildren = function(){
      this.host().pushAllDown(this);
    }

    DataBus.prototype.unlockParents = function(){
      this.host().push(this);
      function unlock(bus){
        if(is.exist(bus.parent)){
          bus.host().push(bus.parent);
          unlock(bus.parent);
        }
      }
      unlock(this);
    }

    Warden.configure.addToDatabus = function(fn, name, argc, toAnalyze){
      name = name || fn.name;
      DataBus.prototype[name] = function() {
        var self = this, 
            argv = arguments;
        Analyze(name, arguments[toAnalyze || 0]);
        if(argc && argc!=arguments.length){
          throw "Unexpected arguments count";
        }
        return process.call(this,fn(arguments))
      };
    }

    return DataBus;
  })();

  /*
    Globals:
      Warden.watcher
  */
  /* 
  	Watcher module:
  		version: 0.1.0
  */

  Warden.watcher = (function(){
  	var is = Utils.is,
  		each = Utils.each;

  	return function(bus, a, b, c){
  		var fn;

  		if(!is.exist(b) && is.exist(a)){
  			if(is.str(a)){
  				fn = function(event){
  					return this[a] = event;
  				}			

  			}else
  			if(is.obj(a)){
  				fn = function(event){
  					a = event;
  				}
  			}else
  			if(is.fn(a)){
  				fn = function(event){
  					return a(event);
  				}
  			}
  		}else

  		if(is.exist(b)){
  			if(is.obj(a) && is.str(b)){
  				if(b.split('/').length>1){
  					var dest = "";
  					each(b.split('/'), function(name){
  						if(!is.exist(eval("a" + dest)[name])){
  							throw "Unknown property: " + name + " from chain: " + b;
  						}
  						dest += ('["'+name+'"]');
  					});
  					fn = function(event){
  						eval("a" + dest + "= event");
  					}
  				}else{
  					if(is.fn(a[b])){
  						fn = function(event){
  							a[b](event);
  						}
  					}else{
  						fn = function(event){
  							return a[b] = event;
  						}
  					}
  				}
  			}else

  			if(is.obj(a) && is.fn(b)){
  				fn = function(event){
  					return b.call(a, event);
  				}
  			}
  		}

  		bus.listen(fn);

  		return Utils.extend(new (function Observable(){}), {
  			update : fn,
  			unbind : function(name){
  				bus.mute(name);
  			},
  			bind : function(f){
  				bus.listen(fn || fn)
  			}
  		});

  	};
  })();

  /* 
  	Equilizer Module:
  	version: 0.0.1
  */

  Warden.Equilizer = (function(){
  	var each = Utils.each;

  	var self = {},
  		compractor,
  		collection = {
  			sortings : {
  				data : [],
  				bus : null
  			}
  		}


  	
  	self.sort = function(bus){
  		var merged = Warden.makeStream().get();

  		collection.sortings.data.push(bus);
  		collection.sortings.bus = null;

  		each(collection.sortings.data, function(i){
  			merged =  merged.merge(i);
  		});

  		merged.listen(function(data){
  			compractor(data);
  		});

  		collection.sortings.bus = merged;

  		return self;
  	}


  	return function Equilizer(fn){
  		Analyze('Equilizer', fn);

  		compractor = fn;
  		return self;
  	}
  })();


  
}));