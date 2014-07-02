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
})(this, function (Warden) {

  // Write here

  Warden.version = "0.0.0";

  Warden.toString = function() {
    return "Warden.js";
  };

  Warden.create = function(fn, config) {
    var streams = {},
        callbacks = {},
        settings = {};
    
    settings.max = (config && config.max) || 128; // max handlers per event
    
    var inheritor = fn.prototype || fn;
    
    inheritor.emit = function(ev) {
      var self = this;
      
      // Processing streams for event type
      if(streams[ev.type] != null){
        streams[ev.type].map(function(i) {
          return i.evaluate(ev, self);
        });
      }
       
      // Processing callbacks for event type
      if(callbacks[ev.type] != null){
        callbacks[ev.type].map(function(item) {
          var context = (item.config && item.config.context) || self, // context of evaluation
              adj = item.config && item.config.adj; // additional data 
          return item.callback.apply(context, [ev].concat(adj));
        });
      }
      
      return this;
    };

    //if on method is not defined
    if(fn.on === void 0){ 
      inheritor.on = function(ev, callback, config) {
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
    
    // Creating stream
    inheritor.stream = function(type, listenerFunction) {
      if(inheritor.addEventListener != null){
        inheritor.addEventListener(type, function(e){
          inheritor.emit(e);
        });
      }else
      if(inheritor[listenerFunction] != null){
        inheritor[listenerFunction](type, inheritor.emit);
      }
      
      var stream = createStream(type);
      if(streams[type] == null)
        streams[type] = [];
      
      streams[type].push(stream);
      return stream;
    };
    
    return fn;
  };

  function createStream(ev) {
    
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
        var self = this;
        var event = ev;
        this._public.length++;
        
        event.timestamp = (new Date()).getTime();
        event.environment = 'Warden 0.0.0';
        
        
        for (var i = 0, l = this.process.length; i < l; i++) {
          process = this.process[i];
          fn = process.fn;
          switch (process.type) {
            case 'm':
              if (typeof fn === 'function') {
                event = fn(event);
              } else if (typeof fn === 'string') {
                if (event[fn] !== void 0) {
                  event = event[fn];
                }
              } else {
                event = fn;
              }
              self.mapped = true;
              break;
            case 'f':
              if (typeof fn === 'function') {
                if (fn(event) === false) {
                  return false;
                }
              } else {
                if (Boolean(fn) === false) {
                  return false;
                }
              }
              break;
            case 'i':
              if(this._public[process.fn]!=null){
                event[process.fn]=this._public[process.fn];
              }
              break;
            case 'r':
              var prev;
              if(this.taken.length>0){
                prev = this.taken[this.taken.length-1];
              }else{
                prev = process.start == 'first' ?  event : process.start;
              }
              event = process.fn(prev, event);
              break;
            case 'u':
              if(this.taken.length){
                var pt = this.taken[this.taken.length-1][process.prop];
                if(pt){
                  if(event[process.prop] == pt){
                    return false;
                  }  
                }else{
                  if(event[process.prop] == this.history[this.history.length-1][process.prop]){
                    return false;
                  }
                }
                
              }
              break;              
          }
        }

        this.history.push(ev); //need to check length
        
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
        this.taken.push(event); //need to check length
        return this.final.apply(cnt, [event]);
      };

      return Bus;
    })();
    
    var stream = {
      type: ev,
      config: [],
      activeBus: []
    };

    Bus.prototype.map = function(fn){
      return new Bus(this.process.concat({
        type: 'm',
        fn: fn
      }));
    };
    
    Bus.prototype.filter = function(fn){
      return new Bus(this.process.concat({
        type: 'f',
        fn: fn
      }));
    };
    
    Bus.prototype.include = function(prop){
        return new Bus(this.process.concat({
          type : 'i',
          fn : prop
        }));
    };
    
    Bus.prototype.reduce = function(start, fn) {
      return new Bus(this.process.concat({
        type : 'r',
        fn : fn,
        start : start
      }));
    };

    Bus.prototype.take = function(limit, last){
      if(typeof limit === 'function'){
        return this.filter(limit);
      }else{
        var newbus = new Bus(this.process);
        if(last != null){
          if(typeof last == 'number'){ //need checj that last > limit
            return this.skip(limit).take(last-limit);
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
      return new Bus(this.process.concat({
        type : 'u',
        prop : prop
      }));
    };

    Bus.prototype.listen = function(fn){
      this.final = fn;
      stream.activeBus.push(this);
      return this;
    };

    Bus.prototype.evaluate = function(ev, cnt){
      return stream.activeBus.map(function(bus){
        return bus.exec(ev, cnt);
      });
    };

    return new Bus();
  };
}));
