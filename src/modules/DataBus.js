/*
  DataBus module.
  Version: v1.0.0
  Implements data processing through stream. 

  -- v1.0.0 --
    - Incapsulated properties of data bus [fire, process, binding, host, setup] 
      and all these properties now configures from prototype's methods
  ------------ 09.09.2014
*/

var DataBus = (function(){
  var forEach = Utils.forEach, is = Utils.is;
  var _private = (function(){
    var collection = {};
    return function (id, param, value){
      if(is.exist(value)){
        if(is.fn(value)){
          collection[id][param] = value(collection[id][param]);  
        }else{
          collection[id][param] = value;
        }         
      }else{
        if(collection[id] && is.exist(collection[id][param])){
          return collection[id][param]
        }else{
          collection[id] = param;
          return collection[id];
        }
      }
      return collection[id][param];
    }
  })();

  
  function inheritFrom(child, parent){
    child.parent = parent;
    parent.children.push(child);
  }

  function process(p){
    var nprocess, nbus, processor = _private(this.$$id, 'processor');
    if(!p){
      return processor;
    }
     /* Copying process */
    nprocess = [];
    forEach(processor.process(), function(i){
      nprocess.push(i);
    });
    nprocess.push(p);
    nbus = new DataBus(nprocess);
    nbus.host(this.host());
    inheritFrom(nbus, this);
    return nbus;  
  }

  /* **************************************************** */
  /* DATABUS CONSTRUCTOR AND PROTOTYPE ****************** */
  /* **************************************************** */

  function DataBus(proc){
    var self = this,
        binding = null;

    this.$$id = Utils.$hash.set('d');

    var priv = _private(this.$$id, {
      processor : new Processor(proc || [], self),
      host : 0,
      binding : null,
      handlers : [],
      setup : function(x){ return x}
    });

    this.parent = null;
    this.children = [];
    this._ = {  
      fires : new Utils.Queue(),
      takes : new Utils.Queue()
    };
    
    this.bindTo = function(a,b,c) {
      var bus = this;
      if(!binding){
        binding = Warden.watcher(bus, a, b, c);
      }
      return binding;
    };

    this.update = function(e) {
      binding && binding.update(e || this._.takes[this._.takes.length-1]);
    };
  }

  DataBus.prototype.fire = function(data, context) {
    var id = this.$$id,
        self = this,
        handlers = _private(id, 'handlers'),
        processor = _private(id, 'processor');

    data = _private(id, 'setup')(is.exist(data) ? data : {}); //setting up data

    this._.fires.push(data); // pushing fired data to @fires queue

    processor.start(data, context, function(result){
      self._.takes.push(result); // pushing taked data to @takes queue 
      self.update(result);

      /* Executing all handlers of this DataBus */
      forEach(handlers, function(handler){
        handler.apply(context, [result]);
      });

    });
  };

  
  DataBus.prototype.setup = function(fn) {
    Analyze('setup', fn);
    _private(this.$$id, 'setup', function(setup){
      return fn
    });
  };  

  DataBus.prototype.host = function(host) {
    return host ? _private(this.$$id, 'host', host) : _private(this.$$id, 'host');
  };

  /* 
    Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus 

    This function don't create new DataBus object it just puts to the current data bus 
    object's handlers list new handler and push it's to the executable drive of hoster stream 
  */
  DataBus.prototype.listen = function(x){
    var self = this;
    _private(this.$$id, 'handlers' , function(handlers){
      handlers.push(is.fn(x) ? x : function(){console.log(x)});
      if(handlers.length<=1){
        self.host().push(self);
      }
      return handlers;
    });
    return this;
  };


  /*
    Unbinds handler with name @x (if @x is string) or @x handler (if @x is function) 
    If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
  */
  DataBus.prototype.mute = function(x){
    x = is.fn(fn) ? x.name : x;
    
    forEach(_private(this.$$id, 'handlers'), function(handler, index){
      if(handler.name == x){
         _private(this.$$id, 'handlers', function(handlers){
            return handlers.slice(0,index).concat(handlers.slice(index+1,handlers.length));
          });
      }
    });
    return this;
  };

  /* Logging recieved data to console or logger */
  DataBus.prototype.log = function(){
    return this.listen(function(data){
      return console.log(data);
    });
  };

  /* 
    Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
  */
  DataBus.prototype.filter = function(x) {
    Analyze('filter', x);
    return process.call(this, function(e, drive){
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
    return process.call(this, fn);
  };

  /* 
    Appying @fn function ot the previos and current value of recieved data 
    If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
  */
  DataBus.prototype.reduce = function(init, fn){
    Analyze('reduce', fn, arguments.length);
    return process.call(this, function(event, drive){
      var bus = drive.$host(),
          prev = init,
          cur = event;

      if(bus._.takes.length >= 1 || init == 'first' || init == '-f'){
        prev = bus._.takes[bus._.takes.length-1];
      }
      return drive.$continue(fn.call(this, prev, cur));
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
      return process.call(this, function(e, drive){
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
    Skips data [Integer] @c times
  */
  DataBus.prototype.skip = function(c) {
    Analyze('skip', c);
    return process.call(this, function(e, drive){
      var bus = drive.$host();
      if(bus._.fires.length <= c){
        drive.$break();
      }else{
        return drive.$continue(e);
      }
    });  
  };

  /*
    Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
  */
  DataBus.prototype.interpolate = function(s, reg){
    Analyze('interpolate', s);
    return process.call(this, function(event, drive){
      var regex = reg || /{{\s*[\w\.]+\s*}}/g;
      return drive.$continue(s.replace(regex, function(i){return event[i.slice(2,-2)]}));
    })
  };

  /*
    Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
  */
  DataBus.prototype.mask = function(o, reg){
    Analyze('mask', o);
    return process.call(this, function(event, drive){
      var regex = reg || /{{\s*[\w\.]+\s*}}/g;
      return drive.$continue(event.replace(regex, function(i){
        return o[i.slice(2,-2)];
      }));
    });
  };

  /* 
    Transfers only unique datas through bus. 
    [Function] @cmp - is comparing method that returns 
    [Boolean] 'true' if first argument of @cmp is equals to second argument

    By default: @cmp compares arguments with === operator
  */
  DataBus.prototype.unique = function(cmp){
    cmp = is.fn(cmp) ? cmp : function(a,b){
      return a===b;    
    }
    return process.call(this, function(event, drive){
      var fires = drive.$host()._.fires;
      var takes = drive.$host()._.takes;
      if( (fires.length > 1 || takes.length > 0) && (cmp(event, fires[fires.length-2]) || cmp(event, takes[takes.length-1])) ){      
        return drive.$break();
      }else{
        return drive.$continue(event);
      }  
    });
  };

  /*
    Debounce data bus on [Integer] @t miliseconds
  */
  DataBus.prototype.debounce = function(t) {
    Analyze('debounce', t)
    return process.call(this, function(e, drive){
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
    Collecting events for [Integer] @t miliseconds and after it transmitting an array of them 
  */
  DataBus.prototype.getCollected = function(t){
    Analyze('getCollected', t);
    return process.call(this, function(e, drive){
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
    return process.call(this, function(event, drive){
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

  /* 
    Merges with @bus 
  */
  DataBus.prototype.merge = function(bus){
    var self = this,
    nbus = Warden.makeStream(function(emit){
      bus.listen(emit);
      self.listen(emit);
    }).get();
    
    return nbus;
  };


  DataBus.prototype.resolveWith = function(bus, fn) {
    var self = this, ctx = this.host().$$context;
    return Warden.makeStream(function(emit){
      self.sync(bus).listen(function(data){
        var d1 = data[0], d2 = data[1];
        emit(fn.call(ctx, d1, d2));
      });
    }, ctx).get();
  };

  DataBus.prototype.combine = function(bus, fn, ctx){
    var self = this, ctx = ctx || this.host().$$context, a, b;
    bus.listen(function(event){b = event;});
    this.listen(function(event){a = event;});

    return Warden.makeStream(function(emit){
      function e(x){emit(fn.call(ctx, a,b));}
      self.listen(e);
      bus.listen(e);
    }, ctx).get();
  };

  /* Synchronizes two buses */

  DataBus.prototype.sync = function(bus){
    var self = this,
    bus = Warden.makeStream(function(emit){
      var exec1 = false, exec2 = false, val1, val2,
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
    inheritFrom(bus, this);
    return bus;
  };

  
  
  /*
    Locking evaluation of current bus
  */
  DataBus.prototype.lock = function(){
    this.host().pop(this);
  };

  /*
    Locking evaluation of current bus and all of his children buses
  */
  DataBus.prototype.lockChildren = function() {
    this.host().popAllDown(this);
  };

  /*
    Locking evaluation of current bus' parent
  */
  DataBus.prototype.lockParent = function() {
    this.host().popAllUp(this);
  };

  /* Unlocks current bus */
  DataBus.prototype.unlock = function(){
    this.host().push(this);
  };

  Warden.configure.addToDatabus = function(fn, name, argc, toAnalyze){
    name = name || fn.name;
    DataBus.prototype[name] = function() {
      var self = this, 
          argv = arguments;
      Analyze(name, arguments[toAnalyze || 0]);
      if(argc && argc!=arguments.length){
        throw "Unexpected arguments count";
      }
      return process.call(this,fn(arguments))
    };
  }

  return DataBus;
})();
