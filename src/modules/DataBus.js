function DataBus(proc){
  var processor = new Processor(proc || [], this), //processor
      host = 0; //hosting stream

  this.id = Math.random()*1000000000 >> 0; //for debugging
  this.parent = null;
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
      nbus.parent = this.parent || this;
      return nbus;  
    }
  };
    
  this.fire = function(data, context){  
    var self = this;
    data = exists(data) ? data : {};
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
        var t = e[x], r = exists(t) ? t : x;
        this.$host()._.fires.get()[this.$host()._.fires.length()-1] = r;
        return this.$continue(r);
      }
    break;
    case 'object':
      if(isArray(x)){
        fn = function(e){
          var res = [];
          forEach(x, function(i){
            var t = e[i];
            res.push(exists(t) ? t : i);
          }); 
          return this.$continue(res);
        }
      }else{
        fn = function(e){
          var res = {}, t;
          for(var prop in x){
            t = e[x[prop]];
            res[prop] = exists(t) ? t : x[prop];
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
        var prev = bus._.takes.get(bus._.takes.length());
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
      if(bus._.takes.length() === bus._.limit){
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
      if(bus._.fires.length() <= c){
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
          fired = bus._.fires.length()-1;
      if(!bus._.timer){
        bus._.collectionStart = fired;
        bus._.timer = setTimeout(function(){
          var collection = bus._.history.slice(bus._.collectionStart, fired);
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
      emit(fn(data, bus._.fires.get(bus._.fires.length()-1)));
    });
    bus.listen(function(data){
      emit(fn(self._.fires.get(self._.fires.length()-1), data));
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
    if( (fires.length() > 1 || takes.length() > 0) && (event == fires.get(fires.length()-2) || event == takes.get(takes.length()-1))){      
      return this.$break();
    }else{
      return this.$continue(event);
    }  
  });
};