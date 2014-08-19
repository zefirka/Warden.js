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
  Warden.version = "0.0.3.1"; 
  Warden.log = function(x){
    console.log(x);
  }
  
/* Begin: src/modules/Helpers.js */
  /* 
    Helpers module
    v.0.1.0
  */

  /*
    Function exists(@mixed x):
    Returns true is x exists and not equal null.
  */
  var exists = function(x){
    return typeof x !== 'undefined' && x !== null;
  }


  /* Typeof methods */
  var is = {
    fn : function (x) {
      return typeof x === 'function';
    },
    num : function (x) {
      return typeof x === 'number';
    },
    str : function (x) {
      return typeof x === 'string';
    },

    /*
      Function isArray(@mixed x):
      Checks is x param is real array or object (or arguments object)
    */

    array : (function(){    
      if(Array.isArray){
        return function(x){ 
          return Array.isArray(x); 
        }
      }else{
        return function(x){ 
          Object.prototype.toString.call(x) === '[object Array]';
        }
      }
    }()),
    obj : function(x){
      return typeof x === 'object';
    },
    exist : function(x){
      return typeof x !== 'undefined' && x !== null;
    }
  }


  /*
    Function forWhilte(@array arr, @function fn, @mixed preventVal, @mixed preventRet):
    Applyies @fn to each element of arr while result of applying doesn't equal @preventVal
    Then returns @preventRet or false if @preventRet is not defined
  */
  var forWhile = function(arr, fn, preventVal, preventRet){
    for(var i=0, l=arr.length; i<l; i++){
      if(fn(arr[i], i) === preventVal){
        return preventRet && false; 
        break;
      }
    }
  };


  /* 
    Function forEach(@array arr, @function fn):
    Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
  */
  var forEach = (function(){
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
  }());


  /*
    Function filter(@array, @function)
    Filtering @array by @function and returns only mathcing as @function(item) === true  elements
    TODO: Should we keep it here?
  */
  var filter = (function(){
    if(Array.prototype.filter){
      return function(arr, fn){
        return arr ? arr.filter(fn) : null;
      }
    }else{
      return function(arr, fn){
        var filtered = [];
        for(var i=0, l=arr.length; i<l; i++){
          var res = fn(arr[i]);
          if(res === true){
            filtered.push(res);
          }
        }
        return filtered;
      }
    }
  })();

  /* 
    Queue class @arr is Array;
    should to make length not a function
  */
  function _Queue(maxlength, arr){
    var storage = arr || [],
        length = (arr && arr.length) || 0,
        max = maxlength || 16;

    this.length = function(){
      return length;
    };

    this.push = function(item){
      if(length>=maxlength){
        storage.shift();  
      }
      storage.push(item);
      length = storage.length;
    };

    this.get = function(index){
      return exists(index) ? storage[index] : storage;
    };
  }

  /* Optimized queue */
  function Queue(maxlength, arr){
    var storage = arr || [],
        max = maxlength || 16;

    this.length = (arr && arr.length) || 0;

    this.push = function(item){
      if(this.length>=max){
        storage.shift();  
      }else{
        this.length++;  
      }
      storage.push(item);
    };

    this.pop = function(){
      storage.pop();
      this.length--;
    }

    this.get = function(index){
      return is.exist(index) ? storage[index] : storage;
    };

  }

  /* 
    Datatype analyzer
  */

  var Analyze = function(id, i){
    var t = Analyze.MAP[id];
    if(t.indexOf(typeof i)==-1){
      throw "TypeError: unexpected type of argument at : " + id+ ". Expect: " + t.join(' or ') + ".";
    }
  }

  Analyze.MAP = {
    extend : ['object', 'function'],
    makeStream: ['string', 'function']
  }/* End: src/modules/Helpers.js */
/* Begin: src/modules/Extend.js */
  /* 
    Extend module: 
      docs: ./docs/Extend.md
      version: v.0.2.0

    This methods extends @obj which can be both 
    function or object with Warden.js methods .emit(), 
    .listen() and .stream() 
  */

  Warden.extend = function(obj, conf) {
    /* Arguments type analysis */
    Analyze('extend', obj);

    /* Default configuration */
    var config = conf || {
      max : 512, // maximal handlers per object
      context : 'this', // context of evaluation
      emitter : null, // custom event emitter if exists
      listener : null // custrom event listener if exists
    };
    
    /* 
      Choose object to extend,
      if fn is constructor function, then that's prototype, else
      use actual object element 
    */
    
    var inheritor = obj, // final object to expand
        isConstructor = true; // is obj is constructor
    
    if(is.fn(obj)){
      inheritor = obj.prototype;
    }else{
      isConstructor = false;
    }
    
    /* 
      Setting up standart DOM event listener 
      and emitters  function to not overwrite them 
      and user should do not use that in config 
    */
    if(typeof jQuery!=="undefined"){
      config.emitter = config.emitter || 'trigger';
      config.listener = config.listener || 'on';    
    }else
    if(is.fn(inheritor.addEventListener) || is.fn(inheritor.attachEvent)){
      config.listener = config.listener || (is.fn(inheritor.addEventListener) ? "addEventListener" : "attachEvent");
    }
    
    /* Preventing native 'emit' method override */
    var emitName = inheritor.emit ? '$emit' : 'emit';
    
    /* Collections of private handlers */
    /* Developed to incapsulate handlers of every object */
    var handlers = [];

    /* Setting new handler @fn of event type @type to @object */
    handlers.sH = function(object, type, fn){
      var handlers = this.gH(object, type);
      if(handlers){
        if(handlers.length < config.max){
          handlers = handlers.push(fn);
        }else{
          throw "Maximal handlers count reached";
        }
      }else{
        var collection = this.gC(object);
        if(collection){
          collection.handlers[type] = collection.handlers[type] || [];
          collection.handlers[type].push(fn);
        }else{ 
          collection = {};
          collection.object = object;
          collection.handlers = {};
          collection.handlers[type] = [fn];
          this.push(collection);
        }
      }
    };
    
    /* Get collections of handlers by types of @object */
    handlers.gC = function(object){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i]
        }
      }
      return false;
    };

    /* Get handlers of @object by @type */
    handlers.gH = function(object, type){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i].handlers[type];
        }
      }
      return false;
    };  
    
    /* Emitter method */
    inheritor[emitName] = function(ev){
      var self = this,
          callbacks = handlers.gH(this, ev.type || ev);
      console.log('Что-то эмитировали!');
      forEach(callbacks, function(callback){
        callback.call(self, ev);
      });
        
      return this;
    };

    /* Listener function */
    inheritor.listen = function(type, callback, settings){    
      var self = this;
      handlers.sH(this, type, callback);    
      if(this[config.listener]){
        this[config.listener].apply(this, [type, function(event){ 
          self[emitName](event)
        }]);
      }
      return this;
    };

    /* Creates stream */
    inheritor.stream = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this);

      handlers.sH(this, type, function(event){
        stream.eval(event);
      });

      if(this[config.listener]){
        this[config.listener].apply(this, [type, function(event){     
          stream.eval(event);      
        }]);
      }
      
      return stream.get();
    };

    return obj;
  };/* End: src/modules/Extend.js */
/* Begin: src/modules/Processor.js */
  /*
    Processor module:
    In all processing functions: this variable is EventBus object;
  */

  function Processor(proc, host){
    var processes = proc || [], 
        locked = 0, 
        i = 0,
        self = this;
    
    this.getProcesses = function(){
      return processes;
    };

    var fns = [
      function $continue(data, context){
         return self.tick(data);
      },
      function $break(preventValue){
        return self.tick({}, 1); //break
      },
      function $lock(){
        return locked = 1;
      },
      function $unlock(){
        return locked = 0;
      },
      function $host(){
        return self.hoster;
      }];
    

    this.hoster = host;

    this.start = function(event, context, fin){
      self.ctx = context;
      self.fin = fin;    
      
      if(locked){
        i = 0;
      }
      
      if(i==processes.length){
        i = 0;
        return fin(event);
      } 

      forEach(fns, function(x){
        self.ctx[x.name] = x;
      });

      this.tick(event);
    }

    this.tick = function(event, br, async){        
      if(br){
        i = 0;
        return void 0;
      }
      
      if(i==processes.length){
        forEach(fns, function(x){
          delete self.ctx[x.name]
        });
        i = 0;
        return self.fin(event);
      }
      i++
      processes[i-1].apply(self.ctx, [event]);
    };  
  }/* End: src/modules/Processor.js */
/* Begin: src/modules/Streams.js */
  /*
    Streams module:
      docs: ./docs/Streams.md
      version: 0.2.1

    Creates stream of data.
    If @x is string, that it interprets as datatype
    else if @x is function, than x's first arg is emitting data function
  */

  Warden.makeStream = (function(){
    /* Stream class */

    function Stream(context){
      var drive = [];
      return  {
        id : Math.random() * 1000 >> 0,
        eval : function(data){
          forEach(drive, function(bus){
            bus.fire(data, context);
          });
        },
        push : function(bus){
          drive.push(bus);
        },
        pop : function(bus){
          forEach(drive, function(b, i){
            /* Здесь надо проверить наследование прототипов, и если это сходные объекты, то это одно и то же */
            if(bus == b){
              drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
            }
          });
        },
        get : function(){
          var bus = new DataBus();
          bus.host(this);
          return bus;
        }
      }
    }

    return function(x, context, strong){
      var stream, xstr, reserved = [];

      Analyze("makeStream", x);
      
      context = context || {};  
      stream = Stream(context);

      if(is.fn(x)){
        xstr = x.toString();

        for(var i in context){
          if(context.hasOwnPropery(i)){
            reserved.push(i);
          }
        }

        forEach(reserved, function(i){
          if(xstr.indexOf("this."+i)>=0){
            console.warn("You have used reserved word '" + i + "' in stream");
          }
        });    
        
        x.apply(context, [function(expectedData){
          stream.eval(expectedData);
        }]);  
      }    
      return stream;
    };
  })();/* End: src/modules/Streams.js */
/* Begin: src/modules/DataBus.js */
  function DataBus(proc){
    var processor = new Processor(proc || [], this), //processor
        host = 0; //hosting stream

    this.id = Math.random()*10000 >> 0; //for debugging
    this.parent = null;
    this.children = [];

    this._ = {
      fires : new Queue(),
      takes : new Queue(),
      skipped : 0
    };

    this.host = function(h){
      return host = h || host;
    }

    /* It will be good change all addProcessor to process(fn) */
    this.process = function(p){
      var nprocess, nbus;
      if(!p){
        return processor;
      }else{
        nprocess = [];
        forEach(processor.getProcesses(), function(i){
          nprocess.push(i);
        });
        nprocess.push(p);
        nbus = new DataBus(nprocess);
        nbus.host(this.host());
        nbus.parent = this;
        this.children.push(nbus);
        return nbus;  
      }
    };
      
    this.fire = function(data, context){  
      var self = this;
      data = is.exist(data) ? data : {};
      data.$$bus = this;

      this._.fires.push(data);
      processor.start(data, context, function(result){
        self._.takes.push(result);
        self.handler.apply(context, [result]);
      });
    }
  }

  DataBus.prototype.listen = function(x){
    var nb = this.clone();
    nb.handler = is.fn(x) ? x : function(){console.log(x)}  
    this.host().push(nb);
    return nb;
  };

  /* Logging event to console or logger */
  DataBus.prototype.log = function(){
    return this.listen(function(data){
      return console.log(data);
    });
  };

  DataBus.prototype.clone = function() {
    var nbus = new DataBus(this.process().getProcesses());
    nbus.parent = this.parent || this;
    this.children.push(nbus);
    nbus.host(this.host());
    return nbus;
  };

  /* Filtering event and preventing transmitting through DataBus if @x(event) is false */
  DataBus.prototype.filter = function(x) {
    if(!is.fn(x)){
      throw "TypeError: filter argument mus be a function";
    }
    return this.process(function(e){
      return x(e) === true ? this.$continue(e) : this.$break();
    });
  };

  /* Mapping event and transmit mapped to the next processor */
  DataBus.prototype.map = function(x) {
    var fn, ctype = typeof x, res;
    switch(ctype){
      case 'function':
        fn = function(e){
          return this.$continue(x.apply(this, [e]));
        }
      break;
      case 'string':
        fn = function(e){
          var t = e[x], 
              r = is.exist(t) ? t : x;
          return this.$continue(r);
        }
      break;
      case 'object':
        if(is.array(x)){
          fn = function(e){
            var res = [];
            forEach(x, function(i){
              var t = e[i];
              res.push(is.exist(t) ? t : i);
            }); 
            return this.$continue(res);
          }
        }else{
          fn = function(e){
            var res = {}, t;
            for(var prop in x){
              t = e[x[prop]];
              res[prop] = is.exist(t) ? t : x[prop];
            }
            return this.$continue(res);
          }
        }
      break;
      default:
        fn = function(e){
          return this.$continue(x);
        }
      break;
    }
    return this.process(fn);
  };


  DataBus.prototype.reduce = function(init, fn){
    if(is.fn(fn)){
      return this.process(function(event){
        var bus = this.$host(),
            prev = init,
            cur = event;

        if(init==='-f'){
          var prev = bus._.takes.get(bus._.takes.length-1);
        }
        return this.$continue(fn(prev, next));
      });   
    }else{
      throw "TypeError: second argument must be a function";
    }
  };

  /* Take only x count or x(event) == true events */
  DataBus.prototype.take = function(x){
    if(is.fn(x)){
      return this.filter(x);
    }else
    if(is.num(x)){
      return this.process(function(e){
        var bus = this.$host();
        bus._.limit = bus._.limit || x;
        if(bus._.takes.length === bus._.limit){
          return this.$break();
        }else{
          return this.$continue(e);
        }
      });
    }else{
      throw "TypeError: take argument must be function or number"
    }
  };

  DataBus.prototype.skip = function(c) {
    if(is.num(c)){
      return this.process(function(e){
        var bus = this.$host();
        if(bus._.fires.length <= c){
          this.$break();
        }else{
          return this.$continue(e);
        }
      });
    }else{
      throw "TypeError: skip argument must be only number";
    }
  };

  DataBus.prototype.waitFor = function(bus){
    return this.process(function(e){
      var self = this;
      this.$lock();
      return bus.listen(function(){
        self.$unlock && self.$unlock();
        return self.$continue && self.$continue(e);
      });
    });
  };

  DataBus.prototype.mask = function(s){
    if(!is.str(s)){
      return this.map(s);
    }else{
      return this.process(function(event){
        var regex = /{{\s*[\w\.]+\s*}}/g;
        return this.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
      })
    }
  };

  DataBus.prototype.debounce = function(t) {
    if(is.num(t)){
      return this.process(function(e){
        var self = this, bus = this.$host();
        clearTimeout(bus._.dbtimer);
        bus._.dbtimer = setTimeout(function(){
          delete bus._.dbtimer;
          self.$unlock();
          self.$continue(e);
        }, t);      
        this.$lock();
      });
    }else{
      throw "TypeError: argument of debounce must be a number of ms.";
    }
  };

  DataBus.prototype.getCollected = function(t){
    if(is.num(t)){
      return this.process(function(e){
        var self = this, 
            bus = this.$host(),
            fired = bus._.fires.length-1;
        if(!bus._.timer){
          bus._.collectionStart = fired;
          bus._.timer = setTimeout(function(){
            var collection = bus._.fires.get().slice(bus._.collectionStart, fired);
            delete bus._.timer;
            self.$unlock();
            self.$continue(collection);
          }, t);
          this.$lock();
        }
      })
    }else{
      throw "TypeError: getCollected of debounce must be a number of ms.";
    }
  };

  DataBus.prototype.merge = function(bus){
    var self = this;
    return Warden.makeStream(function(emit){
      bus.listen(emit);
      self.listen(emit);
    }).get();
  };


  DataBus.prototype.combine = function(bus, fn) {
    var self = this;
    return Warden.makeStream(function(emit){
      self.listen(function(data){
        emit(fn(data, bus._.fires.get(bus._.fires.length-1)));
      });
      bus.listen(function(data){
        emit(fn(self._.fires.get(self._.fires.length-1), data));
      });
    }).get();
    
  };

  DataBus.prototype.sync = function(bus){
    var self = this;
    return Warden.makeStream(function(emit){
      var exec1 = false, 
          exec2 = false,
          val1, 
          val2,
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
  };

  DataBus.prototype.lock = function(){
    this.host().pop(this);
  }

  DataBus.prototype.unlock = function(){
    this.host().push(this);
  }

  DataBus.prototype.bindTo = function(a,b){
    var args = arguments;
    var concat = Array.prototype.concat;
    unshift.apply(args, [this]);
    Warden.watcher(args)
  };

  DataBus.prototype.once = function(){
    return this.take(1);
  };

  DataBus.prototype.unique = function(){
    return this.process(function(event){
      var fires = this.$host()._.fires;
      var takes = this.$host()._.takes;
      if( (fires.length > 1 || takes.length > 0) && (event == fires.get(fires.length-2) || event == takes.get(takes.length-1))){      
        return this.$break();
      }else{
        return this.$continue(event);
      }  
    });
  };
/* End: src/modules/DataBus.js */
/* Begin: src/modules/Watcher.js */
  Warden.watcher = function(bus, a, b){
  	var al = arguments.length,
  		fn = null;
  	if(al==3){
  		if(is.fn(b)){
  			if(is.obj(a)){
  				fn = function(e){
  					return a = b(e);
  				}
  			}else{
  				throw "Wrong";
  			}
  		}else
  		if(is.str(b)){
  			if(is.obj(a)){
  				fn = function(e){
  					return a[b] = e;
  				}
  			}else{
  				throw "Wrong";
  			}
  		}else{
  			throw "Wrong"
  		}
  	}else
  	if(al==2){
  		fn = function(e){
  			a = e;
  		}
  	}else
  	if(al==1){
  		throw "Wrong"
  	}

  	return bus.listen(fn);
  };/* End: src/modules/Watcher.js */
/* Begin: src/modules/Sampler.js */
  Warden.Sampler = function Sampler() {
    var buses = Array.prototype.slice.apply(arguments, [0, arguments.length-1]),
        resolver = arguments[arguments.length-1];

    var callings = {
      start: function(){
        var res = [];
        for(var i in this){
          if(i=='start'){continue}
          var el = this[i];
          forEach(el.history.get(), function(data){
            res.push(resolver(data));
          });
        }
      }
    };

    forEach(buses, function(bus){
      bus.listen(function(data){
        var res = callings[bus.id] || {
          last: null,
          history: new Queue(32)
        };

        res.last = data;
        res.history.push(data);
        callings[bus.id] = res;
        callings.start()
      });
    });

    return callings;
  }

/* End: src/modules/Sampler.js */
}));