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
  //private keys
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