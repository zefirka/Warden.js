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
    return Warden.stringify(Warden);
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
      
      var stream = Warden.stream(type);
      if(streams[type] == null)
        streams[type] = [];
      
      streams[type].push(stream);
      return stream;
    };
    
    return fn;
  };

  Warden.stream = function(ev) {
    var Bus = (function() {

      function Bus(process) {
        this.process = process != null ? process : [];
        
        this.public = {
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
        this.public.length++;
        
        event.timestamp = (new Date()).getTime();
        event.environment = 'Warden 0.0.0';
        
        this.history.push(event); //need to check length
        
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
                if(this.public[process.fn]!=null){
                  event[process.fn]=this.public[process.fn];
                }
          }
        }
                
        if (this.public.limit && (this.public.taken >= this.public.limit)) {
          return false;
        }

        if(this.public.length <= this.public.ignore){
          return false;
        }

        this.public.taken++;
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
          this.public.limit = limit;
          var pub = this.public;
          newbus.public = pub;
          newbus.public.limit = limit;
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
      var pub = this.public;
      newbus.public = pub;
      newbus.public.ignore = count;
      this.public.ignore = count;
      return newbus;      
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

  // object to string function
  Warden.stringify = function(json, delim, n){
    var i, key, offset, res, val;
    
    var res = "", // result
        offset = ""; //padding

    res = "{" + (delim ? "\n" : " ");
    
    // Setting up recursion depth
    n = !n ? 0 : n;
    
    // If recursion depth more than 2
    if(n > 2){
      res = "[object]";
      return res;
    }

    var i = 0;
    while(i++ <= n && delim){
      offset += "\t";
    }

    for (key in json) {
      val = json[key];
      res += "" + offset + key + ":";

      if (typeof val === 'object') {
        res += Warden.stringify(val, delim, n + 1) + (delim ? ",\n" : ", ");
      }else{
        if(val != null){
          if(typeof val === 'string'){
            res += "'" + (val.toString()) + "'" + (delim ? ",\n" : ", ");
          } else {
            res += val.toString() + (delim ? ",\n" : ", ");
          }
        } else {
          res += "'undefined'" + (delim ? ",\n" : ", ");
        }
      }
    }
    res = res.slice(0, -2);
    res +=  (n>0) ? " }" : (delim ? "\n}" : " }");    

    return res;
  };

}));
