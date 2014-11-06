/*
  DataBus module.
  Version: v1.0.2
  Implements data processing through stream. 

  -- v1.0.2 --
    Added DataBus.toggle method;
    Added Unique to Analyzator;
    Added DataBus.syncFlat method
    Little optimizations

  -- v1.0.1 --
    Fixed bindings array

  -- v1.0.0 --
    Incapsulated properties of data bus [fire, process, binding, host, setup] 
    and all these properties now configures from prototype's methods
*/

var DataBus = (function(){
  var each = Utils.each, is = Utils.is,
  _private = (function(){
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
    each(processor.process(), function(i){
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
        bindings = [];

    this.$$id = Utils.$hash.set('d');

    _private(this.$$id, {
      processor : new Processor(proc || [], self),
      host : 0,
      handlers : [],
      setup : function(x){ return x}
    });

    this.parent = null;
    this.children = [];
    this._ = {  
      fires : new Utils.Queue(),
      takes : new Utils.Queue(),
      last : null
    };
    
    this.bindTo = function(a,b,c) {
      var binding = Warden.watcher(this, a, b, c);
      bindings.push(binding);      
      return binding;
    };

    this.update = function(e) {
      bindings.length && each(bindings, function(binding){
        binding.update(e || self._.takes.last());
      });
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
      self._.last = result;
      self.update(result);

      /* Executing all handlers of this DataBus */
      each(handlers, function(handler){
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
    
    each(_private(this.$$id, 'handlers'), function(handler, index){
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
    var fn, es;
    if(is.fn(x)){
      fn = function(e, drive){
        return drive.$continue(x.call(this, e));
      }
    }else
    if(is.str(x)){      
      
      if(x.indexOf('/')>=0){
        return this.get(x);
      }

      fn = function(e, drive){
        var t = e[x], 
            r = is.exist(t) ? t : x;
        return drive.$continue(r);
      }
    }else
    if(is.array(x)){      
      fn = function(e, drive){
        var res = [];
        each(x, function(i){
          var t = e[i];
          res.push(is.exist(t) ? t : i);
        }); 
        return drive.$continue(res);
      }
    }else
    if(is.obj(x)){
      fn = function(e, drive){
        var res = {}, t;
        for(var prop in x){
          t = e[x[prop]];
          res[prop] = is.exist(t) ? t : x[prop];
        }
        return drive.$continue(res);
      }
    }else{
      fn = function(e, drive){
        return drive.$continue(x);
      }
    }
    return process.call(this, fn);
  };

  DataBus.prototype.nth = function(x) {
    Analyze('nth', x);
    process.call(this, function(e, drive){
      return drive.$continue(e[x]);
    });
  }

  DataBus.prototype.get = function(s) {
    Analyze('get', s);
    return process.call(this, function(data, drive){
      var current = data;
      each(s.split('/'), function(elem){
        var cand, last = elem.length-1;

        if(elem[0]=='[' && elem[last]==']'){
          cand = elem.slice(1,last);
          if(is.exist(cand)){
            if(is.num(parseInt(cand))){
              elem = parseInt(cand);
            }else{
              throw "Wrong syntax at DataBus.get() method";
            }
          }
        }else{
          if(!is.exist(current[elem])){
            throw "Can't find " + elem + " property";
          }
        }

        current=current[elem];

      });

      return drive.$continue(current);
    });
  }

  /* 
    Appying @fn function ot the previos and current value of recieved data 
    If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
  */
  DataBus.prototype.reduce = function(init, fn){
    if(arguments.length==1){
      fn = init;
      init = undefined;
    }
    Analyze('reduce', fn);
    return process.call(this, function(event, drive){
      var bus = drive.$host(), prev = init, cur = event;

      if(bus._.takes.length > 0){
        prev = bus._.takes.last();
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

  
  DataBus.prototype.include = function() {
    var argv = arguments, 
        argc = argv.length;

    return process.call(this, function(data, drive){
      var bus = drive.$host(), prop;
      for(var i=0, l=argc; i<l; i++){
        prop = argv[i];
        if(is.array(prop)){
          for(var j=0, k=prop.length;j<k;j++){
            if(is.exist(bus._[prop[j]])){
              data[prop[j]] = bus._[prop[j]]
            }
          }
        }else{
          if(is.exist(bus._[prop])){
            data[prop] = bus._[prop];
          }
        }
      }    
      return drive.$continue(data);
    });  
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
  DataBus.prototype.unique = function(compractor){
    Analyze('unique', compractor);

    compractor = is.fn(compractor) ? compractor : function(a,b){
      return a===b;
    }

    return process.call(this, function(event, drive){
      var fires = drive.$host()._.fires;
      var takes = drive.$host()._.takes;
      if( (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last())) ){      
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

  DataBus.prototype.toggle = function(a,b) {
    var self = this;
    this._.toggle = false;
    return process.call(this, function(e, drive){
      var fun = self._.toggle ? a : b;
      self._.toggle = !self._.toggle;
      return drive.$continue(fun.call(self, e));
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
    nbus = Warden.makeStream(function(emit){
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
    }).bus();
    inheritFrom(nbus, this);
    return nbus;
  };

  DataBus.prototype.syncFlat = function(bus){
    self = this,
    nbus = Warden.makeStream(function(emit){
      self.sync(bus).listen(function(arr){
        emit(Utils.flatten(arr));
      })
    }).bus();
    inheritFrom(nbus, this);
    return nbus;    
  };

  /* Lock/unlock methods */
  DataBus.prototype.lock = function(){
    this.host().pop(this);
  };

  DataBus.prototype.lockChildren = function() {
    this.host().popAllDown(this);
  };
  
  DataBus.prototype.lockParents = function() {
    this.host().popAllUp(this);
  };
  
  DataBus.prototype.unlock = function(){
    this.host().push(this);
  };

  DataBus.prototype.unlockChildren = function(){
    this.host().pushAllDown(this);
  }

  DataBus.prototype.unlockParents = function(){
    this.host().push(this);
    function unlock(bus){
      if(is.exist(bus.parent)){
        bus.host().push(bus.parent);
        unlock(bus.parent);
      }
    }
    unlock(this);
  }

  Warden.configure.addToDatabus = function(fn, name, argc, toAnalyze){
    name = name || fn.name;
    DataBus.prototype[name] = function() {
      var self = this, 
          argv = arguments;
      Analyze(name, arguments[toAnalyze || 0]);
      return process.call(this,fn(arguments))
    };
  }

  return DataBus;
})();