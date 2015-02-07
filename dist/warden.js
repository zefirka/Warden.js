((function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports);   } else {
    if(root.Warden == null){       Warden = {};
    }
    factory(Warden);
    if (typeof define === "function" && define.amd) {
      define(Warden);     } else {
      root.Warden = Warden;     }
  }
})(this, function(Warden){

  'use strict';

  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.2.0-prerelease";
  Warden.configure = {
    cmp : function(x,y){ return x === y; }
  };

  /*
    Globals:
      Utils
      Analyze
  */
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
        each : each,         filter : filter,
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
              reg = /{{\s*[\w\.\/\[\]]+\s*}}/g;

          if(argc==2 && is.obj(argv[1])){
            data = argv[1];
          }else{
            each(argv.slice(1, argc), function(e, i){
              data[i] = e;
            });
          }       

          return str.replace(reg, function(i){
            var arg = Utils.getObject(data, i.slice(2,-2)) || i;
            if(is.obj(arg)){
              arg=JSON.stringify(arg);
            }          
            return arg;
          });
        }, 

        log : function(){
          console.log(this.interpolate.apply(this, arguments));
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
    Analyze = (function(map){
      return function(id, i, l){
        var t = map[id],
            res = !Utils.is.exist(t) ? true : Utils.some(t, function(type){return typeof i === type});

        if(!res){
          throw "TypeError: invalid arg in: ." + id + "(). Expected: " + t.join(' or ') + ". Your argument is type of: " + typeof i;
        }
      } 
    })({
      extend : [_OBJ,_FUN, _ARR],
      listen : [_STR],
      stream : [_STR],
      unlisten : [_STR],
      reduce : [_FUN],
      include : [_OBJ, _FUN],
      take : [_NUM],
      filter : [_FUN],
      skip : [_NUM],
      setup : [_FUN],
      makeStream: [_UND, _STR, _FUN, _ARR],
      debounce : [_NUM],
      getCollected : [_NUM],
      interpolate : [_STR],
      mask : [_UND, _OBJ],
      unique : [_FUN, _UND],
      lock : [_STR],
      nth : [_NUM],
      get : [_STR]
    });

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
      version: v2.1.0
    
    -- v2.1.0
      Added full regexp notation for listen/stream/emit/unlisten

    -- v2.0.0
      Added regext for events (listen and emit)
      Fixed array extension usage (now simplier)

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
      filter = Utils.filter,
      extend = Utils.extend,
      hashc = Utils.$hash,
      nativeListener = "addEventListener",
      alternativeListener = "attachEvent",

      defaultConfig = {
        arrays : ['pop', 'push', 'splice', 'reverse', 'shift', 'unshift', 'sort'],         names : {
          emit : 'emit',
          listen : 'listen',
          stream : 'stream',
          unlisten : 'unlisten'
        },
        emitter : null, /* custom event emitter if exists */
        listener : null /* custrom event listener if exists */
      },

      ghandlers = {}, 
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

      function isRegExp(str){
        return /.?[\*\[\]\{\}\.\?\$\^\\\|].?/g.test(str);
      }

    return function(obj, conf) {
      Analyze('extend', obj);

      function binder (fn, handlers, callback){
        return function(type){
          var self = this;

          if(!filter(handlers, function(i){return is.str(type) ? i.type == type : i.type.test(type)}).length && self[config.listener]){
            if(is.not.str(type)){
              throw new Error("Invalid format in: " + config.listener);
            }
            this[config.listener].apply(this, [type, function(event){
              fn.call(self, event)
            }]);
          }

          setHandlers(self['$$id'], {
            type: type,
            callback: callback
          });
        }
      }


      var config = extend({}, defaultConfig, conf || {}),           inheritor = obj || {},           isConstructor = true,           names = config.names;

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
          each(config.arrays, function(fn){
            obj[fn] = function(){
              obj.constructor.prototype[fn].apply(obj, arguments);
              obj.emit({
                type: fn,
                current: obj,
                data: Utils.toArray(arguments)
              });
            }
          });

          inheritor.sequentially = function(timeout){
            var stream = Warden.makeStream(),
                self = this,
                i = 0,
                interval = setInterval(function(){
                  if(i==self.length){
                    i=0;
                    clearInterval(interval);
                  }else{
                    stream.eval(self[i++])
                  }
                }, timeout);

            return stream.bus();
          }
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
            callbacks = filter(getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), function(i){
              return is.str(i.type) ? i.type == type : i.type.test(type);
            });

        each(callbacks, function(callback){
          callback.callback.call(self, data);
        });

        return this;
      };

      /* Listen events of @type */
      inheritor[names.listen] = function(types, callback){
        var self = this,
          reactor = binder(function(event){
            this.emit(event);
          }, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), callback);

        Analyze('listen', types);

        each(types.split(','), function(type){
          type = Utils.trim(type);
          reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
        });

        return this;
      };

      /* Unsubscribe from events of @type */
      inheritor[names.unlisten] = function(types, name){
        var self = this, handlers = getHandlers(this['$$id'] = this['$$id'] || hashc.set('o'));

        Analyze('unlisten', types)

        each(types.split(','), function(type){
          type = Utils.trim(type);
          if(handlers.length){
            var indexes = [];
            each(handlers, function(handler, index){
              if(handler.callback.name == (name.name || name) && ( is.str(handler.type) ? handler.type == type : handler.type.test(type))){
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
      inheritor[names.stream] = function(types, cnt){
        Analyze('stream', types);

        var self = this,
            stream = Warden.makeStream(types, cnt || this),
            seval = function(event){
              stream.eval(event)
            },
            reactor = binder(seval, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), seval);
        
        each(types.split(','), function(type){
          type = Utils.trim(type);
          reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
        });

        return stream.bus();
      };

      return obj;
    };
  })();


  /*
    Globals:
      Pipeline
  */
  /*
    Pipe module:
    Implements interface to processing all databus methods.
    Version: v1.0.0;
  */
  function Pipeline(proc, host){
    var processes = proc || [], locked = 0, i = 0,

        /* Functional methods to manipulate DataBus processing workflow */
        fns = {
          /* Continue processing with @data */
          next: function(data){
             return self.tick(data);
          },
          /* Break processing */
          stop: function(){
            return self.tick({}, 1);
          },
          /* Locks DataBus evaluation */
          pause: function(){
            return locked = 1;
          },
          /* Unlocks DataBus evaluation */
          play: function(){
            return locked = 0;
          },
          /* Returns current DataBus */
          bus: function(){
            return host;
          }
        };

    var self = {
      /* Add process if @p exists or return all processes of this Processor */
      pipe : function(p){
        if(p){
          processes.push(p)
          return self;
        } 
        return processes;
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

  Warden.pipeline = Pipeline

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
    function Stream(context, type){
      var drive = [], interval;

      return {
        $$id : Utils.$hash.set('s'),         $$context : context,         $$type : type,
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
          Utils.forWhile(drive, function(b, i){
            if(bus.$$id == b.$$id){
              drive.splice(i, 1);
              return false;
            }
          }, false);
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
        bus : function(){
          var bus = new DataBus();
          bus.host = this;
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
    Version: v2.0.0
    Implements data processing through stream.

    -- v2.0.0 --
      Changed .merge[buses]
      Changed .sync(buses)
      Сhanged .map(str)

    -- v1.1.1 --
      Added method .equals which
      Optimized fire, get, reduce, include, skip, unique
      Removed logging strings via .listen([string]) method, now it possible to log string via .log([string]) method

    -- v1.1.0 --
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
    var each = Utils.each,
        is = Utils.is,
        toArray = Utils.toArray,
        handlers = {},
        pipes = {};

    function inheritFrom(child, parent){
      child.parent = parent;
      parent.children.push(child);
      return child;
    }

    function process(p){
      var pipe = pipes[this.$$id],
          newPipe = [],
          nbus;       

      if(!p){
        return pipe;
      }
       /* Copying process */
       /* TODO: Optimize copying */

      each(pipe.pipe(), function(i){
        newPipe.push(i);
      });
      newPipe.push(p);

      nbus = new DataBus(newPipe);
      nbus.host = this.host;
      return inheritFrom(nbus, this);
    }

    /* **************************************************** */
    /* DATABUS CONSTRUCTOR AND PROTOTYPE ****************** */
    /* **************************************************** */

    function DataBus(line){
      this.$$id = Utils.$hash.set('d')
      this.parent = null;
      this.children = [];
      this.bindings = [];
      handlers[this.$$id] = [];
      pipes[this.$$id] = Pipeline(line || [], this);

      this.data = {
        fires : new Utils.Queue(),
        takes : new Utils.Queue(),
        last : null
      };   

    }

    DataBus.prototype.bindTo = function() {
      var binding = Warden.watcher.apply(null, [this].concat(toArray(arguments)));
      this.bindings.push(binding);
      return binding;
    };

    DataBus.prototype.update = function(e){
      var self = this;
      each(this.bindings, function(binding){
        binding.update(e || self.data.takes.last());
      });
    };

    DataBus.prototype.fire = function(data, context) {
      var id = this.$$id, self = this;

      this.data.fires.push(data); 
      pipes[id].start(data, context, function(result){
        self.data.takes.push(result);         self.update(self.data.last = result);

        /* Executing all handlers of this DataBus */
        each(handlers[id], function(handler){
          handler.call(context, result);
        });

      });
    };


    /*
      Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus

      This function don't create new DataBus object it just puts to the current data bus
      object's handlers list new handler and push it's to the executable pipe of hoster stream
    */
    DataBus.prototype.listen = function(x){
      var self = this,
          handlersList = handlers[this.$$id];

      handlersList.push(x);
      
      if(handlersList.length<=1){
        self.host.push(self);
      }
      return this;
    };

    DataBus.prototype.watch = function(){    
      this.host.push(this);
      return this;
    };

    /*
      Unbinds handler with name @x (if @x is string) or @x handler (if @x is function)
      If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
    */
    DataBus.prototype.mute = function(x){
      x = is.fn(x) ? x.name : x;

      Utils.forWhile(handlers[this.$$id], function(handler, index){
        if(handler.name == x){
          handlers[this.$$id].splice(index, 1);
          return false;
        }
      }, false);

      return this;
    };

    /* Logging recieved data to console or logger */
    DataBus.prototype.log = function(x){
      return this.listen(function(data){
        console.log(x || data);
      });
    };

    /*
      Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
    */
    DataBus.prototype.filter = function(x) {
      Analyze('filter', x);
      return process.call(this, function(e, pipe){
        return x.call(this, e) === true ? pipe.next(e) : pipe.stop();
      });
    };

    /*
      Mapping recieved data and transmit mapped to the next processor
    */
    DataBus.prototype.map = function(x) {
      var fn, simple = function(e, pipes){
            return pipes.next(x);
          }

      switch(typeof x){
        case "function":
          fn = function(e, pipe){
            return pipe.next(x.call(this, e));
          }
        break;
        case "string":
          if(x.indexOf('/')>=0){
            return this.get(x);
          }

          if(x[0]=='.'){
            fn = function(e, pipe){
              var t = x.indexOf("()") > 0 ?  e[x.slice(1,-2)] : e[x.slice(1)],
              r = is.exist(t) ? t : x,
              res = r;

              if(is.fn(r) && x.indexOf("()")>0){
                res = r();
              }
              return pipe.next(res);
            }
          }else
          if(x[0]=='@'){
            if(x.length==1){
              fn = function(e, pipes){
                pipes.next(this);
              }
            }else{
              fn = function(e, pipe){
                var t = x.indexOf("()") > 0 ?  this[x.slice(1,-2)] : this[x.slice(1)],
                r = is.exist(t) ? t : x,
                res = r;

                if(is.fn(r) && x.indexOf("()")>0){
                  res = r.call(this);
                }
                return pipe.next(res);
              }
            }
          }else{
            fn = simple;
          }
        break;
        case "object":
          if(is.array(x)){
            fn = function(e, pipe){
              var res = [];
              each(x, function(i){
                var t;
                res.push(is.str(i) ? (i[0]=='.' ? (is.exist(t=e[i.slice(1)]) ? t : i) : i) : i );
              });
              return pipe.next(res);
            }
          }else{
            fn = function(e, pipe){
              var res = {}, val, name;
              for(var prop in x){
                name = x[prop];

                if(name.indexOf('.')==0 && e[name.slice(1)]){
                  val = e[name.slice(1)];
                }

                if(name.indexOf('@')==0 && (this[name.slice(1)] || this[name.slice(1,-2)])){
                  if(name.indexOf('()')>0){
                    val = this[name.slice(1,-2)]()
                  }else{
                    val = this[name.slice(1)]
                  }
                }

                res[prop] = val;
              }
              return pipe.next(res);
            }
          }
        break;
        default:
          fn = simple;
        break;
      }

      return process.call(this, fn);
    }

    /* Takes nth element of event */
    DataBus.prototype.nth = function(n) {
      Analyze('nth', n);
      return process.call(this, function(e, pipe){
        return pipe.next(e[n+1]);
      });
    }

    /*
      Takes element of event by given path:
        bus.get('propname/childpropname/arraypropname[2]/child') takes the child from:
        {
          propname: {
            childpropname: {
              arraypropname : [0, 1, {child: "THIS!"}]
            }
          }
        }
    */
    DataBus.prototype.get = function(s) {
      Analyze('get', s);
      return process.call(this, function(data, pipe){
        return pipe.next(Utils.getObject(data, s));
      });
    }

    /*
      Appying @fn function ot the previos and current value of recieved data
      If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
    */
    DataBus.prototype.reduce = function(init, fn){
      Analyze('reduce', (arguments.length==1 ? fn = init : fn));
      return process.call(this, function(event, pipe){
        var bus = pipe.bus();
        return (bus.data.takes.length == 0 && !is.exist(init)) ?  pipe.next(event) : pipe.next(fn.call(this, bus.data.takes.last() || init, event)) ;
      });
    };

    /*
      Take only @x count or (if @x is function) works like .filter()
    */
    DataBus.prototype.take = function(x){
      Analyze('take', x);

      return process.call(this, function(e, pipe){
        var bus = pipe.bus();
        bus.data.limit = bus.data.limit || x;
        return bus.data.takes.length === bus.data.limit ?  pipe.stop() : pipe.next(e);
      });
    }


    /*
      Skips data [Integer] @c times
    */
    DataBus.prototype.skip = function(c) {
      Analyze('skip', c);
      return process.call(this, function(e, pipe){
        return pipe.bus().data.fires.length > c ? pipe.next(e) : pipe.stop();
      });
    }

    /*
      Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.interpolate = function(s, reg){
      Analyze('interpolate', s);
      return process.call(this, function(event, pipe){
        return pipe.next(Utils.interpolate(s, event))
      })
    }

    /*
      Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    DataBus.prototype.mask = function(o, reg){
      Analyze('mask', o);
      return process.call(this, function(event, pipe){
        return pipe.next(is.str(event) ? Utils.interpolate(event, o) : event);
      });
    }

    /*
      Transfers only unique datas through bus.
      [Function] @cmp - is comparing method that returns
      [Boolean] 'true' if first argument of @cmp is equals to second argument

      By default: @cmp compares arguments with === operator
    */
    DataBus.prototype.unique = function(compractor){
      Analyze('unique', compractor);

      compractor = compractor || Warden.configure.cmp;

      return process.call(this, function(event, pipe){
        var data = pipe.bus().data, fires = data.fires, takes = data.takes,
            cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
          return cons ? pipe.stop() : pipe.next(event);
      });
    };

    /*
      Debounce data bus on [Integer] @t miliseconds
    */
    DataBus.prototype.debounce = function(t) {
      Analyze('debounce', t)

      return process.call(this, function(e, pipe){
        var self = this, bus = pipe.bus();
        clearTimeout(bus.data.dbtimer);
        bus.data.dbtimer = setTimeout(function(){
          delete bus.data.dbtimer;
          pipe.play();
          pipe.next(e);
        }, t);
        pipe.pause();
      });
    };

    /*
      Collecting events for [Integer] @t miliseconds and after it transmitting an array of them
    */
    DataBus.prototype.getCollected = function(t){
      Analyze('getCollected', t);
      return process.call(this, function(e, pipe){
        var self = this,
            bus = pipe.bus(),
            fired = bus.data.fires.length-1;
        bus.data.tmpCollection = bus.data.tmpCollection || [];
        bus.data.tmpCollection.push(e);
        if(!bus.data.timer){
          bus.data.timer = setTimeout(function(){
            var collection = bus.data.tmpCollection;

            clearTimeout(bus.data.timer);
            delete bus.data.timer;
            delete bus.data.tmpCollection

            pipe.play();
            pipe.next(collection);
          }, t);
          pipe.pause();
        }else{
          pipe.pause();
        }
      });
    };

    DataBus.prototype.filterFor = function(fn) {
      var data = null;
      return process.call(this, function(e, pipe){
        var pipes = {
          get : function(fn){
            return fn ? fn(data) : data;
          },
          next: function(e){
            data = e;
            pipe.next(e);
          },

          stop: function(e){
            pipe.stop();
          }
        }
        return fn(e, pipes);
      });
    };

    DataBus.prototype.collectFor = function(bus){
      var collection = [];

      this.listen(function(e){
        collection.push(e);
      });

      return Warden.makeStream(function(emit){
        bus.listen(function(){
          emit(collection);
          collection = [];
        })
      }).bus();
    }
                                                                                                                        
    DataBus.prototype.equals = function(x, cmp){
      cmp = cmp || Warden.configure.cmp;
      return this.filter(function(y){
        return cmp(x, y);
      });
    }

    DataBus.prototype.delay = function(time) {
      Analyze('delay', time);
      return process.call(this, function(e, pipe){
        setTimeout(function(){
          pipe.next(e)
        }, time);
      });
    };

    DataBus.prototype.toggle = function(a,b) {
      var toggled = false;
      
      return this.listen(function(data){
        if(toggled){
          a.call(this, data);
        }else{
          b.call(this, data);
        }
        toggled = !toggled;
      });
    };

    DataBus.prototype.after = function(bus, flush){
      var busExecuted = false;

      bus.listen(function(){
        busExecuted = true;
      });

      return process.call(this, function(event, pipe){
        if(busExecuted){
          busExecuted = flush === true ? false : true;
          pipe.play();
          pipe.next(event);
        }else{
          pipe.pause();
        }
      });
    };

    DataBus.prototype.repeat = function(times, delay){
      var self = this,
          cached = times,
      nbus = Warden.makeStream(function(emit){
        self.listen(function(data){
          var interval = setInterval(function(){
            if(times){
              emit(data);
              times--
            }else{
              times = cached;
              clearInterval(interval);
            }
          }, delay);
        });
      }).bus();

      return inheritFrom(nbus, this);
    }

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

      }).bus();
    };

    /*
      Usage: bus.merge(bus1, [bus2] ... [busN])
      Merges @bus with buses from arguments
    */
    DataBus.prototype.merge = function(){
      function merge(a, b, cnt){
        return Warden.makeStream(function(emit){
          a.listen(emit);
          b.listen(emit);
        }, cnt).bus();
      }

      var argv = Utils.toArray(arguments);
      argv.unshift(this);
      return Utils.reduce(argv, function(bus1, bus2){
        return merge(bus1, bus2, bus1.host.$$context);
      })
    };


    DataBus.prototype.resolveWith = function(bus, fn) {
      var self = this, ctx = this.host.$$context;
      return Warden.makeStream(function(emit){
        self.sync(bus).listen(function(data){
          emit(fn.call(ctx, data[0], data[1]));
        });
      }, ctx).bus();
    };

    /* Combines two bises with given function @fn*/
    DataBus.prototype.combine = function(bus, fn, seed){
      var self = this, ctx = this.host.$$context;

      return Warden.makeStream(function(emit){
        function e(a,b){
          emit(fn.call(ctx, a,b));
        }

        self.listen(function(data){
          e(data, bus.data.last || seed);
        });
        bus.listen(function(data){
          e(self.data.last || seed, data);
        });

      }, ctx).bus();
    };

    /* Synchronizes  buses */
    DataBus.prototype.sync = function(){
      var self = this,
          argv = Utils.toArray(arguments),
          values = [],
          executions = [],
          nbus;

      argv.unshift(this);

      values.length = executions.length = argv.length;

      nbus = Warden.makeStream(function(emit){
        each(argv, function(bus, index){
          bus.listen(function(data){
            var exec = executions.length ? true : false;

            Utils.forWhile(executions, function(state, i){
              if(i == index){
                return true;
              }
              if(!state){
                exec = false;
              }
              return state;
            }, false);

            values[index] = data;

            if(exec){
              emit(values);
              values = [];
              executions = [];
              values.length = executions.length = argv.length;
            }else{
              executions[index] = true;
            }

          });
        });
      }).bus();
      
      return inheritFrom(nbus, this);
    };

    DataBus.prototype.syncFlat = function(){
      var self = this,
          argv = Utils.toArray(arguments),

      nbus = Warden.makeStream(function(emit){
        self.sync.apply(self, argv).listen(function(arr){
          emit.call(this, Utils.flatten(arr));
        })
      }).bus();
      return inheritFrom(nbus, this);
    };

    /* Lock/unlock methods */
    DataBus.prototype.lock = function(){
      this.host.pop(this);
    }

    DataBus.prototype.lockChildren = function() {
      this.host.popAllDown(this);
    }

    DataBus.prototype.lockParents = function() {
      this.host.popAllUp(this);
    }

    DataBus.prototype.unlock = function(){
      this.host.push(this);
    }

    DataBus.prototype.unlockChildren = function(){
      this.host.pushAllDown(this);
    }

    DataBus.prototype.unlockParents = function(){
      this.host.push(this);
      function unlock(bus){
        if(is.exist(bus.parent)){
          bus.host.push(bus.parent);
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
  		version: 0.2.0
  */
  Warden.watcher = (function(){
  	var is = Utils.is,
  		each = Utils.each;

  	return function(){
  		var argv = Utils.toArray(arguments).slice(1,arguments.length),
  			argc = argv.length,
  			bus = arguments[0],
  			a = argv[0],
  			b = argv[1],
  			fn,
  			st;

  		if(argc===1){
  			if(is.str(a)){
  				fn = function(event){this[a] = event;}			
  			}else	
  			if(is.fn(a)){
  				fn = function(event){a(event);}
  			}
  		}else{
  			if(is.obj(a) && is.str(b)){
  				if(b.indexOf('/')>=0){
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
  					fn = is.fn(a[b]) ? function(event){a[b](event);} : fn = function(event){a[b] = event} ;
  				}
  			}else
  			if(is.fn(b)){
  				fn = function(event){b.call(a, event);}
  			} 
  		}

  		st = fn;

  		return {
  			update : fn,
  			unbind : function(name){
  				st = fn;
  				fn = function(){} 
  			},
  			bind : function(f){
  				fn = st;
  			}
  		};

  	};
  })();

  if(jQueryInited){
    Warden.extend(jQuery);
  }

}));
