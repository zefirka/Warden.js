function DataBus(proc){
  var processor = new Processor(proc || [], this),
      host = 0;
  
  this._ = {
    history : [],
    takes : [],
    fired : 0,
    taken : 0,
    skipped : 0
  };

  this.host = function(h){
    return host = h || host;
  }
  
  this.getProcessor = function(){
    return processor;
  }

  this.addProcess = function(process){
    var nprocess = [];
    forEach(processor.getProcesses(), function(i){
      nprocess.push(i);
    });
    nprocess.push(process);
    var nbus = new DataBus(nprocess);
    nbus.host(this.host());
    return nbus;
  }
    
  this.fire = function(data, context){  
    var self = this;
    this._.fired++;
    this._.history.push(data);
    processor.start(data, context, function(result){
      self._.taken++;
      self.handler.apply(context, [result]);
    });
  }
}

DataBus.prototype.listen = function(x){
  var nb = this.clone();
  if(typeof x === 'function'){
    nb.handler = x;
  } else {
    nb.handler = function(){
      console.log(x);
    }
  }
  
  this.host().push(nb);
  return nb;
};

DataBus.prototype.unbind = function(){
  this.host().pop(this);
};

DataBus.prototype.log = function(){
  return this.listen(function(data){
    console.log(data);
  });
}

DataBus.prototype.clone = function() {
  var nbus = new DataBus(this.getProcessor().getProcesses());
  nbus.host(this.host());
  return nbus;
}

DataBus.prototype.filter = function(x) {
  if(typeof x!== 'function'){
    throw "TypeError: filter argument mus be a function";
  }
  return this.addProcess(function(e){
    return x(e) === true ? this.$continue(e) : this.$break();
  });
}

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
        var t = e[x], 
            r = exists(t) ? t : x;
        this.$host()._.history[this.$host()._.fired-1] = r;
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
          return this.$continue(prop);
        }
      }
    break;
    default:
      fn = function(e){
        return this.$continue(x);
      }
    break;
  }
  return this.addProcess(fn);
};

DataBus.prototype.take = function(x){
  var ctype = typeof x;
  if(ctype == 'function'){
    return this.filter(x);
  }else
  if(ctype == 'number'){
    return this.addProcess(function(e){
      var bus = this.$host();
      bus._.limit = bus._.limit || x;
      if(bus._.taken === bus._.limit){
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
  if(typeof c === 'number'){
    return this.addProcess(function(e){
      var bus = this.$host();
      if(bus._.fired <= c){
        this.$break();
      }else{
        return this.$continue(e);
      }
    });
  }else{
    throw "TypeError: skip argument must be only number";
  }
};

DataBus.prototype.mask = function(s){
  if(typeof s !== 'string'){
    return this.map(s);
  }else{
    return this.addProcess(function(event){
      var regex = /{{\s*[\w\.]+\s*}}/g;
      return this.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
    })
  }
};

DataBus.prototype.debounce = function(t) {
  if(typeof t == 'number'){
    return this.addProcess(function(e){
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
  if(typeof t == 'number'){
    return this.addProcess(function(e){
      var self = this, bus = this.$host();
      if(!bus._.timer){
        bus._.collectionStart = bus._.fired-1;
        bus._.timer = setTimeout(function(){
          var collection = bus._.history.slice(bus._.collectionStart, bus._.fired);
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
    self.listen(emit)
  }).get();
};