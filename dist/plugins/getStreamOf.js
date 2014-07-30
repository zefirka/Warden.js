(function(){
  (function(root, factory) {
    var Warden;
    if (typeof exports === 'object' && exports) {
      return factory(exports);
    } else {
      if (!root.Warden) {
        Warden = {};
      } else {
        Warden = root.Warden;
        factory(Warden);
      }
      if (typeof define === 'function' && define.amd) {
        return define(Warden);
      } else {
        return root.Warden = Warden;
      }
    }
  })(this, function(Warden) {
    
    Warden.getStreamOf = function(fn, context){
      
      var type = [0,0,0,0,0].map(function(item, i){ return (((Math.random() * Math.pow(10, i+2))  >> 0 ) >> (Math.abs(i-1)))}).join("-");
      var stream = Warden.createStream(type+'', context || this);

      fn(function(arrivedData){
        stream.eval(arrivedData);
      });

      return stream;
    }
  
  });


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

    var bus = new DataBus();
    bus.setHost(this);

    this.eval = function(data){
      console.log("Evaluated");
      listeningBuses.forEach(function(bus){
        debugger;
        bus.fire(data, context);
      });
    }

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

      return this.callback.apply(context, [event]);;
    }
  }

  DataBus.prototype.listen = function(x){
    this.getHost().push(this);
    this.callback = x;
    var nb = this.clone();
    return nb;
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



  function Processor(){
    var processes = [], i = 0;
    this.result = null;

    this.tick = function(event, context, preventValue) {
      var res = processes[i].apply(context, [event]);
      if(i<processes.length || (preventValue !== undefined && res === preventValue)){
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
    }
    
  }

})();