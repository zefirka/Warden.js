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

  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.1.2"; 
  Warden.configure = {};
  
  /* 
    Globals: 
      Utils
      Analyze
  */
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

        /* Interpolation */
        interpolate : interpolate, 
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

  /*
    Globals:
      Warden.extend
  */
  /* 
    Extend module: 
      docs: ./docs/Extend.md
      version: v1.1.0
    
    -- v1.1.0 --
      Incapsulated $$handlers and now shows only $$id of object
      Added extended arrays methods sequentially and toBus
      Added multiple events listenins, unlistening and streaming

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
        arrayMethods : ['pop', 'push', 'slice', 'splice',  'reverse', 'join', 'concat', 'shift', 'sort', 'unshift'],
        names : {
          emit : 'emit',
          listen : 'listen',
          stream : 'stream',
          unlisten : 'unlisten'
        },
        emitter : null, /* custom event emitter if exists */
        listener : null /* custrom event listener if exists */
      },

      ghandlers = {}, //global storage for handlers

      setHandlers = function(id){
        ghandlers[id] = ghandlers[id] || [];
        each(Utils.toArray(arguments).slice(1), function(handler){
          ghandlers[id].push(handler);
        });
        return ghandlers[id];
      },

      getHandlers = function(id){
        return ghandlers[id] || [];
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
          /* Extending methods of a current array with stream evaluation */
          each(
            map(config.arrayMethods, function(fn){
            return {
              name: fn,
              fun: Array.prototype[fn] }
            }), 
            function(item){
              obj[item.name] = function(){
                var argv = Array.prototype.slice.call(arguments);
                item.fun.apply(obj, argv);
                obj.emit({
                  type: item.name, 
                  current: obj,
                  data: argv
                });
              }
            }
          );

          Utils.extend(inheritor, {
            sequentially : function(timeout){
              var bus = Warden.makeStream().get(),
                  self = this,
                  i = 0,
                  interval = setInterval(function(){
                    if(i==self.length){
                      i=0;
                      clearInterval(interval);                    
                    }else{
                      bus.fire(self[i++])
                    }
                  }, timeout);

              return bus;
            },
            toBus : function(){
              var bus = Warden.makeStream().bus();
              each(inheritor, function(item, index){
                bus.data.last = bus.data.takes[index] = bus.data.fires[index] = item
              });
              return bus;
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
      if(jQueryInited && (!isConstructor ? obj instanceof jQuery : true)){
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
            callbacks = filter(getHandlers(this['$$id'] = this['$$id'] || Utils.$hash.set('o')), function(i){
              return i.type == type;
            });
        
        each(callbacks, function(callback){
          callback.callback.call(self, data);
        });
          
        return this;
      };

      /* listen events of @type */
      inheritor[names.listen] = function(types, callback){
        var self = this,
            handlers = getHandlers(this['$$id'] = this['$$id'] || Utils.$hash.set('o'));
        
        Analyze('listen', types);

        each(types.split(','), function(type){
          type = Utils.trim(type);
          if(!filter(handlers, function(i){return i.type == type;}).length && self[config.listener]){
            self[config.listener].apply(self, [type, function(event){ 
              self.emit(event)
            }]);
          }
        
          setHandlers(self['$$id'], {
            type: type,
            callback: callback
          });
        });

        return this;
      };

      /* Unsubscribe from events of @type */
      inheritor[names.unlisten] = function(types, name){
        var self = this, handlers = getHandlers(this['$$id'] = this['$$id'] || Utils.$hash.set('o'));

        Analyze('unlisten', types)

        each(types.split(','), function(type){
          type = Utils.trim(type);
          if(handlers.length){
            var indexes = [];
            each(handlers, function(handler, index){
              if(handler.callback.name == (name.name || name)){
                indexes.push(index);
              }
            });
            each(indexes, function(i){
              handlers.splice(i,1);
            });
          }
        });

        return this;
      };

      /* Creates stream of @type type events*/
      inheritor[names.stream] = function(types, cnt) {
        var self = this,
            stream = Warden.makeStream(types, cnt || this),
            handlers = getHandlers(this['$$id'] = this['$$id'] || Utils.$hash.set('o'));

        Analyze('stream', types);

        each(types.split(','), function(type){
          type = Utils.trim(type);

          if(!filter(handlers, function(i){return i.type == type;}).length && self[config.listener]){
            self[config.listener].apply(self, [type, function(event){
              stream.eval(event);      
            }]);
          }

          setHandlers(self['$$id'], {
            type: type,
            callback: function(event){
              stream.eval(event);
            }
          });

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
    Version: v1.0.0;
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
      version: 1.0.0
    
    -- v1.0.0 --
      - Added sprint/stop method.

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
      var drive = [],
          interval;

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
        
        transform : function(transformer){
          if(is.fn(transformer)){
            drive = Utils.map(drive, function(bus){
              transformer(bus);
            });
          }
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

        sprint : function(time, gen){
          var iter = 0, self = this;
          interval = setInterval(function(){
            if(drive[iter]){
              drive[iter].fire(gen ? gen(iter) : iter);
            }else{
              self.stop();
            }
            iter++;
          }, time);
        },

        stop : function(){
          clearInterval(interval)
        },

        /*
          Creates empty DataBus object and hoist it to the current stream
        */
        get : function(){
          var bus = new DataBus();
          bus.host(this);
          return bus;
        },

        bus : function(){
          return this.get();
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
    Version: v1.1.1
    Implements data processing through stream. 

    -- v.1.1.1 --
      Bugfixes

    -- v.1.1.0 --
      Added .delay and .repeat methods. 
      Changed incapsulation method to more efficient

    -- v1.0.3 --
      Added comments

    -- v1.0.2 --
      Added DataBus.toggle method;
      Added Unique to Analyzator;
      Added DataBus.syncFlat method
      Little optimizations

    -- v1.0.1 --
      Fixed bindings array

    -- v1.0.0 --
      Incapsulated properties of data bus [fire, process, binding, host, setup] 
      and all these properties now configures from prototype's methods
  */

  var DataBus = (function(){
    var each = Utils.each, is = Utils.is,
    priv = {
      set: function(id, e, val){
        return is.obj(e) && !is.exist(val) ? this[id] = e : this[id][e] = is.fn(val) ? val(this[id][e]) : val;
      },
      get: function(id, e){
        return is.exist(e) ? this[id][e] : this[id];
      }
    }
    
    function inheritFrom(child, parent){
      child.parent = parent;
      parent.children.push(child);
    }

    function process(p){
      var nprocess, nbus, processor = priv.get(this.$$id, 'processor');
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
          id = this.$$id = Utils.$hash.set('d');

      this.parent = null;
      this.children = [];
      this.data = {  
        fires : new Utils.Queue(),
        takes : new Utils.Queue(),
        last : null
      };
      
      priv.set(id, {
        bindings : [],
        processor : new Processor(proc || [], self),
        host : 0,
        handlers : [],
        setup : function(x){ return x}
      });
    }

    DataBus.prototype.bindTo = function(a,b,c) {
      var binding = Warden.watcher(this, a, b, c);
      priv.get(this.$$id, 'bindings').push(binding);
      return binding;
    };

    DataBus.prototype.update = function(e) {
      var bindings = priv.get(this.$$id, 'bindings');
      bindings.length && each(bindings, function(binding){
        binding.update(e || self.data.takes.last());
      });
    };

    DataBus.prototype.fire = function(data, context) {
      var id = this.$$id, self = this;

      data = priv.get(id, 'setup')(is.exist(data) ? data : {}); //setting up data
      this.data.fires.push(data); // pushing fired data to @fires queue

      priv.get(id, 'processor').start(data, context, function(result){
        self.data.takes.push(result); // pushing taked data to @takes queue 
        self.update(self.data.last = result); 

        /* Executing all handlers of this DataBus */
        each(priv.get(id, 'handlers'), function(handler){
          handler.call(context, result);
        });

      });
    };
    
    DataBus.prototype.setup = function(fn) {
      Analyze('setup', fn);
      priv.set(this.$$id, 'setup', function(){
        return fn
      });
    };  

    DataBus.prototype.host = function(host) {
      return host ? priv.set(this.$$id, 'host', host) : priv.get(this.$$id, 'host');
    };

    /* 
      Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus 

      This function don't create new DataBus object it just puts to the current data bus 
      object's handlers list new handler and push it's to the executable drive of hoster stream 
    */
    DataBus.prototype.listen = function(x){
      var self = this;
      priv.set(this.$$id, 'handlers' , function(handlers){
        handlers.push(x);
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
      
      each(priv.get(this.$$id, 'handlers'), function(handler, index){
        if(handler.name == x){
          priv.set(this.$$id, 'handlers', function(handlers){
            return handlers.slice(0,index).concat(handlers.slice(index+1,handlers.length));
          });
        }
      });
      return this;
    };

    /* Logging recieved data to console or logger */
    DataBus.prototype.log = function(x){
      return this.listen(function(data){
        return console.log(x || data);
      });
    };

    /* 
      Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
    */
    DataBus.prototype.filter = function(x) {
      Analyze('filter', x);
      return process.call(this, function(e, drive){
        return x.call(this, e) === true ? drive.$continue(e) : drive.$break();
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
      return process.call(this, function(e, drive){
        return drive.$continue(e[x]);
      });
    }

    DataBus.prototype.get = function(s) {
      Analyze('get', s);
      return process.call(this, function(data, drive){
        var current = data;
        each(s.split('/'), function(elem){
          var cand;

          if(elem[0]=='[' && elem[elem.length-1]==']'){
            cand = elem.slice(1,-1);
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
      Analyze('reduce', fn);

      if(arguments.length==1){
        fn = init;
        init = void 0;
      }
      return process.call(this, function(event, drive){
        var bus = drive.$host(), 
            cur = event, 
            prev = bus.data.takes.length > 0 ? bus.data.takes.last() : init;

        return drive.$continue(fn.call(this, prev, cur));
      });   
    };

    /* 
      Take only @x count or (if @x is function) works like .filter()
    */
    DataBus.prototype.take = function(x){
      Analyze('take', x);

      return process.call(this, function(e, drive){
        var bus = drive.$host();
        bus.data.limit = bus.data.limit || x;
        if(bus.data.takes.length === bus.data.limit){
          return drive.$break();
        }else{
          return drive.$continue(e);
        }
      }); 
    }

    
    DataBus.prototype.include = function() {
      var argv = Utils.toArray(arguments), 
          argc = argv.length;
      return process.call(this, function(data, drive){
        var bus = drive.$host();

        each(argv, function(prop){
          Analyze('include', prop);
          if(is.exist(bus.data[prop])){
            data[prop] = bus.data[prop];
          }
        });      
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
        return bus.data.fires.length > c ? drive.$continue(e) : drive.$break();
      });  
    };

    /*
      Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.interpolate = function(s, reg){
      Analyze('interpolate', s);
      return process.call(this, function(event, drive){
        return drive.$continue(Utils.interpolate(s, event))
      })
    };

    /*
      Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.mask = function(o, reg){
      Analyze('mask', o);
      return process.call(this, function(event, drive){
        return drive.$continue(is.str(event) ? Utils.interpolate(event, o) : event);
      });
    };

    /* 
      Transfers only unique datas through bus. 
      [Function] @cmp - is comparing method that returns 
      [Boolean] 'true' if first argument of @cmp is equals to second argument

      By default: @cmp compares arguments with === operator
    */
    DataBus.prototype.unique = function(compractor){
      Analyze('unique', compractor);

      compractor = compractor || function(a,b){return a===b;}

      return process.call(this, function(event, drive){
        var data = drive.$host().data, fires = data.fires, takes = data.takes,
            cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
          return cons ? drive.$break() : drive.$continue(event);
      });
    };

    /*
      Debounce data bus on [Integer] @t miliseconds
    */
    DataBus.prototype.debounce = function(t) {
      Analyze('debounce', t)

      return process.call(this, function(e, drive){
        var self = this, bus = drive.$host();
        clearTimeout(bus.data.dbtimer);
        bus.data.dbtimer = setTimeout(function(){
          delete bus.data.dbtimer;
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
            fired = bus.data.fires.length-1;
        bus.data.tmpCollection = bus.data.tmpCollection || [];
        bus.data.tmpCollection.push(e);
        if(!bus.data.timer){
          bus.data.timer = setTimeout(function(){
            var collection = bus.data.tmpCollection;

            clearTimeout(bus.data.timer);
            delete bus.data.timer;
            delete bus.data.tmpCollection
            
            drive.$unlock();
            drive.$continue(collection);
          }, t);
          drive.$lock();
        }else{
          drive.$lock();
        }
      });
    };

    DataBus.prototype.equals = function(x){
      return this.filter(function(y){
        return x === y;
      });
    }

    DataBus.prototype.delay = function(time) {
      Analyze('delay', time);
      return process.call(this, function(e, drive){
        setTimeout(function(){
          drive.$continue(e)
        }, time);
      });
    };

    DataBus.prototype.repeat = function(time) {
      var interval;
      Analyze('repeat', time);
      
      this.stopRepeating = function(){
        clearInterval(interval);
      }

      return process.call(this, function(e, drive){
        interval = setInterval(function(){
          drive.$continue(e)
        }, time);
      });
    };

    DataBus.prototype.toggle = function(a,b) {
      var self = this;
      this.data.toggle = false;
      return process.call(this, function(e, drive){
        var fun = self.data.toggle ? a : b;
        self.data.toggle = !self.data.toggle;
        return drive.$continue(fun.call(self, e));
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


    DataBus.prototype.debug = function() {
      process.call(this, function(event, drive){
        debugger;
        drive.$continue(event);
      });
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
      nbus = Warden.makeStream(function(emit){
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
      }).bus();
      inheritFrom(nbus, this);
      return nbus;
    };

    DataBus.prototype.syncFlat = function(bus){
      var self = this,
      nbus = Warden.makeStream(function(emit){
        self.sync(bus).listen(function(arr){
          emit.call(this, Utils.flatten(arr));
        })
      }).bus();
      inheritFrom(nbus, this);
      return nbus;    
    };

    /* Lock/unlock methods */
    DataBus.prototype.lock = function(){
      this.host().pop(this);
    };

    DataBus.prototype.lockChildren = function() {
      this.host().popAllDown(this);
    };
    
    DataBus.prototype.lockParents = function() {
      this.host().popAllUp(this);
    };
    
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
  		var argv = Utils.toArray(arguments).slice(1,arguments.length),
  			argc = argv.length,
  			fn;

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
  
  if(jQueryInited){
    Warden.extend(jQuery);
  }

}));