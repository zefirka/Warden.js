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
  
    Warden.version = "0.0.1"; 
  Warden.toString = function() {
    return "Warden.js";
  };


/* Begin: src/modules/helpers.js */
  /* Helpers module */

      var exists = function(x){
    return x != void 0 && x !== null;
  }

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


  var forWhile = function(arr, fn, preventVal, preventRet){
    for(var i=0, l=arr.length; i<l; i++){
      if(fn(arr[i], i) === preventVal){
        return preventRet; 
        break;
      }
    }
  };

      var forEach = (function(){
    if(Array.prototype.forEach){
      return function(arr, fn){ 
        return arr ? arr.forEach(fn) : null;
      }
    }else{
      return function(arr, fn){ 
        for(var i=0, l=arr.length; i<l;i++){ 
          if(fn(arr[i], i) === false) break;
        }
      }
    }
  }());

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
  })();/* End: src/modules/helpers.js */
/* Begin: src/modules/extend.js */
  Warden.extend = function(obj, conf) {
    /* Default configuration */
    var config = conf || {
      max : 128,
      context : 'this',
      nativeEmitter : null,
      nativeListener : null
    };
    
    /* Choose object to extend,
       if fn is constructor function, then that's prototype, else
       use actual object element 
    */
    
    var ctype = typeof obj,         inheritor = obj,         isConstructor = true; 
      
    switch(ctype){
      case 'function': 
        inheritor = obj.prototype;
        isConstructor = true;
      break;
      case 'object':
        isConstructor = false;
      break;
    }
    
    
    if(typeof jQuery !== 'undefined'){
      config.nativeEmitter = config.nativeEmitter || 'trigger';
      config.nativeListener = config.nativeListener || 'on';    
    }else
    if(typeof inheritor.addEventListener === 'function') {
      config.nativeListener = config.nativeListener || "addEventListener";
    }
      
    /* Collections of private handlers */
    var handlers = [];
    handlers.setNewHandler = function(object, type, fn){
      var handlers = this.getHandlers(object, type);
      if(handlers){
        handlers.push(fn);
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
    
    handlers.getCollection = function(object){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i]
        }
      }
      return false;
    };

    handlers.getHandlers = function(object, type){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].object === object){
          return this[i].handlers[type];
        }
      }
      return null;
    };  
    
    /* Emitter function */
    inheritor.emit = inheritor.emit || function(ev) {
      console.log("Emitted " + ev.type);
      var self = this,
          callbacks = handlers.getHandlers(this, ev.type);
        
      forEach(callbacks, function(callback){
        callback.call(self, ev);
      });
        
      return this;
    };

    /* Listener function */
    inheritor.listen = function(ev, callback, settings){    
      var self = this;
      handlers.setNewHandler(this, ev, callback);    
      if(this[config.nativeListener]){
        this[config.nativeListener].apply(this, [ev, function(event){ self.emit(event)}]);
      }
      return this;
    };
      
    /* Creates stream */
    inheritor.stream = function(type, cnt) {
      var self = this,
          stream = Warden.makeStream(type, cnt || this);
      
      handlers.setNewHandler(this, type, function(event){
        stream.eval(event);
      });
      
      if(this[config.nativeListener]){
        this[config.nativeListener].apply(this, [type, function(event){ stream.eval(event);}]);
      }
      
      return stream.get();
    };

    return obj;
  };/* End: src/modules/extend.js */
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
      var stream;
      if(typeof x === 'function'){
        var type = [0,0,0,0,0].map(function(item, i){ return (((Math.random() * Math.pow(10, i+2))  >> 0 ) >> (Math.abs(i-1)))}).join("-"),
            stream = new Stream(type, context);
          debugger;
        x(function(expectedData){
          stream.eval(expectedData);
        });

      }else
      if(typeof x === 'string'){
        stream = new Stream(x, context);
      }else{
        throw "Unexpected data type at stream\n";
      }

      return stream;
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
    }

    this.get = function(){
      return bus;
    }

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
  };



/* End: src/modules/Streams.js */
/* Begin: src/modules/Connector.js */
  
  var Connector = (function(){
    function Connector(item, prop, host){
      this.item = item;
      if(typeof item.prop === 'function'){
        this.method = prop;
      }else{
        this.prop = prop;  
      }

      this.host = host;
      this.locked = false;
    }
    Connector.prototype.assign = function(value) {
      if(this.method){
        this.item[this.method](value);
      }else{
        this.item[this.prop] = value;
      }
    };
    Connector.prototype.unbind = function() {
      this.locked = true;
    };
    Connector.prototype.bind = function() {
      this.locked = false;
    };
    return Connector;
  })();/* End: src/modules/Connector.js */
}));