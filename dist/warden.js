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
  Warden.version = "0.0.2"; 
  Warden.log = function(){
    if(Warden.debug || window.debug){
      console.log(arguments);
    }
    return void 0;
  }
  
/* Begin: src/modules/Helpers.js */
  /* Helpers functions */

  /*
    Function exists(@mixed x):
    Returns true is x exists and not equal null.
  */
  var exists = function(x){
    return typeof x !== 'undefined' && x !== null;
  }


  /*
    Function isArray(@mixed x):
    Checks is x param is real array or object (or arguments object)
  */
  var isArray = (function(){
    if(Array.isArray){
      return function(x){ 
        return Array.isArray(x); 
      }
    }else{
      return function(x){ 
        Object.prototype.toString.call(x) === '[object Array]';
      }
    }
  }());


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
  })();/* End: src/modules/Helpers.js */
/* Begin: src/modules/Extend.js */
  /* 
    This methods extends @obj which can be both 
    function or object with Warden.js methods .emit(), 
    .listen() and .stream() 
  */

  Warden.extend = function(obj, conf) {
    /* Default configuration */

    var config = conf || {
      max : 256,       context : 'this',       emitter : null,       listener : null     };
    
    /* 
      Choose object to extend,
      if fn is constructor function, then that's prototype, else
      use actual object element 
    */
    
    var ctype = typeof obj,         inheritor = obj,         isConstructor = true;     
    switch(ctype){
      case 'function':         inheritor = obj.prototype;
        isConstructor = true;
      break;
      case 'object':         isConstructor = false;
      break;
    }
    
    /* 
      Setting up standart DOM event listener 
      and emitters  function to not overwrite them 
      and user should do not use that in config 
    */

    if(typeof jQuery !== 'undefined'){
      config.emitter = config.emitter || 'trigger';
      config.listener = config.listener || 'on';    
    }else
    if(typeof inheritor.addEventListener === 'function' || typeof inheritor.attachEvent === 'function'){
      config.listener = config.listener || (typeof inheritor.addEventListener === 'function' ? "addEventListener" : "attachEvent");
    }
      
    /* Collections of private handlers */
    /* Developed to incapsulate handlers of every object */
    var handlers = [];

    /* Setting new handler @fn of event type @type to @object */
    handlers.setNewHandler = function(object, type, fn){
      var handlers = this.getHandlers(object, type);
      if(handlers){
        if(handlers.length < config.max){
          handlers = handlers.push(fn);
        }else{
          throw "Maximal handlers count";
        }
      }else{
        var collection = this.getCollection(object);
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
    handlers.getCollection = function(object){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i]
        }
      }
      return false;
    };

    /* Get handlers of @object by @type */
    handlers.getHandlers = function(object, type){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i].handlers[type];
        }
      }
      return false;
    };  
    
    /* React function to emit std. events */
    function react(type){
      var self = this;
      if(this[config.listener]){
        var fn = function(event){ 
          self.emit(event);
        };
        this[config.listener].apply(this, [type, react]);
      }
    }

    /* Emitter method */
    inheritor.emit = function(ev) {
      Warden.log("Emitted " + ev.type);
      var self = this,
          callbacks = handlers.getHandlers(this, ev.type);
        
      forEach(callbacks, function(callback){
        callback.call(self, ev);
      });
        
      return this;
    };

    /* Listener function */
    inheritor.listen = function(type, callback, settings){    
      handlers.setNewHandler(this, type, callback);    
      react.apply(this, [type]);
      return this;
    };
      
    /* Creates stream */
    inheritor.stream = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this);

      handlers.setNewHandler(this, type, function(event){
        stream.eval(event);
      });

      react.apply(this, [type]);
      
      return stream.get();
    };

    return obj;
  };/* End: src/modules/Extend.js */
/* Begin: src/modules/Processor.js */
  /*
    Processor module:
    In all processing functions: this variable is EventBus object;
  */

  function Processor(){
    var processes = [], i = 0;
    this.result = null;

    this.tick = function(event, context, preventValue) {
      if(i>=processes.length){
        return false;
      }
      
      var res = processes[i].apply(context, [event]);    
      
      if(preventValue !== undefined && res === preventValue){
        res = false;
      }
      i++;
      this.result = res;
      return res;
    };

    this.push = function(process){
      processes.push(process)
    }

    this.getLength = function(){
      return processes.length;
    };
    
    this.flush = function(){
      i = 0;
    };

  }
/* End: src/modules/Processor.js */
/* Begin: src/modules/Streams.js */
  Warden.makeStream = function(x, context){
    var stream,
        ctype = typeof x;

    switch(ctype){
      case 'function':
        for(var i = 0, type = ""; i<2; i++){
          type += (Math.random() * 100000 >> 0) + "-";
        }

        stream = new Stream(type.slice(0,-1), context);

        x(function(expectedData){
          stream.eval(expectedData);
        });
      break;
      case 'string':  
        stream = new Stream(x, context);
      break;
      default:
        throw "Unexpected data type at stream\n";
        break;
    }
    
    return stream.get();
  }

  function Stream(dataType, context, toolkit){
    var listeningBuses = [];
    this.drive = []; 
    this.id = Math.random() * 10000 >> 0;

    var bus = new DataBus();
    bus.setHost(this);

    this.eval = function(data){
      listeningBuses.forEach(function(bus){
        bus.fire(data, context);
      });
    };

    this.push = function(bus){
      listeningBuses.push(bus);
    };

    this.get = function(){
      return bus;
    };

    return this;
  }

  function DataBus(proc){
        var processor = proc || new Processor(),
        host = 0;

    this._publicData = {
      taken : 0,
      filtered : 0,
      skipped : 0,
      fired : 0
    };

    this.setHost = function(nhost){
      host = nhost;
    };

    this.getHost = function(nhost){
      return host;
    };

    this.getProcessor = function(){
      return processor;
    }

    this.addProcess = function(process){
      processor.push(process);
    }

    this.fire = function(event, context){
      var self = this;

      debugger;
      if(processor.getLength()){
        while(processor.tick(event, context, false)){
          event = processor.result;
        }
      }
      
      processor.flush();

      return this.callback.apply(context, [event]);;
    }
  }

  DataBus.prototype.listen = function(x){
    var nb = this.clone();
    
    if(typeof x === 'function'){
      nb.callback = x;
    } else {
      nb.callback = function(){
        console.log(x);
      }
    }
    
    this.getHost().push(nb);
    return nb;
  };
    
  DataBus.prototype.log = function(){
    return this.listen(function(data){
      console.log(data);
    });
  }

  DataBus.prototype.clone = function() {
    var nbus = new DataBus(this.getProcessor());
    nbus.setHost(this.getHost());
    return nbus;
  }

  DataBus.prototype.map = function(x) {
    var fn;

    if(typeof x === 'string'){
      fn = function(event, context){
        if(exists(event[x])){
          return event[x]
        }else{
          return x
        }
      }
    }else{
      fn = function(event, context){
        event = x.apply(context, [event]);
        return event;
      }
    }

    var nbus = this.clone();
    nbus.addProcess(fn);
    return nbus;
  };/* End: src/modules/Streams.js */
  }));