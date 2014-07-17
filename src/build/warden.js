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
  
  // Helpers
/* Begin: src/modules/helpers.js */
  /* Helpers module */

  // function exists(i)
  // returns true is i exists;
  var exists = function(i){
    return typeof f !== 'undefined';
  }

  // function isArray(x)
  // checks is x param is real array or object (or arguments object)
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

  // function forEach(@array arr, @function fn)
  // applies @fn for each item from array @arrm usage: forEach([1,2], function(item){...});
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

  // function filter(@array, @function)
  // filtering @array by @function and returns only mathcing as @function(item) === true  elements
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

  // Warden properties and methods
  Warden.version = "0.0.1"; 
  Warden.toString = function() {
    return "Warden.js";
  };
      
/* Begin: src/modules/extend.js */
  Warden.extend = function(child, config) {
    /* Choose object to extend,
       if fn is constructor function, then that's prototype, else
       use actual object element 
    */
    var ctype = typeof child, // type of object to extend
        inheritor = child, // final object to expand
        isConstructor = true; 
      
    switch(ctype){
      case 'function': 
        inheritor = child.prototype;
        isConstructor = true;
      break;
      case 'object':
        isConstructor = false;
        if(isArray(child)) throw "Type Error";
      break;
      default:
        throw "Type Error";
      break;
    }
    
    //collections of callbacks and streams
    var streams = {},
        callbacks = {},
        settings = {
          max : (config && config.max) || 128, //count of max listeners
          context : (config && config.context) || 'this' // apply global context 
        };   
    
    if(isConstructor){
      settings.nativeEmitter = null;
      settings.nativeListener = null;
    }else{
      settings.nativeEmitter = (config && config.nativeEmitter) || (typeof jQuery === 'undefined' ? null : 'trigger');
      settings.nativeListener = (config && config.nativeListener) || (typeof jQuery === 'undefined' ? "addEventListener" : 'on');
    }
    
    //inheritor.wardenid = Warden.extented++;
    
    /* Emitter function */
    inheritor.emit = inheritor.emit || function(ev) {
      var self = this;
        
      // Processing streams for event type
      forEach(streams[ev.type], function(i) {
        return i.evaluate(ev, self);
      });
        
      // Processing callbacks for event type
      forEach(callbacks[ev.type], function(item){
        var context = (item.config && item.config.context) || self, // context of evaluation
            adj = item.config && item.config.adj; // additional data 
        return item.callback.apply(context, [ev].concat(adj));
      });
        
      return this;
    };

    
    inheritor.listen = inheritor.listen || function(ev, callback, config){
      if (typeof ev !== 'string') {
        throw "Type Error: Wrong argument[1] in .on method. Expected string.";
      }
      if (typeof callback !== 'function') {
        throw "Type Error: Wrong argument[2] in .on method. Expected function.";
      }
      
      // creating callbacks i
      callbacks[ev] = callbacks[ev] || [];
      
      if (callbacks[ev].length >= settings.max) {
        throw "The maximum number (" + settings.max + ") of handler for event [" + ev + "] exceed.";
      }
      
      callbacks[ev].push({
        callback: callback,
        config: config
      });
      return this;
    };
      
    // Creating stream
    inheritor.stream = function(type, config) {
      var l = inheritor[settings.nativeListener]; // invocation retranslator

      if(l){
        if(settings.context == 'this'){
          inheritor[settings.nativeListener](type, function(e){
            inheritor.emit(e);
          });
        }else{
          l(type, inheritor.emit);
        }
      }

      var stream = createStream(type, config);
      if(streams[type] == null)
        streams[type] = [];

      streams[type].push(stream);
      return stream;
    };

    return child;
  };/* End: src/modules/extend.js */
  /* Extending fn with warden methods */
    
  // Private functions  
  function createStream(ev, options) {
    var config = {
      maxTakenLength : (options && options.maxTakenLength) || 64,
      maxHistoryLength : (options && options.maxHistoryLength) || 64,
      context : (options && options.context) || null
    };
        
/* Begin: src/modules/Processor.js */
    /*
      Processor module:
      In all processing functions: this variable is EventBus object;
    */ 

    var Processor = (function(){  
      function deprecate(fn){
        return {
          busIsDeprecated : true,
          deprecationFn : fn
        }
      }
      
      var processor = {};
        
      // Processing functions:
      
      // mapping function
      processor['m'] = function map(process, event){
        var fn = process.fn;
        // fn is function then apply function
        
        if (typeof fn === 'function') {
          event = fn.apply(config.context, [event]);
        }else 
        
        // fn is property of event
        if(typeof fn === 'string' && event[fn] != undefined) {
          event = event[fn];               
        }else 
          
        // fn is array
        if(isArray(fn)){
          event = forEach(fn, function(prop){
            if (typeof prop === 'string' && event[prop] !== undefined) {
              return event[prop];
            }
          });
        }else 
        if(typeof fn === 'object'){
          var result = {};
          for(var key in fn){
            var val = fn[key];
            result[key] = event[fn[key]];
          }
          event = result;
        }else{
          event = fn;
        }
        this.mapped = true;
        return event;
      };
      
      processor['f'] = function filter(process, event){
        var fn = process.fn;
        if(typeof fn === 'function') {
          if (fn.apply(config.context, [event]) === false) {
            return deprecate('filter');
          }
        }else{
          if(Boolean(fn) === false) {
            return derprecate('filter');
          }
        }
        this.filtered = true;
        return event;
      };
      
      processor['i'] = function include(process, event){
        var fn = process.fn;
        var self = this;
        if(isArray(fn)){
          forEach(fn, function(item){
            if(typeof item=='string'){
              if(this._public[item]!=null){
                event[item]=self._public[item];
              }
            }else{
              throw "Unexpected "+ typeof item + " at inclide";
            }
          });
        }else{
          if(this._public[fn]!=null){
            event[fn] = self._public[fn];
          }
        }
        return event;
      };
      
      processor['r'] = function reduce(process, event){
        var fn = process.fn, prev;
        if(this.taken.length>0){
          prev = this.taken[this.taken.length-1];
        }else{
          prev = process.start == 'first' ?  event : process.start;
        }
        event = fn.apply(config.context, [prev, event]);
        return event;
      };
      
      processor['u'] = function unique(process, event){
        if(this.taken.length){
          var pt = this.taken[this.taken.length-1][process.prop];
          if(pt){
            if(event[process.prop] == pt){
              return deprecate('unique');
            }  
          }else{
            if(event[process.prop] == this.history[this.history.length-1][process.prop]){
              return deprecate('unique');
            }
          }        
        }
        return event;
      };
      
      return processor;
    })();/* End: src/modules/Processor.js */
    
    // Event bus class
    var Bus = (function() {
      function Bus(process) {
        this.process = process != null ? process : [];
        this._public = {
          skipped : 0,
          taken : 0,
          limit : 0,
          length : 0,
          ignore : 0
        };
        this.history = [];
        this.taken = [];
      }
          
      
      Bus.prototype.exec = function(ev, cnt) {     
        if(this.locked){
          return false;
        }        
        var self = this;
        var event = ev;        
        this._public.length++;
        
        event.timestamp = (new Date()).getTime();
        
        for(var i=0, l=this.process.length; i<l; i++){
          var process = this.process[i];
          var res = Processor[process.type].apply(this, [process, event]);
          if(res.busIsDeprecated){
            return false;
          }else{
            event = res;
          }
        };        

        if(this.history.length >= config.maxHistoryLength){
          this.history.shift(0);
        }
        this.history.push(ev); 
         
        // skipin by limit on top
        if (this._public.limit && (this._public.taken >= this._public.limit)) {
          return false;
        }

        // skipin by limit on bottom
        if(this._public.length <= this._public.ignore){
          this._public.skipped++;
          return false;
        }

        this._public.taken++;
        
        if(this.taken.length >= config.maxTakenLength){
          this.taken.shift(0)
        }
        this.taken.push(event); 

        if(this.connector){
          if(!this.connector.locked){
            this.connector.assign(event);
          }else{
            console.log('locked');
          }
        }else{
           this.finalCallback.apply(config.context || cnt, [event]);  
        }

        return this;        
      };
      
      Bus.prototype.toString = function(){
        return Warden.stringify(this.process);
      };

      Bus.prototype.map = function(fn){
        var newbus = new Bus(this.process.concat({
          type: 'm',
          fn: fn
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.filter = function(fn){
        var newbus =  new Bus(this.process.concat({
          type: 'f',
          fn: fn
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.include = function(prop){
          var newbus = new Bus(this.process.concat({
            type : 'i',
            fn : prop
          }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.reduce = function(start, fn) {
        var newbus = new Bus(this.process.concat({
          type : 'r',
          fn : fn,
          start : start
        }));
        newbus._public = this._public;
        return newbus;
      };

      Bus.prototype.take = function(limit, last){
        if(typeof limit === 'function'){
          return this.filter(limit);
        }else{
          var newbus = new Bus(this.process);
          if(last != null){
            if(typeof last == 'number'){ //need checj that last > limit
              return newbus.skip(limit).take(last-limit);
            }else{
              throw "Type Error: take method expect number at second argumner;";
            }
          }else{
            this.limit = limit;
            this._public.limit = limit;
            var pub = this._public;
            newbus._public = pub;
            newbus._public.limit = limit;
            newbus.limit = limit;
          }
          return newbus;
        }
      };
      
      Bus.prototype.skip = function(count){
        if(typeof count !== 'number'){
          throw "Type Error: skip method expect numbers;";
        }
        var newbus = new Bus(this.process);
        var pub = this._public;
        newbus._public = pub;
        newbus._public.ignore = count;
        this._public.ignore = count;
        return newbus;      
      };

      Bus.prototype.unique = function(prop) {
        var newbus = new Bus(this.process.concat({
          type : 'u',
          prop : prop
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.lock = function(){
        this.locked = true;
      };
      
      Bus.prototype.unlock = function(){
        this.locked = false;
      };
          
      Bus.prototype.listen = function(fn){
        if(fn === 'log'){
          this.finalCallback = function(e){
            console.log(e);
          }
        }else{
          this.finalCallback = fn;  
        }        
        stream.activeBus.push(this);
        return this;
      };

      Bus.prototype.log = function(){
        return this.listen(function(e){
          console.log(e);
        });
      };
      
      Bus.prototype.evaluate = function(ev, cnt){
        return stream.activeBus.map(function(bus){
          return bus.exec(ev, cnt);
        });
      };

      Bus.prototype.connect = function(item, propOrMethod) {
        var connector = new Connector(item, propOrMethod, this);
        this.connector = connector
        stream.activeBus.push(this);
        return this.connector
      };

      return Bus;
    })();
    
    var stream = {
      type: ev,
      activeBus: []
    };

    return new Bus();
  };
  
  // Conncector class
/* Begin: src/modules/Connector.js */
  // Connector module 

  var Connector = (function(){
    function Connector(item, prop, host){
      this.item = item;
      if(typeof prop === 'function'){
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