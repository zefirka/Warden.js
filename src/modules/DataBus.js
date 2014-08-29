/*
  DataBus module.
  Version: v0.1.0
  Implements data processing through stream. 
*/

var DataBus = (function(){
  var forEach = Utils.forEach, is = Utils.is, Analyze = Utils.Analyze;      

  function DataBus(proc){
    var processor = new Processor(proc || [], this), //processor
        host = 0, //hoster stream
        setup = function(x){
          return x
        }; 

    this.$$id = Utils.$hash.set('d'),
    
    this.parent = null;
    this.children = []; 
    this.handlers = [];

    this._ = {
      fires : new Utils.Queue(),
      takes : new Utils.Queue()
    };

    /* Return hoisting stream if @h doesn't exists or setting up new host */
    this.host = function(h){
      return host = h || host;
    }

    /* This function sets up current data */
    this.setup = function(fn){
      Analyze('setup', fn);
      setup = fn;
    }

    this.process = function(p){
      var nprocess, nbus;
      if(!p){
        return processor;
      }else{
        /* Copying process */
        nprocess = [];
        forEach(processor.process(), function(i){
          nprocess.push(i);
        });
        nprocess.push(p);
        nbus = new DataBus(nprocess);
        nbus.host(this.host());
        nbus.parent = this;
        this.children.push(nbus);
        return nbus;  
      }
    };

    this.fire = function(data, context){
      var self = this;
      
      data = is.exist(data) ? setup(data) : setup({}); //setting up data

      this._.fires.push(data); // pushing fired data to @fires queue

      processor.start(data, context, function(result){
        self._.takes.push(result); // pushing taked data to @takes queue 

        /* Executing all handlers of this DataBus */
        forEach(self.handlers, function(handler){
          handler.apply(context, [result]);
        });

      });
    }
  }


  /* 
    Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus 

    This function don't create new DataBus object it just puts to the current data bus 
    object's handlers list new handler and push it's to the executable drive of hoster stream 
  */
  DataBus.prototype.listen = function(x){
    this.handlers.push(is.fn(x) ? x : function(){console.log(x)});
    if(this.handlers.length<=1){
      this.host().push(this);
    }
    return this;
  };


  /*
    Unbinds handler with name @x (if @x is string) or @x handler (if @x is function) 
    If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
  */
  DataBus.prototype.mute = function(x){
    x = is.fn(fn) ? x.name : x;
    
    forEach(this.handlers, function(handler, index){
      if(handler.name == x){
         this.handlers = this.handlers.slice(0,index).concat(this.handlers.slice(index+1,this.handlers.length));
      }
    });
    return this;
  };

  /* Logging recieved data to console or logger */
  DataBus.prototype.log = function(x){
    var logger = is.exist(x) ? x : console.log;
    return this.listen(function(data){
      return logger(data);
    });
  };

  /* 
    Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
  */
  DataBus.prototype.filter = function(x) {
    Analyze('filter', x);
    return this.process(function(e, drive){
      return x.apply(this, [e]) === true ? drive.$continue(e) : drive.$break();
    });
  };

  /* 
    Mapping recieved data and transmit mapped to the next processor 
    If @x is string:
      and data[x] exists : result = data[x],
      and data[x] doesn't exist: result = x
    else @x is function:
      anyway: result = x(data)
    else @x is array:
      (recurently with each index of array)
    else @x is object:
      (recurently with each property of array with name data[x] : x)
    else
      reulst = x
  */
  DataBus.prototype.map = function(x) {
    var fn, ctype = typeof x, res;
    switch(ctype){
      case 'function':
        fn = function(e, drive){
          return drive.$continue(x.call(this, e));
        }
      break;
      case 'string':
        fn = function(e, drive){
          var t = e[x], 
              r = is.exist(t) ? t : x;
          return drive.$continue(r);
        }
      break;
      case 'object':
        if(is.array(x)){
          fn = function(e, drive){
            var res = [];
            forEach(x, function(i){
              var t = e[i];
              res.push(is.exist(t) ? t : i);
            }); 
            return drive.$continue(res);
          }
        }else{
          fn = function(e, drive){
            var res = {}, t;
            for(var prop in x){
              t = e[x[prop]];
              res[prop] = is.exist(t) ? t : x[prop];
            }
            return drive.$continue(res);
          }
        }
      break;
      default:
        fn = function(e, drive){
          return drive.$continue(x);
        }
      break;
    }
    return this.process(fn);
  };

  /* 
    Appying @fn function ot the previos and current value of recieved data 
    If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
  */
  DataBus.prototype.reduce = function(init, fn){
    Analyze('reduce', fn);
    return this.process(function(event, drive){
      var bus = drive.$host(),
          prev = init,
          cur = event;

      if(bus._.takes.length >= 1 || init == 'first' || init == '-f'){
        prev = bus._.takes[bus._.takes.length-1];
      }
      return drive.$continue(fn(prev, cur));
    });   
  };

  /* 
    Take only @x count or (if @x is function) works like .filter()
  */
  DataBus.prototype.take = function(x){
    Analyze('take', x);
    if(is.fn(x)){
      return this.filter(x);
    }else{
      return this.process(function(e, drive){
        var bus = drive.$host();
        bus._.limit = bus._.limit || x;
        if(bus._.takes.length === bus._.limit){
          return drive.$break();
        }else{
          return drive.$continue(e);
        }
      });
    }
  };

  /*
    Skips data @c times
  */
  DataBus.prototype.skip = function(c) {
    Analyze('skip', c);
    return this.process(function(e, drive){
      var bus = drive.$host();
      if(bus._.fires.length <= c){
        drive.$break();
      }else{
        return drive.$continue(e);
      }
    });  
  };

  DataBus.prototype.interpolate = function(s){
    Analyze('interpolate', s);
    return this.process(function(event, drive){
      var regex = /{{\s*[\w\.]+\s*}}/g;
      return drive.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
    })
  };

  DataBus.prototype.mask = function(o){
    Analyze('mask', o);
    return this.process(function(event, drive){
      var regex = /{{\s*[\w\.]+\s*}}/g;
      return drive.$continue(event.replace(regex, function(i){
        return o[i.slice(2,-2)];
      }));
    });
  };

  DataBus.prototype.unique = function(){
    return this.process(function(event, drive){
      var fires = drive.$host()._.fires;
      var takes = drive.$host()._.takes;
      if( (fires.length > 1 || takes.length > 0) && (event == fires[fires.length-2] || event == takes[takes.length-1])){      
        return drive.$break();
      }else{
        return drive.$continue(event);
      }  
    });
  };

  DataBus.prototype.debounce = function(t) {
    Analyze('debounce', t)
    return this.process(function(e, drive){
      var self = this, bus = drive.$host();
      clearTimeout(bus._.dbtimer);
      bus._.dbtimer = setTimeout(function(){
        delete bus._.dbtimer;
        drive.$unlock();
        drive.$continue(e);
      }, t);      
      drive.$lock();
    });
  };

  /* 
    Collecting events for @t miliseconds and after it transmitting an array of them 
  */
  DataBus.prototype.getCollected = function(t){
    Analyze('getCollected', t);
    return this.process(function(e, drive){
      var self = this, 
          bus = drive.$host(),
          fired = bus._.fires.length-1;
      bus._.tmpCollection = bus._.tmpCollection || [];
      bus._.tmpCollection.push(e);
      if(!bus._.timer){
        bus._.timer = setTimeout(function(){
          var collection = bus._.tmpCollection;

          clearTimeout(bus._.timer);
          delete bus._.timer;
          delete bus._.tmpCollection
          
          drive.$unlock();
          drive.$continue(collection);
        }, t);
        drive.$lock();
      }else{
        drive.$lock();
      }
    });
  };

  DataBus.prototype.after = function(bus, flush){
    var busExecuted = false;
    bus.listen(function(){
      busExecuted = true;
    });
    return this.process(function(event, drive){
      if(busExecuted){
        busExecuted = flush === true ? false : true;
        drive.$unlock();
        drive.$continue(event);
      }else{
        drive.$lock();
      }
    });
  };

  DataBus.prototype.waitFor = function(bus){
    var self = this;
    return Warden.makeStream(function(emit){
      var exec = false, val,         
          clear = function(){
            val = null; 
            exec = false;
          };

      bus.listen(function(data){
        if(exec){
          emit(val);
          clear();
        }
      });

      self.listen(function(data){
        val = data;
        exec = true;
      });

    }).get();
  };


  DataBus.prototype.merge = function(bus){
    var self = this;
    return Warden.makeStream(function(emit){
      bus.listen(emit);
      self.listen(emit);
    }).get();
  };


  DataBus.prototype.produceWith = function(bus, fn) {
    var self = this; 
    return Warden.makeStream(function(emit){
      self.sync(bus).listen(function(data){
        var d1 = data[0], d2 = data[1];
        emit(fn(d1, d2));
      });
    }).get();
  };

  DataBus.prototype.combine = function(bus, fn){
    var self = this;
    var a, b;
    bus.listen(function(event){
      b = event;
    });
    this.listen(function(event){
      a = event;
    })

    return Warden.makeStream(function(emit){
      self.listen(function(data){
        emit(fn(a,b));
      });
      bus.listen(function(data){
        emit(fn(a,b));
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
  };

  DataBus.prototype.lockChildren = function() {
    this.host().popAllDown(this);
  };

  DataBus.prototype.lockParent = function() {
    this.host().popAllUp(this);
  };

  DataBus.prototype.unlock = function(){
    this.host().push(this);
  };

  DataBus.prototype.bindTo = function(a,b){
    Warden.watcher(this, a, b);
  };

  return DataBus;
})();

