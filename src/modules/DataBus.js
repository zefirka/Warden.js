var DataBus = (function(){
  var handlers = {},
      pipes = {};

  function inheritFrom(child, parent){
    child.parent = parent;
    parent.children.push(child);
    return child;
  }

  /* Clones databus */
  function process(p){
    var pipe = pipes[this.$$id],
        newPipe = [],
        nbus;       

    // if(!p){
    //   return pipe;
    // }
    
    each(pipe.pipe(), function(i){
      newPipe.push(i);
    });
    newPipe.push(p);

    nbus = new DataBus(newPipe);
    nbus.host = this.host;
    return inheritFrom(nbus, this);
  }

  function DataBus(line){
    this.$$id = Utils.$hash.set('d')
    this.parent = null;
    this.children = [];
    handlers[this.$$id] = [];
    pipes[this.$$id] = Pipeline(line || [], this);

    this.data = {
      fires : new Utils.Queue(3),
      takes : new Utils.Queue(3),
      last : null
    };   

  }

  Utils.extend(DataBus.prototype, {
    bindTo : function() {
      var binding = Warden.Watcher.apply(null, [this].concat(toArray(arguments)));
      this.bindings.push(binding);
      return binding;
    },

    fire : function(data, context) {
      if(this.locked){
        return;
      }

      var id = this.$$id, self = this;

      this.data.fires.push(data); // pushing fired data to @fires queue

      pipes[id].start(data, context, function(result){
        self.data.takes.push(result); // pushing taked data to @takes queue

        /* Executing all handlers of this DataBus */
        each(handlers[id], function(handler){
          handler.call(context, result);
        });

      });
    },

    /*
      Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current DataBus

      This function don't create new DataBus object it just puts to the current data bus
      object's handlers list new handler and push it's to the executable pipe of hoster stream
    */
    listen : function(x){
      var self = this,
          handlersList = handlers[this.$$id];

      handlersList.push(x);
      
      if(handlersList.length<=1){
        self.host.push(self);
      }
      return this;
    },

    watch : function(){    
      this.host.push(this);
      return this;
    },
      
    /*
      Unbinds handler with name @x (if @x is string) or @x handler (if @x is function)
      If in the handlers list 2 or more handlers with name @x (or @x handlers registered twice) it will remove all handlers
    */
    mute : function(x){
      var self = this;
      Utils.forWhile(handlers[this.$$id], function(handler, index){
        if(is.fn(x) ? (handler == x) : handler.name == x){
          handlers[self.$$id].splice(index, 1);
          return false;
        }
      }, false);

      return this;
    },

    clear : function(){
      handlers[this.$$id] = [];
    },

    /* Logging recieved data to console or logger */
    log : function(x){
      return this.listen(function log(data){
        console.log(x || data);
      });
    },

    /*
      Filtering recieved data and preventing transmitting through DataBus if @x(event) is false
    */
    filter : function(x) {
      if(is.fn(x)){
        return process.call(this, function(e, pipe){
          return x.call(this, e) === true ? pipe.next(e) : pipe.stop();
        });
      }else{
        return process.call(this, function(e, pipe){
          return Warden.configure.cmp(x, e) === true ? pipe.next(e) : pipe.stop();
        });
      }
    },

    /*
      Mapping recieved data and transmit mapped to the next processor
    */
    map : function(x) {
      function parseEval(string){
        var res = "";

        if(string.indexOf('@')>=0){
          if(string=='@'){
            res += 'this'
          }else{
            res += string.replace('@', 'this.');
          }
        }else
        if(string.indexOf('.')>=0){
          if(string=='.'){
            res += 'event'
          }else{
            res += string.replace('.', 'event.');
          }
        }else{
          res += "'" + string + "'";
        }
        if(res.match(/\(.+\)/)){
          res = res.replace(/\(.+\)/, function(args){
            return "(" + eval(args.slice(1,-1)) + ")"
          })
        }

        return res;
      }

      function map(i, event){
        if(is.fn(i)){
          return i.call(this, event);
        }else
        if(is.str(i)){
          return eval(parseEval(i))
        }else{
          return i;
        }
      }

      var fn = function(eev, pipes){
        return pipes.next(x);
      }


      if(typeof x == "object"){
          if(is.array(x)){
            fn = function(e, pipe){
              var res = [], self = this;
              each(x, function(i){
                res.push(map.call(self, i, e));
              });
              return pipe.next(res);
            }
          }else{
            fn = function(e, pipe){
              var res = {};
              for(var prop in x){
                res[prop] = map.call(this, x[prop],e)
              }
              return pipe.next(res);
            }
          }
      }else{
        fn = function(event, pipe){
          return pipe.next(map.call(this, x, event));
        }
      }

      return process.call(this, fn);
    },

    /* Takes nth element of event */
    nth : function(n) {
      return process.call(this, function(e, pipe){
        return pipe.next(e[n+1]);
      });
    },

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
    get : function(s) {
      return process.call(this, function(data, pipe){
        return pipe.next(Utils.getObject(data, s));
      });
    },

    /*
      Appying @fn function ot the previos and current value of recieved data
      If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
    */
    reduce : function(init, fn){
      return process.call(this, function(event, pipe){
        var bus = pipe.bus();
        return (bus.data.takes.length == 0 && !is.exist(init)) ?  pipe.next(event) : pipe.next((fn || init).call(this, bus.data.takes.last() || (fn ? init : null), event)) ;
      });
    },

    /*
      Take only @x count or (if @x is function) works like .filter()
    */
    take : function(x){
      return process.call(this, function(e, pipe){
        var bus = pipe.bus();
        bus.data.limit = bus.data.limit || x;
        bus.data.taken = (bus.data.taken + 1) || 0;
        return bus.data.taken >= bus.data.limit ? pipe.stop() : pipe.next(e);
      });
    },


    /*
      Skips data [Integer] @c times
    */
    skip : function(c) {
      return process.call(this, function(e, pipe){
        return pipe.bus().data.fires.length > c ? pipe.next(e) : pipe.stop();
      });
    },

    /*
      Interpolates to the [String] @s data from bus (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    interpolate : function(s){
      return process.call(this, function(event, pipe){
        return pipe.next(Utils.interpolate(s, event))
      })
    },

    /*
      Masking data from bus with [Object] @o (all matches of [RegExp] @reg or {{match}}-style regex)
    */
    mask : function(o){
      return process.call(this, function(event, pipe){
        return pipe.next(is.str(event) ? Utils.interpolate(event, o) : event);
      });
    },

    /*
      Transfers only unique datas through bus.
      [Function] @cmp - is comparing method that returns
      [Boolean] 'true' if first argument of @cmp is equals to second argument

      By default: @cmp compares arguments with === operator
    */
    diff : function(compractor){
      compractor = compractor || Warden.configure.cmp;

      return process.call(this, function(event, pipe){
        var data = pipe.bus().data, fires = data.fires, takes = data.takes,
            cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
          return cons ? pipe.stop() : pipe.next(event);
      });
    },

    /*
      Debounce data bus on [Integer] @t miliseconds
    */
    debounce : function(t) {
      return process.call(this, function(e, pipe){
        var self = this, bus = pipe.bus();
        clearTimeout(bus.data.dbtimer);
        bus.data.dbtimer = setTimeout(function(){
          delete bus.data.dbtimer;
          pipe.play();
          pipe.next(e);
        }, t);
        pipe.pause();
      });
    },

    /*
      Collecting events for [Integer] @t miliseconds and after it transmitting an array of them
    */
    collect : function(t){
      return process.call(this, function(e, pipe){
        var self = this,
            bus = pipe.bus(),
            fired = bus.data.fires.length-1;
        bus.data.tmpCollection = bus.data.tmpCollection || [];
        bus.data.tmpCollection.push(e);
        if(!bus.data.timer){
          bus.data.timer = setTimeout(function(){
            var collection = bus.data.tmpCollection;

            clearTimeout(bus.data.timer);
            delete bus.data.timer;
            delete bus.data.tmpCollection

            pipe.play();
            pipe.next(collection);
          }, t);
          pipe.pause();
        }else{
          pipe.pause();
        }
      });
    },

    filterFor : function(fn) {
      var data = null;
      return process.call(this, function(e, pipe){
        var pipes = {
          get : function(fn){
            return fn ? fn(data) : data;
          },
          next: function(e){
            data = e;
            pipe.next(e);
          },

          stop: function(e){
            pipe.stop();
          }
        }
        return fn(e, pipes);
      });
    },

    collectFor : function(bus){
      var collection = [];

      this.listen(function(e){
        collection.push(e);
      });

      return Warden.Stream(function(emit){
        bus.listen(function(){
          emit(collection);
          collection = [];
        })
      });
    },
                                                                                                                        
    delay : function(time) {
      return process.call(this, function(e, pipe){
        setTimeout(function(){
          pipe.next(e)
        }, time);
      });
    },

    toggle : function(a,b) {
      var toggled = false;
      
      return this.listen(function(data){
        if(toggled){
          b.call(this, data);
        }else{
          a.call(this, data);
        }
        toggled = !toggled;
      });
    },

    after : function(bus, flush){
      var busExecuted = false;

      bus.listen(function(){
        busExecuted = true;
      });

      return process.call(this, function(event, pipe){
        if(busExecuted){
          busExecuted = flush === true ? false : true;
          pipe.play();
          pipe.next(event);
        }else{
          pipe.pause();
        }
      });
    },

    repeat : function(times, delay){
      var self = this,
          cached = times;

      return inheritFrom(Warden.Stream(function(emit){
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
      }), this);
    },

    waitFor : function(bus){
      var self = this;
      return Warden.Stream(function(emit){
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
    },

    /*
      Usage: bus.merge(bus1, [bus2] ... [busN])
      Merges @bus with buses from arguments
    */
    merge : function(){
      var host = Warden.Host(this.host.$$context),
          argv = Utils.toArray(arguments);
          argv.push(this);

      each(argv, function(bus){
        bus.listen(function(data){
          host.eval(data);
        });
      });      

      return inheritFrom(host.newBus(), this);
    },

    commuteSwitch : function(bus){
      var self = this,
          queue = 0; // 0 - this, 1 - bus

      return Warden.Stream(function(fire){
        self.listen(function(e){
          if(queue==0){
            fire(e)
            queue = 1;
          }
        });
        bus.listen(function(e){
          if(queue==1){
            fire(e);
            queue = 0;
          }
        });
      })

    },

    resolveWith : function(bus, fn, ctx) {
      var self = this,
          ctx = ctx || this.host.$$context
      return Warden.Stream(function(emit){
        self.sync(bus).listen(function(data){
          emit(fn.call(ctx, data[0], data[1]));
        });
      }, ctx);
    },

    /* Combines two bises with given function @fn*/
    combine : function(bus, fn, seed){
      var self = this, ctx = this.host.$$context;

      return Warden.Stream(function(emit){
        function e(a,b){
          emit(fn.call(ctx, a,b));
        }

        self.listen(function(data){
          e(data, bus.data.takes.last() || seed);
        });
        bus.listen(function(data){
          e(self.data.takes.last() || seed, data);
        });

      }, ctx).bus();
    },

    /* Synchronizes  buses */
    sync : function(){
      var self = this,
          argv = Utils.toArray(arguments),
          values = [],
          executions = [],
          nbus;

      argv.unshift(this);

      values.length = executions.length = argv.length;

      nbus = Warden.Stream(function(emit){
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
      });
      
      return inheritFrom(nbus, this);
    },

    bus: function(){
      var bus = new DataBus();
      bus.host = this.host;
      return bus;
    },
    
    swap : function(state){
      var self = this;

      function swap(e, val){
        e.locked = !val;
        each(e.children, swap);
      }

      swap(this, state);      
    },
    
    toggleOn: function(bus, state){
      if(bus instanceof DataBus){
        bus.listen(function(){
          bus.swap(state);
        });
      }
    },

    /* Lock/unlock methods */
    lock : function(bus){
      this.swap(false);
      if(bus){
        this.toggleOn(bus, false);
      }
      return this;
    },

    lockThis : function() {
      this.locked = true;
      return this;
    },

    unlockThis : function(){
      this.locked = false;
      return this;
    },

    unlock : function(bus){
      this.swap(true);
      if(bus){
        this.toggleOn(bus, true);
      }
      return this;
    }
  })

  Warden.configure.addToDatabus = function(name, fn){
    DataBus.prototype[name] = function() {
      var self = this,
          argv = arguments;
      return process.call(this,fn(arguments))
    };
  }

  return DataBus;
})();