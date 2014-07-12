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

  var forEach = (function(){
    if(Array.prototype.forEach){
      return function(arr, fn){ 
        return arr ? arr.forEach(fn) : undefined;
      }
    }else{
      return function(arr, fn){ 
        for(var i=0, l=arr.length; i<l;i++){ 
          fn(arr[i], i) 
        }
      }
    }
  }());
    Warden.version = "0.0.1"; 
  Warden.toString = function() {
    return "Warden.js";
  };
    
    
  Warden.trigger = function(element, ev){
    if(document.createEvent){
      event = document.createEvent("HTMLEvents");
      event.initEvent(ev.type, true, true);
    }else{
      event = document.createEventObject();
      event.eventType = ev.type
    }

    event.eventName = ev.type;
    for(var i in ev){
      event[i] = ev[i];
    }

    if(document.createEvent){
      element.dispatchEvent(event);
    }else{
      element.fireEvent("on" + event.eventType, event);
    }
  };  
    Warden.create = function(fn, config) {
        var inheritor = fn.prototype || fn,
        isConstructor = fn.prototype != void 0;

        var streams = {},
        callbacks = {},
        settings = {
          max : (config && config.max) || 128,           context : (config && config.context) || 'this'         };   
    
    if(isConstructor){
      settings.nativeEmitter = null;
      settings.nativeListener = null;
    }else{
      settings.nativeEmitter = (config && config.nativeEmitter) || (typeof jQuery === 'undefined' ? null : 'trigger');
      settings.nativeListener = (config && config.nativeListener) || (typeof jQuery === 'undefined' ? "addEventListener" : 'on');
    }
  
        inheritor.emit = function(ev) {
      var self = this;
      
            forEach(streams[ev.type], function(i) {
        return i.evaluate(ev, self);
      });
      
            forEach(callbacks[ev.type], function(item){
        var context = (item.config && item.config.context) || self,             adj = item.config && item.config.adj;         return item.callback.apply(context, [ev].concat(adj));
      });
      
      return this;
    };

        if(fn.on === void 0){ 
      
      inheritor.on = function(ev, callback, config){
        if(fn.addEventListener != void 0){
          this.addEventListener(ev, callback);
          return this
        }
        if (typeof ev !== 'string') {
          throw "Type Error: Wrong argument[1] in .on method. Expected string.";
        }
        if (typeof callback !== 'function') {
          throw "Type Error: Wrong argument[2] in .on method. Expected function.";
        }
        if (callbacks[ev] == null) {
          callbacks[ev] = [];
        }
        if (callbacks[ev].length >= settings.max) {
          throw "The maximum number (" + settings.max + ") of handler for event [" + ev + "] exceed.";
        }
        callbacks[ev].push({
          callback: callback,
          config: config
        });
        return this;
      };
    }
    
        inheritor.stream = function(type, config) {
      var l = inheritor[settings.nativeListener];       
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
    
    if(isConstructor){
      inheritor.streamOf = function(obj, type, config) {
        var l = obj[settings.nativeListener];       
        if(l){
          if(settings.context == 'this'){
            l(type, function(e){
              inheritor.emit(e)
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
    }

    return fn;
  };
  
    function createStream(ev, options) {
    var config = {
      maxTakenLength : (options && options.maxTakenLength) || 64,
      maxHistoryLength : (options && options.maxHistoryLength) || 64,
      context : (options && options.context) || null
    };
        
        
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
         
                if (this._public.limit && (this._public.taken >= this._public.limit)) {
          return false;
        }

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
            if(typeof last == 'number'){               return newbus.skip(limit).take(last-limit);
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
  })();}));