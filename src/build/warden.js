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
  Warden.version = "0.0.4"; 
  Warden.log = function(x){
    console.log(x);
  }
  
/* Begin: src/modules/Helpers.js */
  /* 
    Helpers module
    v.0.2.0
  */


  /* 
    Data type checking methods
  */
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
    obj : function(x){
      return typeof x === 'object' && !this.array(x);
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

    /*
      Function exists(@mixed x):
      Returns true is x exists and not equal null.
    */
    exist : function(x){
      return typeof x !== 'undefined' && x !== null;
    }
  },

  /*
    Function forWhilte(@array arr, @function fn, @mixed preventVal, @mixed preventRet):
    Applyies @fn to each element of arr while result of applying doesn't equal @preventVal
    Then returns @preventRet or false if @preventRet is not defined
  */
  forWhile = function(arr, fn, preventVal, preventRet){
    for(var i=0, l=arr.length; i<l; i++){
      if(fn(arr[i], i) === preventVal){
        return preventRet && false; 
        break;
      }
    }
  },

  /* 
    Function forEach(@array arr, @function fn):
    Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
  */
  forEach = (function(){
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
  }()),

  /*
    Function filter(@array, @function)
    Filtering @array by @function and returns only mathcing as @function(item) === true  elements
    TODO: Should we keep it here?
  */
  filter = (function(){
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
  })(),

  /* Extends flat objects */

  extend = ($ && $.extend) ? $.extend : function (){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g}


  /* 
    Queue class @arr is Array, @maxlength is Number
  */
  function Queue(maxlength, arr){
    var max = maxlength || 16, storage = (arr && arr.slice(0, max)) || [];

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
    var t = Analyze.MAP[id], yt = typeof i;
    if(t && t.indexOf(yt)==-1){
      throw "TypeError: unexpected type of argument at : " + id+ ". Expect: " + t.join(' or ') + ". Your argument is type of: " + yt;
    }
  }

  Analyze.MAP = (function(){
    var o = 'object', s = 'string', f = 'function', n = 'number';
    return {
      extend : [o,f],
      reduce : [f],
      take : [f,n],
      filter : [f],
      skip : [n],
      makeStream: [s,f],
      debounce : [n],
      getCollected : [n],
      warn : function(i, context){
        console.log("Coincidence: property: '" + i + "' is already defined in stream context!", context);
      }
    }
  })();/* End: src/modules/Helpers.js */
/* Begin: src/modules/Extend.js */
  /* 
    Extend module: 
      docs: ./docs/Extend.md
      version: v.0.2.2

    This methods extends @obj which can be both 
    function or object with Warden.js methods .emit(), 
    .listen() and .stream() 
  */


  Warden.extend = function(obj, conf) {
    /* Arguments type analysis */
    Analyze('extend', obj);

    /* Default configuration */
    var config = extend(conf, {
      max : 512, // maximal handlers per object
      context : 'this', // context of evaluation
      emitter : null, // custom event emitter if exists
      listener : null // custrom event listener if exists
    });
    
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
    Implements interface to processing all databus methods.
    Version: v0.1.0;
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
          /* Returns current DataBus */
          $host: function(){
            return host;
          }
        };
    
    var self = {
      /* Add process if @p exists or return all processes of this Processor */
      process : function(p){
        return is.exist(p) ? processes.push(p) : processes;
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
        i++
        processes[i-1].apply(self.ctx, [event, fns]);
      }
    }
    return self;
  }/* End: src/modules/Processor.js */
/* Begin: src/modules/Streams.js */
  /*
    Streams module:
      docs: ./docs/Streams.md
      version: 0.2.2

    Creates stream of data.
    If @x is string, that it interprets as datatype
    else if @x is function, than x's first arg is emitting data function
  */

  Warden.makeStream = (function(){
    
    /* Stream constructor */
    function Stream(context){
      var drive = [];
      return  {
        /*
          For debugging:
        */
        $$id : Math.random() * 1000 >> 0, 

        /* 
          Evaluating the stream with @data 
        */
        eval : function(data){
          forEach(drive, function(bus){
            bus.fire(data, context);
          });
        },
        
        /* 
          Push into executable drive @bus.
          Bus is DataBus object.
        */
        push : function(bus){
          drive.push(bus);
        },

        /* 
          Removes from executable drive @bus.
          Bus must be DataBus object.
        */
        pop : function(bus){
          forEach(drive, function(b, i){
            if(bus == b){
              drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
            }
          });
        },

        /*
          Creates empty DataBus object and hoist it to the current stream
        */
        get : function(){
          var bus = new DataBus();
          bus.host(this);
          return bus;
        }
      }
    }


    /* 
      Creates stream of @x on context @context;
      If @strict argument is truly, than it warns about the coincidence 
      in the context to prevent overwriting;
    */
    return function(x, context, strict){
      var stream, xstr, reserved = [];

      Analyze("makeStream", x);
      
      context = context || {};  
      stream = Stream(context);

      if(is.fn(x)){

        /* If we strict in context */
        if(is.exist(strict)){
          xstr = x.toString();

          for(var i in context){
            if(context.hasOwnPropery(i)){
              reserved.push(i);
            }
          }

          forEach(reserved, function(prop){
            if(xstr.indexOf("this."+prop)>=0){
              /* If there is a coincidence, we warn about it */
              Analyze.MAP.warn(prop, context);
            }
          });    
        }

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
      // skipped : 0
    };

    this.host = function(h){
      return host = h || host;
    }

    this.process = function(p){
      var nprocess, nbus;
      if(!p){
        return processor;
      }else{
        nprocess = [];
        forEach(processor.process(), function(i){
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
    var nbus = new DataBus(this.process().process());
    nbus.parent = this.parent || this;
    this.children.push(nbus);
    nbus.host(this.host());
    return nbus;
  };

  /* Filtering event and preventing transmitting through DataBus if @x(event) is false */
  DataBus.prototype.filter = function(x) {
    Analyze('filter', x);
    return this.process(function(e, drive){
      return x.apply(this, [e]) === true ? drive.$continue(e) : drive.$break();
    });
  };

  /* Mapping event and transmit mapped to the next processor */
  DataBus.prototype.map = function(x) {
    var fn, ctype = typeof x, res;
    switch(ctype){
      case 'function':
        fn = function(e, drive){
          return drive.$continue(x.apply(this, [e]));
        }
      break;
      case 'string':
        fn = function(e, drive){
          var t = e[x], 
              r = is.exist(t) ? t : x;
          return drive.$continue(r);
        }
      break;
      case 'object':
        if(is.array(x)){
          fn = function(e, drive){
            var res = [];
            forEach(x, function(i){
              var t = e[i];
              res.push(is.exist(t) ? t : i);
            }); 
            return drive.$continue(res);
          }
        }else{
          fn = function(e, drive){
            var res = {}, t;
            for(var prop in x){
              t = e[x[prop]];
              res[prop] = is.exist(t) ? t : x[prop];
            }
            return drive.$continue(res);
          }
        }
      break;
      default:
        fn = function(e, drive){
          return drive.$continue(x);
        }
      break;
    }
    return this.process(fn);
  };


  DataBus.prototype.reduce = function(init, fn){
    Analyze('reduce', fn);
    return this.process(function(event, drive){
      var bus = drive.$host(),
          prev = init,
          cur = event;

      if(bus._.takes.length >= 1){
        prev = bus._.takes.get(bus._.takes.length-1);
      }
      return drive.$continue(fn(prev, cur));
    });   
  };

  /* Take only x count or x(event) == true events */
  DataBus.prototype.take = function(x){
    Analyze('take', x);
    if(is.fn(x)){
      return this.filter(x);
    }else{
      return this.process(function(e, drive){
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

  DataBus.prototype.skip = function(c) {
    Analyze('skip', c);
    return this.process(function(e, drive){
      var bus = drive.$host();
      if(bus._.fires.length <= c){
        drive.$break();
      }else{
        return drive.$continue(e);
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

  DataBus.prototype.mask = function(s){
    if(!is.str(s)){
      return this.map(s);
    }else{
      return this.process(function(event, drive){
        var regex = /{{\s*[\w\.]+\s*}}/g;
        return drive.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
      })
    }
  };

  DataBus.prototype.debounce = function(t) {
    Analyze('debounce', t)
    return this.process(function(e, drive){
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

  DataBus.prototype.getCollected = function(t){
    Analyze('getCollected', t);
    return this.process(function(e, drive){
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

  DataBus.prototype.merge = function(bus){
    var self = this;
    return Warden.makeStream(function(emit){
      bus.listen(emit);
      self.listen(emit);
    }).get();
  };


  DataBus.prototype.combine = function(bus, fn) {
    var self = this;
    var a, b;
    bus.listen(function(event){
      b = event;
    });
    this.listen(function(event){
      a = event;
    })

    return Warden.makeStream(function(emit){
      self.listen(function(data){
        emit(fn(a,b));
      });
      bus.listen(function(data){
        emit(fn(a,b));
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
    Warden.watcher(this, a, b);
  };

  DataBus.prototype.once = function(){
    return this.take(1);
  };

  DataBus.prototype.unique = function(){
    return this.process(function(event, drive){
      var fires = drive.$host()._.fires;
      var takes = drive.$host()._.takes;
      if( (fires.length > 1 || takes.length > 0) && (event == fires.get(fires.length-2) || event == takes.get(takes.length-1))){      
        return drive.$break();
      }else{
        return drive.$continue(event);
      }  
    });
  };
/* End: src/modules/DataBus.js */
/* Begin: src/modules/Watcher.js */
  Warden.watcher = function(bus, a, b){
  	var ta = typeof a,
  		tb = typeof b,
  		terr = "TypeError",
  		fn;

  	if(!is.exist(b) && is.exist(a)){
  		if(ta == 'string'){
  			fn = function(event){
  				return this[a] = event;
  			}
  		}else
  		if(ta == 'function'){
  			fn = function(event){
  				return a(event);
  			}
  		}else{
  			throw terr;
  		}
  	}else

  	if(is.exist(b)){
  		if(ta == 'object' && tb == 'string'){
  			fn = function(event){
  				return a[b] = event;
  			}
  		}else

  		if(ta == 'object' && tb == 'function'){
  			fn = function(event){
  				return a = b(event);
  			}
  		}else
  		{
  			throw terr;
  		}
  	} else

  	{
  		throw "Arg Error"
  	}


  	return bus.listen(fn);
  };/* End: src/modules/Watcher.js */
}));