/*
  DataBus module.
  Version: v2.0.0
  Implements data processing through stream.

  -- v2.0.0 --
    Changed .merge[buses]
    Changed .sync(buses)
    Сhanged .map(str)

  -- v1.1.1 --
    Added method .equals which
    Optimized fire, get, reduce, include, skip, unique
    Removed logging strings via .listen([string]) method, now it possible to log string via .log([string]) method

  -- v1.1.0 --
    Added .delay and .repeat methods.
    Changed incapsulation method to more efficient

  -- v1.0.3 --
    Added comments

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
  var each = Utils.each,
      is = Utils.is,
      toArray = Utils.toArray,
      handlers = {},
      pipe = {};

  function inheritFrom(child, parent){
    child.parent = parent;
    parent.children.push(child);
  }

  function process(p){
    var nprocess, nbus, processor = pipe[this.$$id];

    if(!p){
      return processor;
    }
     /* Copying process */
     /* TODO: Optimize copying */

    nprocess = [];
    each(processor.process(), function(i){
      nprocess.push(i);
    });
    nprocess.push(p);

    nbus = new DataBus(nprocess);
    nbus.host = this.host;
    inheritFrom(nbus, this);
    return nbus;
  }

  /* **************************************************** */
  /* DATABUS CONSTRUCTOR AND PROTOTYPE ****************** */
  /* **************************************************** */

  function DataBus(proc){
    this.$$id = Utils.$hash.set('d')
    this.parent = null;
    this.children = [];
    this.bindings = [];
    handlers[this.$$id] = [];
    pipe[this.$$id] = new Processor(proc || [], this);

    this.data = {
      fires : new Utils.Queue(),
      takes : new Utils.Queue(),
      last : null
    };   

  }

  DataBus.prototype.bindTo = function(a,b,c) {
    var binding = Warden.watcher(this, a, b, c);
    this.bindings.push(binding);
    return binding;
  };

  DataBus.prototype.update = function(e){
    var self = this;
    each(this.bindings, function(binding){
      binding.update(e || self.data.takes.last());
    });
  };

  DataBus.prototype.fire = function(data, context) {
    var id = this.$$id, self = this;

    this.data.fires.push(data); // pushing fired data to @fires queue

    pipe[id].start(data, context, function(result){
      self.data.takes.push(result); // pushing taked data to @takes queue
      self.update(self.data.last = result);

      /* Executing all handlers of this DataBus */
      each(handlers[id], function(handler){
        handler.call(context, result);
      });

    });
  };


  /*
    Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus

    This function don't create new DataBus object it just puts to the current data bus
    object's handlers list new handler and push it's to the executable drive of hoster stream
  */
  DataBus.prototype.listen = function(x){
    var self = this,
        handlersList = handlers[this.$$id];

    handlersList.push(x);
    
    if(handlersList.length<=1){
      self.host.push(self);
    }
    return this;
  };

  /*
    Unbinds handler with name @x (if @x is string) or @x handler (if @x is function)
    If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
  */
  DataBus.prototype.mute = function(x){
    x = is.fn(x) ? x.name : x;

    Utils.forWhile(handlers[this.$$id], function(handler, index){
      if(handler.name == x){
        handlers[this.$$id].splice(index, 1);
        return false;
      }
    }, false);

    return this;
  };

  /* Logging recieved data to console or logger */
  DataBus.prototype.log = function(x){
    return this.listen(function(data){
      console.log(x || data);
    });
  };

  /*
    Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
  */
  DataBus.prototype.filter = function(x) {
    Analyze('filter', x);
    return process.call(this, function(e, drive){
      return x.call(this, e) === true ? drive.$continue(e) : drive.$break();
    });
  };

  /*
    Mapping recieved data and transmit mapped to the next processor
  */
  DataBus.prototype.map = function(x) {
    var fn, simple = function(e, pipe){
          return pipe.$continue(x);
        }

    switch(typeof x){
      case "function":
        fn = function(e, drive){
          return drive.$continue(x.call(this, e));
        }
      break;
      case "string":
        if(x.indexOf('/')>=0){
          return this.get(x);
        }

        if(x[0]=='.'){
          fn = function(e, drive){
            var t = x.indexOf("()") > 0 ?  e[x.slice(1,-2)] : e[x.slice(1)],
            r = is.exist(t) ? t : x,
            res = r;

            if(is.fn(r) && x.indexOf("()")>0){
              res = r();
            }
            return drive.$continue(res);
          }
        }else
        if(x[0]=='@'){
          if(x.length==1){
            fn = function(e, pipe){
              pipe.$continue(this);
            }
          }else{
            fn = function(e, drive){
              var t = x.indexOf("()") > 0 ?  this[x.slice(1,-2)] : this[x.slice(1)],
              r = is.exist(t) ? t : x,
              res = r;

              if(is.fn(r) && x.indexOf("()")>0){
                res = r.call(this);
              }
              return drive.$continue(res);
            }
          }
        }else{
          fn = simple;
        }
      break;
      case "object":
        if(is.array(x)){
          fn = function(e, drive){
            var res = [];
            each(x, function(i){
              var t;
              res.push(is.str(i) ? (i[0]=='.' ? (is.exist(t=e[i.slice(1)]) ? t : i) : i) : i );
            });
            return drive.$continue(res);
          }
        }else{
          fn = function(e, drive){
            var res = {}, val, name;
            for(var prop in x){
              name = x[prop];

              if(name.indexOf('.')==0 && e[name.slice(1)]){
                val = e[name.slice(1)];
              }

              if(name.indexOf('@')==0 && (this[name.slice(1)] || this[name.slice(1,-2)])){
                if(name.indexOf('()')>0){
                  val = this[name.slice(1,-2)]()
                }else{
                  val = this[name.slice(1)]
                }
              }

              res[prop] = val;
            }
            return drive.$continue(res);
          }
        }
      break;
      default:
        fn = simple;
      break;
    }

    return process.call(this, fn);
  }

  /* Takes nth element of event */
  DataBus.prototype.nth = function(n) {
    Analyze('nth', n);
    return process.call(this, function(e, drive){
      return drive.$continue(e[n+1]);
    });
  }

  /*
    Takes element of event by given path:
      bus.get('propname/childpropname/arraypropname[2]/child') takes the child from:
      {
        propname: {
          childpropname: {
            arraypropname : [0, 1, {child: "THIS!"}]
          }
        }
      }
  */
  DataBus.prototype.get = function(s) {
    Analyze('get', s);
    return process.call(this, function(data, drive){
      return drive.$continue(Utils.getObject(data, s));
    });
  }

  /*
    Appying @fn function ot the previos and current value of recieved data
    If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
  */
  DataBus.prototype.reduce = function(init, fn){
    Analyze('reduce', (arguments.length==1 ? fn = init : fn));
    return process.call(this, function(event, drive){
      var bus = drive.$host();
      return (bus.data.takes.length == 0 && !is.exist(init)) ?  drive.$continue(event) : drive.$continue(fn.call(this, bus.data.takes.last() || init, event)) ;
    });
  };

  /*
    Take only @x count or (if @x is function) works like .filter()
  */
  DataBus.prototype.take = function(x){
    Analyze('take', x);

    return process.call(this, function(e, drive){
      var bus = drive.$host();
      bus.data.limit = bus.data.limit || x;
      return bus.data.takes.length === bus.data.limit ?  drive.$break() : drive.$continue(e);
    });
  }


  /*
    Skips data [Integer] @c times
  */
  DataBus.prototype.skip = function(c) {
    Analyze('skip', c);
    return process.call(this, function(e, drive){
      return drive.$host().data.fires.length > c ? drive.$continue(e) : drive.$break();
    });
  }

  /*
    Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
  */
  DataBus.prototype.interpolate = function(s, reg){
    Analyze('interpolate', s);
    return process.call(this, function(event, drive){
      return drive.$continue(Utils.interpolate(s, event))
    })
  }

  /*
    Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
  */
  DataBus.prototype.mask = function(o, reg){
    Analyze('mask', o);
    return process.call(this, function(event, drive){
      return drive.$continue(is.str(event) ? Utils.interpolate(event, o) : event);
    });
  }

  /*
    Transfers only unique datas through bus.
    [Function] @cmp - is comparing method that returns
    [Boolean] 'true' if first argument of @cmp is equals to second argument

    By default: @cmp compares arguments with === operator
  */
  DataBus.prototype.unique = function(compractor){
    Analyze('unique', compractor);

    compractor = compractor || Warden.configure.cmp;

    return process.call(this, function(event, drive){
      var data = drive.$host().data, fires = data.fires, takes = data.takes,
          cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
        return cons ? drive.$break() : drive.$continue(event);
    });
  };

  /*
    Debounce data bus on [Integer] @t miliseconds
  */
  DataBus.prototype.debounce = function(t) {
    Analyze('debounce', t)

    return process.call(this, function(e, drive){
      var self = this, bus = drive.$host();
      clearTimeout(bus.data.dbtimer);
      bus.data.dbtimer = setTimeout(function(){
        delete bus.data.dbtimer;
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
          fired = bus.data.fires.length-1;
      bus.data.tmpCollection = bus.data.tmpCollection || [];
      bus.data.tmpCollection.push(e);
      if(!bus.data.timer){
        bus.data.timer = setTimeout(function(){
          var collection = bus.data.tmpCollection;

          clearTimeout(bus.data.timer);
          delete bus.data.timer;
          delete bus.data.tmpCollection

          drive.$unlock();
          drive.$continue(collection);
        }, t);
        drive.$lock();
      }else{
        drive.$lock();
      }
    });
  };

  DataBus.prototype.filterFor = function(fn) {
    var data = null;
    return process.call(this, function(e, drive){
      var pipe = {
        get : function(fn){
          return fn ? fn(data) : data;
        },
        next: function(e){
          data = e;
          drive.$continue(e);
        },

        stop: function(e){
          drive.$break();
        }
      }
      return fn(e, pipe);
    });
  };

  DataBus.prototype.collectFor = function(bus){
    var collection = [];

    this.listen(function(e){
      collection.push(e);
    });

    return Warden.makeStream(function(emit){
      bus.listen(function(){
        emit(collection);
        collection = [];
      })
    }).bus();
  }

  DataBus.prototype.equals = function(x, cmp){
    cmp = cmp || Warden.configure.cmp;
    return this.filter(function(y){
      return cmp(x, y);
    });
  }

  DataBus.prototype.delay = function(time) {
    Analyze('delay', time);
    return process.call(this, function(e, drive){
      setTimeout(function(){
        drive.$continue(e)
      }, time);
    });
  };

  DataBus.prototype.toggle = function(a,b) {
    var toggled = false;
    
    return this.listen(function(data){
      if(toggled){
        a.call(this, data);
      }else{
        b.call(this, data);
      }
      toggled = !toggled;
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

  DataBus.prototype.repeat = function(times, delay){
    var self = this,
        cached = times,
    nbus = Warden.makeStream(function(emit){
      self.listen(function(data){
        var interval = setInterval(function(){
          if(times){
            emit(data);
            times--
          }else{
            times = cached;
            clearInterval(interval);
          }
        }, delay);
      });
    }).bus();
    inheritFrom(nbus, this);
    return nbus;
  }

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

    }).bus();
  };

  /*
    Usage: bus.merge(bus1, [bus2] ... [busN])
    Merges @bus with buses from arguments
  */
  DataBus.prototype.merge = function(){
    function merge(a, b, cnt){
      return Warden.makeStream(function(emit){
        a.listen(emit);
        b.listen(emit);
      }, cnt).bus();
    }

    var argv = Utils.toArray(arguments);
    argv.unshift(this);
    return Utils.reduce(argv, function(bus1, bus2){
      return merge(bus1, bus2, bus1.host.$$context);
    })
  };


  DataBus.prototype.resolveWith = function(bus, fn) {
    var self = this, ctx = this.host.$$context;
    return Warden.makeStream(function(emit){
      self.sync(bus).listen(function(data){
        emit(fn.call(ctx, data[0], data[1]));
      });
    }, ctx).bus();
  };

  /* Combines two bises with given function @fn in context @ctx */
  DataBus.prototype.combine = function(bus, fn, ctx){
    var self = this,
        ctx = ctx || this.host.$$context;

    return Warden.makeStream(function(emit){
      function e(a,b){
        emit(fn.call(ctx, a,b));
      }

      self.listen(function(data){
        e(data, bus.data.takes.last);
      });
      bus.listen(function(data){
        e(self.data.last, data);
      });

    }, ctx).bus();
  };

  /* Synchronizes  buses */
  DataBus.prototype.sync = function(){
    var self = this,
        argv = Utils.toArray(arguments),
        values = [],
        executions = [],
        nbus;

    argv.unshift(this);

    values.length = executions.length = argv.length;

    nbus = Warden.makeStream(function(emit){
      each(argv, function(bus, index){
        bus.listen(function(data){
          var exec = executions.length ? true : false;

          Utils.forWhile(executions, function(state, i){
            if(i == index){
              return true;
            }
            if(!state){
              exec = false;
            }
            return state;
          }, false);

          values[index] = data;

          if(exec){
            emit(values);
            values = [];
            executions = [];
            values.length = executions.length = argv.length;
          }else{
            executions[index] = true;
          }

        });
      });
    }).bus();
    inheritFrom(nbus, this);
    return nbus;
  };

  DataBus.prototype.syncFlat = function(){
    var self = this,
        argv = Utils.toArray(arguments),

    nbus = Warden.makeStream(function(emit){
      self.sync.apply(self, argv).listen(function(arr){
        emit.call(this, Utils.flatten(arr));
      })
    }).bus();
    inheritFrom(nbus, this);
    return nbus;
  };

  /* Lock/unlock methods */
  DataBus.prototype.lock = function(){
    this.host.pop(this);
  }

  DataBus.prototype.lockChildren = function() {
    this.host.popAllDown(this);
  }

  DataBus.prototype.lockParents = function() {
    this.host.popAllUp(this);
  }

  DataBus.prototype.unlock = function(){
    this.host.push(this);
  }

  DataBus.prototype.unlockChildren = function(){
    this.host.pushAllDown(this);
  }

  DataBus.prototype.unlockParents = function(){
    this.host.push(this);
    function unlock(bus){
      if(is.exist(bus.parent)){
        bus.host.push(bus.parent);
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
