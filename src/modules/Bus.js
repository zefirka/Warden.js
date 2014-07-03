
module.exports = (function() {

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
          } else if (typeof fn === 'string' && event[fn] !== void 0) {
            event = event[fn];               
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
    if(this.connector){
      this.connector.assign(event);
    }else{
       this.finalCallback.apply(cnt, [event]);  
    }

    return this;        
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
    this.finalCallback = fn;
    stream.activeBus.push(this);
    return this;
  };

  Bus.prototype.evaluate = function(ev, cnt){
    return stream.activeBus.map(function(bus){
      return bus.exec(ev, cnt);
    });
  };

  Bus.prototype.connect = function(item, prop) {
    var connector = new Connector(item, prop, this);
    this.connector = connector
    stream.activeBus.push(this);
    return this.connector
  };

  return Bus;
})();