function DataBus(){
  var self = this;
  this._. = {
    skipped : 0,
    emitted : 0,
    taken : 0,
  };



  this.fire = function(event, context){  
    event.timestamp = new Date();
    processor.start(event, context, function(result){
      self._.taken++;
      self.finalCallback.apply(context, [result]);
    });
  }
}

DataBus.prototype.filter = function(x) {
  if(typeof x!== 'function'){
    throw "TypeError: filter argument mus be a function";
  }
  return this.processor.add(function(e){
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
        var t = e[x];
        return this.$continue(exists(t) ? t : x);
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
  return this.processor.add(fn);
};

DataBus.prototype.take = function(x){
  var ctype = typeof x;
  if(ctype == 'function'){
    return this.filter(x);
  }else
  if(ctype == 'number'){
    return this.processor.add(function(e){
      var bus = this.$host();
      bus._.limit = bus._.limit || x;
      if(bus._.taken > bus._.limit){
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
    return this.processor.add(function(e){
      var bus = this.$host();
      if(bus._.emitted <= c){
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
    return this.process.add(function(event){
      var regex = /{{\s*[\w\.]+\s*}}/g;
      return this.$continue(s.replace(regex, function(i){return e[i.slice(2,-2)]}));
    })
  }
}

