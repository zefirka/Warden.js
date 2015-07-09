var Stream = (function(){
  var handlers = {},
      pipes = {};

  function inheritFrom(child, parent){
    child.parent = parent;
    parent.children.push(child);
    return child;
  }

  /* Clones Stream */
  function process(p){
    var pipe = pipes[this.$$id],
        newPipe = pipe.pipe().slice();
    
    newPipe.push(p);

    return inheritFrom(new Stream(newPipe), this);
  }

  function Stream(line, context){
    var max = Warden.configure.history;

    this.$$id = Utils.$hash.set('d');
    this.$$context = context || {};
    this.$$obs = false;

    this.parent = null;
    this.children = [];

    handlers[this.$$id] = [];
    pipes[this.$$id] = Pipeline(line || [], this);

    this.data = {
      fires : new Utils.Queue(max),
      takes : new Utils.Queue(max),
      last : null
    };   
  }

  Stream.prototype = {
    valueOf : function(e){
      return this.data.last;
    },

    toString : function(e){
      return this.data.last.toString();
    },

    bindTo : function() {
      var binding = Warden.Watcher.apply(null, [this].concat(toArray(arguments)));
      return binding;
    },

    exec : function(data, context) {
      if(!this.$$obs){
        return;
      }

      var id = this.$$id, self = this;

      this.data.fires.push(data); // pushing fired data to @fires queue

      pipes[id].start(data, context, function(result){
        self.data.takes.push(result); // pushing taked data to @takes queue
        self.data.last = result;
        /* Executing all handlers of this Stream */
        each(handlers[id], function(handler){
          handler.call(context, result);
        });
      });
    },

    fire : function(data, context) {
      if(this.locked){
        return;
      }

      context = context || this.$$context;

      if(!this.$$obs){
        each(this.children, function(child){
          child.fire(data, context);
        })
        return;
      }

      this.exec(data, context);
      each(this.children, function(child){
        child.fire(data, context);
      });
    },

    /*
      Binds a handler @x (if @x is function) or function that logging @x to console (if @x is string) to the current Stream

      This function don't create new Stream object it just puts to the current data bus
      object's handlers list new handler and push it's to the executable pipe of hoster stream
    */
    listen : function(x){
      this.$$obs = true;
      handlers[this.$$id].push(x);      
      return this;
    },

    watch : function(){    
      this.$$obs = true;
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
        console.log(x ? x.replace(/\$/g, data) : data);
      });
    },

    /*
      Filtering recieved data and preventing transmitting through Stream if @x(event) is false
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
      return process.call(this, function(event, pipe){
        if(is.fn(x)){
          pipe.next(x.call(this, event));
        }else{
          pipe.next(x);
        }
      });
    },

    grep: function(mapper){
      // 
      function grep(str, event){
        if(str[0] == '.'){
          str = "$" + str;
        }

        var expression = str.replace(/\$/g, 'event').replace(/^@$/g, "this").replace(/^@/g, 'this.').replace(/@/g, 'this');

        if(str.match(/[\$\@\.]/g)){
          return eval(expression);
        }else{
          return expression;
        }
      }

      // functior of simple types
      function functor(x){
        if(!is.str(x)){
          return function(){
            return x;
          }
        }else
        if(is.fn(x)){
          return function(event){
            return x.call(ctx, event);
          }
        }else{
          return function(event){
            return grep.call(this, x, event);
          }
        }
      }

      function decide(expr){
        var res = null;

        if(is.array(expr)){
          res = map(expr, function(subExpr){
            return decide(subExpr);
          });
        }else
        if(is.obj(expr)){
          res = {};
          for(var i in expr){
            res[i] = decide(expr[i]);
          }
        }else{
          res = functor(expr);
        }

        return res;
      }

      function apply(event, getter, ctx){
        if(is.array(getter)){
          return getter.map(function(getF){
            return apply(event, getF, ctx);
          });
        }

        if(is.obj(getter)){
          var res = {};
          for(var prop in getter){
            res[prop] = apply(event, getter[prop], ctx)
          }
          return res;
        }

        return getter.call(ctx, event);
      }

      var getter = decide(mapper);

      return process.call(this, function(event, pipe){
        pipe.next(apply.call(this, event, getter, this));
      })

    },

    /*
      Appying @fn function ot the previos and current value of recieved data
      If previous value is empty, then it is init or first value (or when init == 'first' or '-f')
    */
    reduce : function(init, fn){
      var reduced = new Utils.Queue(1);
      return process.call(this, function(event, pipe){
        
        var bus = pipe.host(),
            res;
        if(reduced.length == 0){
          res = fn ? fn.call(this, init, event) : event;
        }else{
          res = (fn || init).call(this, reduced[reduced.length-1], event);
        }
        reduced.push(res);
        return pipe.next(res);
      });
    },

    /*
      Take only @x count or (if @x is function) works like .filter()
    */
    take : function(x){
      return process.call(this, function(e, pipe){
        var bus = pipe.host();
        bus.data.limit = bus.data.limit || x;
        bus.data.taken = (bus.data.taken + 1) || 0;
        return bus.data.taken >= bus.data.limit ? pipe.stop() : pipe.next(e);
      });
    },


    /*
      Skips data [Integer] @c times
    */
    skip : function(c) {
      var self = this;
      return process.call(this, function(e, pipe){
        self.skips = self.skips || 0;
        if(self.skips == c){
          delete self.skips;
          pipe.next(e)
        }else{
          self.skips += 1;
          pipe.stop();
        }
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
        var data = pipe.host().data, fires = data.fires, takes = data.takes,
            cons = (fires.length > 1 || takes.length > 0) && (compractor(event, fires[fires.length-2]) || compractor(event, takes.last()));
          return cons ? pipe.stop() : pipe.next(event);
      });
    },

    pipe : function(fn){
      return process.call(this, function(event, pipe){
        fn(event, pipe.next.bind(pipe));
      });
    },

    /*
      Debounce data bus on [Integer] @t miliseconds
    */
    debounce : function(t) {
      return process.call(this, function(e, pipe){
        var self = this, bus = pipe.host();
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
            bus = pipe.host(),
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
      var data;
      return process.call(this, function(e, pipe){
        var pipes = {
          get : function(fn){
            return fn ? fn(data) : data;
          },
          next: function(e, fn){
            data = fn ? fn(data, e) : e;
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

      }).host();
    },

    /*
      Usage: bus.merge(bus1, [bus2] ... [busN])
      Merges @bus with buses from arguments
    */
    merge : function(){
      var stream = Warden.Stream(this.$$id, this.$$context),
          argv = toArray(arguments);
          argv.push(this);

      each(argv, function(toMerge){
        toMerge.listen(function(data){
          stream.fire(data);
        });
      });      

      return stream;
    },

    alternately : function(bus){
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

    resolve : function(stream, fn, ctx) {
      var self = this;
      return Warden.Stream(function(emit){
        self.sync(stream).listen(function(data){
          emit(fn.call(ctx, data[0], data[1]));
        });
      }, ctx || this.$$context);
    },

    /* Combines two bises with given function @fn*/
    combine : function(bus, fn, seed){
      var self = this;

      return Warden.Stream(function(emit){
        function e(a,b){
          emit(fn.call(self.$$context, a,b));
        }

        self.listen(function(data){
          e(data, bus.data.last || seed);
        });
        bus.listen(function(data){
          e(self.data.last || seed, data);
        });

      }, this.$$context);
    },

    /* Synchronizes  buses */
    sync : function(){
      var self = this,
          argv = toArray(arguments),
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
      
      return nbus;
    },
    
    stream : function(){
      return inheritFrom(new Stream(), this);
    },

    swap : function(state){
      var self = this;

      function swap(e, val){
        e.locked = !val;
        each(e.children, function(child){
          child.swap(val);
        });
      }

      swap(this, state);      
    },
    
    toggleOn: function(bus, state){
      var self = this;
      if(bus instanceof Stream){
        bus.listen(function(){
          self.swap(state);
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
  }

  Object.defineProperty(Stream.prototype, 'value', {
    configurable: true,
    get : function(){
      return this.data.last;
    },
    set : function(v){
      this.fire(v);
    }
  });

  Warden.configure.addToStream = function(name, fn, piped){
    Stream.prototype[name] = function() {
      var self = this,
          argv = arguments;
      if(!piped){
        return process.call(this, fn.apply(this, arguments));
      }else{
        return fn.apply(this, arguments);
      }
    };
  }

  Warden.configure.isStream = function(e){
    return (e instanceof Stream);
  }

  return Stream;
})();


Warden.Stream = function(x, context, strict){
  var stream, xstr, reserved = [], i, bus;    
      context = context || {};  
      stream = new Stream([], context);

  if(is.fn(x)){
    /* If we strict in context */
    if(strict===true){
      xstr = x.toString();

      for(i in context){
        if(context.hasOwnProperty(i))
          reserved.push(i);
      }

      if(reserved.length){
        each(reserved, function(prop){
          if(xstr.indexOf("this."+prop)>=0){
            /* If there is a coincidence, we warn about it */
            console.error("Coincidence: property: '" + prop + "' is already defined in stream context!", context);
          }
        });    
      }
    }

    x.call(context, function(result, ctx){
      stream.fire(result, ctx);
    });  
  }

  return stream;
}