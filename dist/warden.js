((function (root, init) {
  if (typeof exports === "object" && exports) {
    module.exports = init(); // CommonJS
  } else {
    var Warden = init();
    if (typeof define === "function" && define.amd) {
      define(Warden); // AMD
    } else {
      root.Warden = Warden; // <script>
    }
  }
})(this, function(){
  'use strict';
  var Warden = function(a, b){
    return Warden.extend(is.exist(a) ? a : {}, b);
  }
  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.4.1";
  Warden.configure = {
    history : 3,
    cmp : function(x,y){ return x === y; }
  };

  /* Globals */
  var Utils,
      _FUN = 'function',
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
      return typeof x != _UND && x !== null;
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
      if (!add || typeof add !== _OBJ) return origin;
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
      },
      clean: function(i){
        delete hash[i];
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

      $hash : hashc
    }

    Warden.Utils = Utils;
  
  /* This methods extends @obj which can be function, object or array with Warden.js methods .emit(), .listen(), .unlisten() and .stream() */
  Warden.extend = (function(){
    var nativeListener = "addEventListener",
        alternativeListener = "attachEvent",

      defaultConfig = {
        arrays : ['pop', 'push', 'splice', 'reverse', 'shift', 'unshift', 'sort'], //only not-pure methods
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
        each(toArray(arguments).slice(1), function(handler){
          ghandlers[id].push(handler);
        });
      },

      getHandlers = function(id){
        return ghandlers[id] || [];
      }

      function isRegExp(str){
        return /.?[\*\[\]\{\}\.\?\$\^\\\|].?/g.test(str);
      }
    
    function _Array(arr){
      each(arr, function(v, i){
        this[i] = v;
      }.bind(this));
    }

    function define(obj, name, val){
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: val 
      })
    }

    return function(obj, conf) {
      function binder (fn, handlers, callback){
        return function(type){
          var self = this;

          if(every(handlers, function(i){return is.str(type) ? i.type == type : i.type.test(type)}) && self[config.listener]){
            if(!is.str(type)){
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

      function setval(a, b, c){
       a[b] = c;
      }

      var config = extend({}, defaultConfig, conf || {}), // default configuration
          inheritor = is.exist(obj) ? obj : {}, // final object to extend
          isConstructor = true, //obj is constructor
          names = config.names;

      /*
        Choose object to extend,
        if fn is constructor function, then that's prototype, else
        use actual object element
      */
      if(is.fn(obj)){
        inheritor = obj.prototype;
      }else
      if(typeof obj !== _OBJ){
        var constStream = Warden.Stream().watch();
        constStream.fire(obj);
        return constStream;
      }else{
        isConstructor = false;

        if(is.array(obj)){
          /* Extending methods of a current array with stream evaluation */

          _Array.prototype = Object.create(inheritor);

          define(_Array.prototype, 'repeatedly', function(){
            var self = this, l = self.length;

            return Warden.Stream(function(fire){            
              var i = 0;
              setTimeout(function(){
                while(i < l){
                  fire(self[i++])
                }
              });            
            });
          });

          define(_Array.prototype, 'sequentially', function(timeout){
            var self = this, l = self.length;

            return Warden.Stream(function(fire){
              var i = 0,
              
              interval = setInterval(function(){
                if(i<l){
                  fire(self[i]);
                  i++;
                }else{
                  i = 0;
                  clearInterval(interval);
                }

              }, timeout);
            });
          });

          each(config.arrays, function(name){
            define(_Array.prototype, name, function(){ 
              var prev = this;
              Array.prototype[name].apply(this, arguments);
              this.emit({
                type: name,
                prev : prev,
                current: this,
                data: toArray(arguments)
              });
            });
          });

          obj = new _Array(obj);
          inheritor = _Array.prototype;

          setval = function(a,b,c){
            return define(a,b,c);
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
      setval(inheritor, names.emit, function(ev, data){
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
      });

      /* Listen events of @type */
      setval(inheritor, names.listen, function(types, callback){
        var self = this,
          reactor = binder(function(event){
            this.emit(event);
          }, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), callback);

        each(types.split(','), function(type){
          type = trim(type);
          reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
        });

        return this;
      });

      /* Unsubscribe from events of @type */
      setval(inheritor, names.unlisten, function(type, name){
        var self = this, 
            indexes = [], //to remove
            type = trim(type),
            handlers = getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')); // link to object

        if(handlers.length){
          
          if(!name){
            indexes = new Array(handlers.length);
          }else{
            each(handlers, function(handler, index){
              if(handler.callback.name == (name.name || name) && handler.type.toString() == type.toString()){
                indexes.push(index);
              }            
            });
          }

          each(indexes, function(i){
            handlers.splice(i,1);
          });
        }
        return this;
      });

      /* Creates stream of @type type events*/
      setval(inheritor, names.stream, function(types, cnt){
        var self = this,
            stream = Warden.Stream(null, cnt || this),
            seval = function(event){
              stream.fire(event, cnt || this)
            },
            reactor = binder(seval, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), seval);
        
        each(types.split(','), function(type){
          type = trim(type);
          reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
        });

        return stream;
      });

      return obj;
    };
  })();

  function Pipeline(proc, host){
    var processes = proc || [], locked = 0, i = 0,

        /* Functional methods to manipulate DataBus processing workflow */
        fns = {
          /* Continue processing with @data */
          next: function(data){
             return tick(data);
          },
          /* Break processing */
          stop: function(){
            return i=0;
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
          host: function(){
            return host;
          }
        };

            /* Ticking processor to the next process */
    function tick(event, breaked){
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

        tick(event);
      }
    }
    return self;
  }

  Warden.Pipeline = Pipeline

  var Stream = (function(){
    var handlers = {},
        pipes = {};

    function inheritFrom(child, parent){
      child.parent = parent;
      parent.children.push(child);
      return child;
    }

    /* Clones Stream */
    function process(p){
      var pipe = pipes[this.$$id],
          newPipe = pipe.pipe().slice();
      
      newPipe.push(p);

      return inheritFrom(new Stream(newPipe), this);
    }

    function Stream(line, context){
      var max = Warden.configure.history;

      this.$$id = Utils.$hash.set('d');
      this.$$context = context || {};
      this.$$obs = false;

      this.parent = null;
      this.children = [];

      handlers[this.$$id] = [];
      pipes[this.$$id] = Pipeline(line || [], this);

      this.data = {
        fires : new Utils.Queue(max),
        takes : new Utils.Queue(max),
        last : null
      };   
    }

    Stream.prototype = {
      valueOf : function(e){
        return this.data.last;
      },

      toString : function(e){
        return this.data.last.toString();
      },

      bindTo : function() {
        var binding = Warden.Watcher.apply(null, [this].concat(toArray(arguments)));
        return binding;
      },

      exec : function(data, context) {
        if(!this.$$obs){
          return;
        }

        var id = this.$$id, self = this;

        this.data.fires.push(data); // pushing fired data to @fires queue

        pipes[id].start(data, context, function(result){
          self.data.takes.push(result); // pushing taked data to @takes queue
          self.data.last = result;
          /* Executing all handlers of this Stream */
          each(handlers[id], function(handler){
            handler.call(context, result);
          });
        });
      },

      fire : function(data, context) {
        if(this.locked){
          return;
        }

        context = context || this.$$context;

        if(!this.$$obs){
          each(this.children, function(child){
            child.fire(data, context);
          })
          return;
        }

        this.exec(data, context);
        each(this.children, function(child){
          child.fire(data, context);
        });
      },

      /*
        Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current Stream

        This function don't create new Stream object it just puts to the current data bus
        object's handlers list new handler and push it's to the executable pipe of hoster stream
      */
      listen : function(x){
        this.$$obs = true;
        handlers[this.$$id].push(x);      
        return this;
      },

      watch : function(){    
        this.$$obs = true;
        return this;
      },
        
      /*
        Unbinds handler with name @x (if @x is string) or @x handler (if @x is function)
        If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
      */
      mute : function(x){
        var self = this;
        Utils.forWhile(handlers[this.$$id], function(handler, index){
          if(is.fn(x) ? (handler == x) : handler.name == x){
            handlers[self.$$id].splice(index, 1);
            return false;
          }
        }, false);

        return this;
      },

      clear : function(){
        handlers[this.$$id] = [];
      },

      /* Logging recieved data to console or logger */
      log : function(x){
        return this.listen(function log(data){
          console.log(x ? x.replace(/\$/g, data) : data);
        });
      },

      /*
        Filtering recieved data and preventing transmitting through Stream if @x(event) is false
      */
      filter : function(x) {
        if(is.fn(x)){
          return process.call(this, function(e, pipe){
            return x.call(this, e) === true ? pipe.next(e) : pipe.stop();
          });
        }else{
          return process.call(this, function(e, pipe){
            return Warden.configure.cmp(x, e) === true ? pipe.next(e) : pipe.stop();
          });
        }
      },

      /*
        Mapping recieved data and transmit mapped to the next processor
      */
      map : function(x) {
        return process.call(this, function(event, pipe){
          if(is.fn(x)){
            pipe.next(x.call(this, event));
          }else{
            pipe.next(x);
          }
        });
      },

      grep: function(mapper){
        function grep(str, event){
          if(str[0] == '.'){
            str = "$" + str;
          }

          var expression = str.replace(/\$/g, 'event').replace(/^@$/g, "this").replace(/^@/g, 'this.').replace(/@/g, 'this');

          if(str.match(/[\$\@\.]/g)){
            return eval(expression);
          }else{
            return expression;
          }
        }
        function functor(x){
          if(!is.str(x)){
            return function(){
              return x;
            }
          }else
          if(is.fn(x)){
            return function(event){
              return x.call(ctx, event);
            }
          }else{
            return function(event){
              return grep.call(this, x, event);
            }
          }
        }

        function decide(expr){
          var res = null;

          if(is.array(expr)){
            res = map(expr, function(subExpr){
              return decide(subExpr);
            });
          }else
          if(is.obj(expr)){
            res = {};
            for(var i in expr){
              res[i] = decide(expr[i]);
            }
          }else{
            res = functor(expr);
          }

          return res;
        }

        function apply(event, getter, ctx){
          if(is.array(getter)){
            return getter.map(function(getF){
              return apply(event, getF, ctx);
            });
          }

          if(is.obj(getter)){
            var res = {};
            for(var prop in getter){
              res[prop] = apply(event, getter[prop], ctx)
            }
            return res;
          }

          return getter.call(ctx, event);
        }

        var getter = decide(mapper);

        return process.call(this, function(event, pipe){
          pipe.next(apply.call(this, event, getter, this));
        })

      },

      /*
        Appying @fn function ot the previos and current value of recieved data
        If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
      */
      reduce : function(init, fn){
        var reduced = new Utils.Queue(1);
        return process.call(this, function(event, pipe){
          
          var bus = pipe.host(),
              res;
          if(reduced.length == 0){
            res = fn ? fn.call(this, init, event) : event;
          }else{
            res = (fn || init).call(this, reduced[reduced.length-1], event);
          }
          reduced.push(res);
          return pipe.next(res);
        });
      },

      /*
        Take only @x count or (if @x is function) works like .filter()
      */
      take : function(x){
        return process.call(this, function(e, pipe){
          var bus = pipe.host();
          bus.data.limit = bus.data.limit || x;
          bus.data.taken = (bus.data.taken + 1) || 0;
          return bus.data.taken >= bus.data.limit ? pipe.stop() : pipe.next(e);
        });
      },


      /*
        Skips data [Integer] @c times
      */
      skip : function(c) {
        var self = this;
        return process.call(this, function(e, pipe){
          self.skips = self.skips || 0;
          if(self.skips == c){
            delete self.skips;
            pipe.next(e)
          }else{
            self.skips += 1;
            pipe.stop();
          }
        });
      },

      /*
        Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
      */
      interpolate : function(s){
        return process.call(this, function(event, pipe){
          return pipe.next(Utils.interpolate(s, event))
        })
      },

      /*
        Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
      */
      mask : function(o){
        return process.call(this, function(event, pipe){
          return pipe.next(is.str(event) ? Utils.interpolate(event, o) : event);
        });
      },

      /*
        Transfers only unique datas through bus.
        [Function] @cmp - is comparing method that returns
        [Boolean] 'true' if first argument of @cmp is equals to second argument

        By default: @cmp compares arguments with === operator
      */
      diff : function(compractor){
        compractor = compractor || Warden.configure.cmp;

        return process.call(this, function(event, pipe){
          var data = pipe.host().data, fires = data.fires, takes = data.takes,
              cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
            return cons ? pipe.stop() : pipe.next(event);
        });
      },

      pipe : function(fn){
        return process.call(this, function(event, pipe){
          fn(event, pipe.next.bind(pipe));
        });
      },

      /*
        Debounce data bus on [Integer] @t miliseconds
      */
      debounce : function(t) {
        return process.call(this, function(e, pipe){
          var self = this, bus = pipe.host();
          clearTimeout(bus.data.dbtimer);
          bus.data.dbtimer = setTimeout(function(){
            delete bus.data.dbtimer;
            pipe.play();
            pipe.next(e);
          }, t);
          pipe.pause();
        });
      },

      /*
        Collecting events for [Integer] @t miliseconds and after it transmitting an array of them
      */
      collect : function(t){
        return process.call(this, function(e, pipe){
          var self = this,
              bus = pipe.host(),
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
      },

      filterFor : function(fn) {
        var data;
        return process.call(this, function(e, pipe){
          var pipes = {
            get : function(fn){
              return fn ? fn(data) : data;
            },
            next: function(e, fn){
              data = fn ? fn(data, e) : e;
              pipe.next(e);
            },

            stop: function(e){
              pipe.stop();
            }
          }
          return fn(e, pipes);
        });
      },

      collectFor : function(bus){
        var collection = [];

        this.listen(function(e){
          collection.push(e);
        });

        return Warden.Stream(function(emit){
          bus.listen(function(){
            emit(collection);
            collection = [];
          })
        });
      },
                                                                                                                          
      delay : function(time) {
        return process.call(this, function(e, pipe){
          setTimeout(function(){
            pipe.next(e)
          }, time);
        });
      },

      toggle : function(a,b) {
        var toggled = false;
        
        return this.listen(function(data){
          if(toggled){
            b.call(this, data);
          }else{
            a.call(this, data);
          }
          toggled = !toggled;
        });
      },

      after : function(bus, flush){
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
      },

      repeat : function(times, delay){
        var self = this,
            cached = times;

        return inheritFrom(Warden.Stream(function(emit){
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
        }), this);
      },

      waitFor : function(bus){
        var self = this;
        return Warden.Stream(function(emit){
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

        }).host();
      },

      /*
        Usage: bus.merge(bus1, [bus2] ... [busN])
        Merges @bus with buses from arguments
      */
      merge : function(){
        var stream = Warden.Stream(this.$$id, this.$$context),
            argv = toArray(arguments);
            argv.push(this);

        each(argv, function(toMerge){
          toMerge.listen(function(data){
            stream.fire(data);
          });
        });      

        return stream;
      },

      alternately : function(bus){
        var self = this,
            queue = 0; // 0 - this, 1 - bus

        return Warden.Stream(function(fire){
          self.listen(function(e){
            if(queue==0){
              fire(e)
              queue = 1;
            }
          });
          bus.listen(function(e){
            if(queue==1){
              fire(e);
              queue = 0;
            }
          });
        })

      },

      resolve : function(stream, fn, ctx) {
        var self = this;
        return Warden.Stream(function(emit){
          self.sync(stream).listen(function(data){
            emit(fn.call(ctx, data[0], data[1]));
          });
        }, ctx || this.$$context);
      },

      /* Combines two bises with given function @fn*/
      combine : function(bus, fn, seed){
        var self = this;

        return Warden.Stream(function(emit){
          function e(a,b){
            emit(fn.call(self.$$context, a,b));
          }

          self.listen(function(data){
            e(data, bus.data.last || seed);
          });
          bus.listen(function(data){
            e(self.data.last || seed, data);
          });

        }, this.$$context);
      },

      /* Synchronizes  buses */
      sync : function(){
        var self = this,
            argv = toArray(arguments),
            values = [],
            executions = [],
            nbus;

        argv.unshift(this);

        values.length = executions.length = argv.length;

        nbus = Warden.Stream(function(emit){
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
        });
        
        return nbus;
      },
      
      stream : function(){
        return inheritFrom(new Stream(), this);
      },

      swap : function(state){
        var self = this;

        function swap(e, val){
          e.locked = !val;
          each(e.children, function(child){
            child.swap(val);
          });
        }

        swap(this, state);      
      },
      
      toggleOn: function(bus, state){
        var self = this;
        if(bus instanceof Stream){
          bus.listen(function(){
            self.swap(state);
          });
        }
      },

      /* Lock/unlock methods */
      lock : function(bus){
        this.swap(false);
        if(bus){
          this.toggleOn(bus, false);
        }
        return this;
      },

      lockThis : function() {
        this.locked = true;
        return this;
      },

      unlockThis : function(){
        this.locked = false;
        return this;
      },

      unlock : function(bus){
        this.swap(true);
        if(bus){
          this.toggleOn(bus, true);
        }
        return this;
      }
    }

    Object.defineProperty(Stream.prototype, 'value', {
      configurable: true,
      get : function(){
        return this.data.last;
      },
      set : function(v){
        this.fire(v);
      }
    });

    Warden.configure.addToStream = function(name, fn, piped){
      Stream.prototype[name] = function() {
        var self = this,
            argv = arguments;
        if(!piped){
          return process.call(this, fn.apply(this, arguments));
        }else{
          return fn.apply(this, arguments);
        }
      };
    }

    Warden.configure.isStream = function(e){
      return (e instanceof Stream);
    }

    return Stream;
  })();


  Warden.Stream = function(x, context, strict){
    var stream, xstr, reserved = [], i, bus;    
        context = context || {};  
        stream = new Stream([], context);

    if(is.fn(x)){
      /* If we strict in context */
      if(strict===true){
        xstr = x.toString();

        for(i in context){
          if(context.hasOwnProperty(i))
            reserved.push(i);
        }

        if(reserved.length){
          each(reserved, function(prop){
            if(xstr.indexOf("this."+prop)>=0){
              /* If there is a coincidence, we warn about it */
              console.error("Coincidence: property: '" + prop + "' is already defined in stream context!", context);
            }
          });    
        }
      }

      x.call(context, function(result, ctx){
        stream.fire(result, ctx);
      });  
    }

    return stream;
  }

  Warden.Watcher = function(){
  	var argv = Utils.toArray(arguments).slice(1,arguments.length),
  		argc = argv.length,
  		bus = arguments[0],
  		a = argv[0],
  		b = argv[1],
  		fn,
  		st;

  	if(argc===1){
  		if(is.str(a)){
  			fn = function binding(event){this[a] = event;}			
  		}else	
  		if(is.fn(a)){
  			fn = function binding(event){a(event);}
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

  				fn = function binding(event){
  					eval("a" + dest + "= event");
  				}
  			}else{
  				fn = is.fn(a[b]) ? function binding(event){a[b](event);} : fn = function binding(event){a[b] = event} ;
  			}
  		}else
  		if(is.fn(b)){
  			fn = function binding(event){b.call(a, event);}
  		} 
  	}

  	st = fn;

  	bus.listen(fn);

  	return {
  		update: fn,
  		remove: function(){
  			bus.mute('binding');
  		}
  	}
  };

  Warden.Formula = function(deps, formula, ctx){
    var formulaStream = Warden.Stream(formula.toString(), ctx || {});

    each(deps, function(stream){
      stream.listen(function(data){
        var formulaValue = formula.apply(ctx || this, deps);

        formulaStream.fire(formulaValue);
      });
    });
    
    formulaStream.watch();

    formulaStream.value = formula.apply(ctx, deps);
    
    return formulaStream
  }
  

  if(jQueryInited){
    Warden(jQuery);
  }

  return Warden;

}));
