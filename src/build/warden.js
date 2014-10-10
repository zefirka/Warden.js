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
    v.1.0.0
  */


  var Utils = (function(){
    var _FUN = 'function',
        _NUM = 'number',
        _STR = 'string',
        _OBJ = 'object',
        _ARR = 'array',
        _BOOL = 'boolean',
        _UND = 'undefined';
    
    function equals(x){
        return function(y){
            return x === y;
        }
    }

    function truthy(x){
         return x ? true : false;
    }
    
    function $let(predicate){
      var predicates = [predicate],
          all = false;

      var ans = function(x){
          var res = map(predicates, function(pred){
              return pred(x);
          });

          return all ?  res.every(truthy) : res.some(truthy);		
      }


      ans.and = function(predicate){
          ans.or(predicate);
          all = true;
          return ans;
      }

      ans.or = function(predicate){
          predicates.push(predicate);
          return ans;
      }

      return ans;
    }
    
    function filter(arr, fn){
      var filterd = [];
      for(var i=0, l=arr.length; i<l; i++){
        if(fn(arr[i])===true){
          filterd.push(arr[i]);
        }
      }
      return filterd;
    }
  	
    function map(arr, fn){
      var mapped = [];
      for(var i=0, l=arr.length; i<l; i++){
        mapped[i] = fn(arr[i], i)
      }
      return mapped;
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
    
    /* 
      Data type checking methods
    */
    var is = {
      exist : $let(not(typeIs(_UND))).and(not(equals(null))),
  	array : function(x){
  		return Array.isArray(x)
  	},
  	fn : typeIs(_FUN),
  	num : typeIs(_NUM),
  	str : typeIs(_STR),
  	bool : typeIs(_BOOL),
  	truthy : truthy,
  	falsee : not(truthy)
    }
          
    is.obj = $let(typeIs(_OBJ)).and(not(is.arr)),
  	
    is.not = (function(x){
      var obj = {};
      for(var i in is){
        obj[i] = not(is[i])
      }
      return obj;
    })();
  	
               
    return {
      is : is,

      /* 
        Function forEach(@array arr, @function fn):
        Applies @fn for each item from array @arr usage: forEach([1,2], function(item){...})
      */
      forEach : (function(){
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

      /* Extending objects */
      extend : (typeof $ !== 'undefined' && $.extend) ? $.extend : function (){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},

      /* 
        Queue class @arr is Array, @maxlength is Number
      */
      Queue : function Queue(max, arr){
        var res = arr || [],
            max = max || 16,
            oldpush = res.push;

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

  Warden.Utils = Utils;

  /* Exception manager */
  var Analyze = function(id, i, l){
    var t = Analyze.MAP[id], yt = typeof i, tl = t[t.length-1];
    if(t && t.indexOf(yt)==-1){
      throw "TypeError: unexpected type of argument at: ." + id + "(). Expected type: " + t.join(' or ') + ". Your argument is type of: " + yt;
    }
  }

  Analyze.MAP = (function(){
    var o = 'object', 
        s = 'string', 
        f = 'function', 
        n = 'number';
    return {
      extend : [o,f],
      reduce : [f],
      take : [f,n],
      filter : [f],
      skip : [n],
      setup : [f],
      makeStream: [s,f],
      debounce : [n],
      getCollected : [n],
      interpolate : [s],
      mask : [o],
      warn : function(i, context){
        console.warn("Coincidence: property: '" + i + "' is already defined in stream context!", context);
      }
    }
  })();

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
      version: v.0.3.1

    This methods extends @obj which can be both 
    function or object with Warden.js methods .emit(), 
    .listen() and .stream() 
  */

  Warden.extend = (function(){
    var forEach = Utils.forEach, 
      is = Utils.is,
      extend = Utils.extend,
      nativeListener = "addEventListener",
      alternativeListener = "attachEvent",

      defaultConfig = {
        max : 512, // maximal handlers per object
        context : 'this', // context of evaluation
        emitter : null, // custom event emitter if exists
        listener : null // custrom event listener if exists
      }

    Warden.configure.changeDefault = function(newConfig){
      return Utils.extend(newConfig, defaultConfig);
    }

    Warden.configure.natives = function(obj){
      nativeListener = obj.listener;
      alternativeListener = obj.altenativeListener;
    }

    return function(obj, conf) {
      Analyze('extend', obj);

      var config = extend(defaultConfig, conf || {}), // default configuration 
          inheritor = obj, // final object to expand
          isConstructor = true; //obj is constructor
      /* 
        Choose object to extend,
        if fn is constructor function, then that's prototype, else
        use actual object element 
      */    
      if(is.fn(obj)){
        inheritor = obj.prototype;
      }else{
        isConstructor = false;
      }

      var overwrite = inheritor.emit || inheritor.listen || inheritor.stream;

      /* Checking free namespace */
      if(is.exist(overwrite)){
        throw "Can't overwrite: " + (overwrite.name ? overwrite.name : overwrite) + " of object";
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
      if(is.fn(inheritor[nativeListener]) || is.fn(inheritor[alternativeListener])){
        config.listener = config.listener || (is.fn(inheritor[nativeListener]) ? nativeListener : alternativeListener);
      }
          
      /* Emitter method */
      inheritor.emit = function(ev){
        var self = this,
            callbacks = this['$$handlers'].filter(function(i){
              return i.type == ev || i.type == ev.type            
            });
        
        forEach(callbacks, function(callback){
          callback.callback.call(self, ev);
        });
          
        return this;
      };

      /* listen events of @type */
      inheritor.listen = function(type, callback){
        var self = this;
        //handlers.set(this, type, callback);    
        var handlers = this['$$handlers'] = this['$$handlers'] || [];

        if(!handlers.filter(function(i){return i.type == type;}).length){
          if(this[config.listener]){
            this[config.listener].apply(this, [type, function(event){ 
              self.emit(event)
            }]);
          }
        }

        this['$$handlers'].push({
          type: type,
          callback: callback
        });      

        return this;
      };

      
      inheritor.unlisten = function(type, name){
        var self = this;
        name = name.name || name;
        if(self['$$handlers']){
          var indexes = [];
          forEach(self['$$handlers'], function(i, index){
            if(i.callback.name == name){
              indexes.push(index);
            }
          });
          forEach(indexes, function(i){
            self['$$handlers'].splice(i,1);
          });
        }
        return this;
      };

      /* Creates stream */
      inheritor.stream = function(type, cnt) {
        var stream = Warden.makeStream(type, cnt || this);

        var handlers = this['$$handlers'] = this['$$handlers'] || [];
           
        if(!handlers.filter(function(i){return i.type == type;}).length){
          if(this[config.listener]){
            this[config.listener].apply(this, [type, function(event){     
              stream.eval(event);      
            }]);
          }
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
    var forEach = Utils.forEach, 
        is = Utils.is;

    /* Stream constructor */
    function Stream(context){
      var drive = [];

      return {
        /*
          For debugging:
        */
        $$id : Utils.$hash.set('s'),
        $$context : context,
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
          return bus;
        },

        pushAllUp : function(bus){
          var self = this;
          forEach( drive.push(bus).children, function(child){
            self.pushAllUp(child);
          });
        },

        /* 
          Removes from executable drive @bus.
          Bus must be DataBus object.
        */
        pop : function(bus){
          forEach(drive, function(b, i){
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
          forEach(self.pop(bus).children, function(e){
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
        },
      }
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

          forEach(reserved, function(prop){
            if(xstr.indexOf("this."+prop)>=0){
              /* If there is a coincidence, we warn about it */
              Analyze.MAP.warn(prop, context);
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
    Version: v1.0.0
    Implements data processing through stream. 

    -- v1.0.0 --
      - Incapsulated properties of data bus [fire, process, binding, host, setup] 
        and all these properties now configures from prototype's methods
    ------------ 09.09.2014
  */

  var DataBus = (function(){
    var forEach = Utils.forEach, is = Utils.is;
    var _private = (function(){
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
      forEach(processor.process(), function(i){
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
          binding = null;

      this.$$id = Utils.$hash.set('d');

      var priv = _private(this.$$id, {
        processor : new Processor(proc || [], self),
        host : 0,
        binding : null,
        handlers : [],
        setup : function(x){ return x}
      });

      this.parent = null;
      this.children = [];
      this._ = {  
        fires : new Utils.Queue(),
        takes : new Utils.Queue()
      };
      
      this.bindTo = function(a,b,c) {
        var bus = this;
        if(!binding){
          binding = Warden.watcher(bus, a, b, c);
        }
        return binding;
      };

      this.update = function(e) {
        binding && binding.update(e || this._.takes[this._.takes.length-1]);
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
        self.update(result);

        /* Executing all handlers of this DataBus */
        forEach(handlers, function(handler){
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
      
      forEach(_private(this.$$id, 'handlers'), function(handler, index){
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
      var fn, ctype = typeof x, res;
      switch(ctype){
        case 'function':
          fn = function(e, drive){
            return drive.$continue(x.call(this, e));
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
      return process.call(this, fn);
    };

    /* 
      Appying @fn function ot the previos and current value of recieved data 
      If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
    */
    DataBus.prototype.reduce = function(init, fn){
      Analyze('reduce', fn, arguments.length);
      return process.call(this, function(event, drive){
        var bus = drive.$host(),
            prev = init,
            cur = event;

        if(bus._.takes.length >= 1 || init == 'first' || init == '-f'){
          prev = bus._.takes[bus._.takes.length-1];
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
        if( (fires.length > 1 || takes.length > 0) && (cmp(event, fires[fires.length-2]) || cmp(event, takes[takes.length-1])) ){      
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
    DataBus.prototype.lock = function(){
      this.host().pop(this);
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
    DataBus.prototype.lockParent = function() {
      this.host().popAllUp(this);
    };

    /* Unlocks current bus */
    DataBus.prototype.unlock = function(){
      this.host().push(this);
    };

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
  Warden.watcher = (function(){
  	return function(bus, a, b, c){
  		var ta = typeof a, tb = typeof b, terr = "TypeError", fn, is = Utils.is;

  		if(!is.exist(b) && is.exist(a)){
  			if(ta == 'string' || ta == 'object'){
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
  					return b.call(a, event);
  				}
  			}else
  			{
  				throw terr;
  			}
  		} else

  		{
  			throw "Arg Error"
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
}));