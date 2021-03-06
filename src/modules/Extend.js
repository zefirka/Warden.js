/* This methods extends @obj which can be function, object or array with Warden.js methods .emit(), .listen(), .unlisten() and .stream() */
Warden.extend = (function(){
  var nativeListener = "addEventListener",
      alternativeListener = "attachEvent",

    defaultConfig = {
      arrays : ['pop', 'push', 'splice', 'reverse', 'shift', 'unshift', 'sort'], //only not-pure methods
      names : {
        emit : 'emit',
        listen : 'listen',
        stream : 'stream',
        unlisten : 'unlisten'
      },
      emitter : null, /* custom event emitter if exists */
      listener : null /* custrom event listener if exists */
    },

    ghandlers = {}, //global storage for handlers

    setHandlers = function(id){
      ghandlers[id] = ghandlers[id] || [];
      each(toArray(arguments).slice(1), function(handler){
        ghandlers[id].push(handler);
      });
    },

    getHandlers = function(id){
      return ghandlers[id] || [];
    }

    function isRegExp(str){
      return /.?[\*\[\]\{\}\.\?\$\^\\\|].?/g.test(str);
    }
  
  function _Array(arr){
    each(arr, function(v, i){
      this[i] = v;
    }.bind(this));
  }

  function define(obj, name, val){
    Object.defineProperty(obj, name, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: val 
    })
  }

  return function(obj, conf) {
    function binder (fn, handlers, callback){
      return function(type){
        var self = this;

        if(every(handlers, function(i){return is.str(type) ? i.type == type : i.type.test(type)}) && self[config.listener]){
          if(!is.str(type)){
            throw new Error("Invalid format in: " + config.listener);
          }
          this[config.listener].apply(this, [type, function(event){
            fn.call(self, event)
          }]);
        }

        setHandlers(self['$$id'], {
          type: type,
          callback: callback
        });
      }
    }

    function setval(a, b, c){
     a[b] = c;
    }

    var config = extend({}, defaultConfig, conf || {}), // default configuration
        inheritor = is.exist(obj) ? obj : {}, // final object to extend
        isConstructor = true, //obj is constructor
        names = config.names;

    /*
      Choose object to extend,
      if fn is constructor function, then that's prototype, else
      use actual object element
    */
    if(is.fn(obj)){
      inheritor = obj.prototype;
    }else
    if(typeof obj !== _OBJ){
      var constStream = Warden.Stream().watch();
      constStream.fire(obj);
      return constStream;
    }else{
      isConstructor = false;

      if(is.array(obj)){
        /* Extending methods of a current array with stream evaluation */

        _Array.prototype = Object.create(inheritor);

        define(_Array.prototype, 'repeatedly', function(){
          var self = this, l = self.length;

          return Warden.Stream(function(fire){            
            var i = 0;
            setTimeout(function(){
              while(i < l){
                fire(self[i++])
              }
            });            
          });
        });

        define(_Array.prototype, 'sequentially', function(timeout){
          var self = this, l = self.length;

          return Warden.Stream(function(fire){
            var i = 0,
            
            interval = setInterval(function(){
              if(i<l){
                fire(self[i]);
                i++;
              }else{
                i = 0;
                clearInterval(interval);
              }

            }, timeout);
          });
        });

        each(config.arrays, function(name){
          define(_Array.prototype, name, function(){ 
            var prev = this;
            Array.prototype[name].apply(this, arguments);
            this.emit({
              type: name,
              prev : prev,
              current: this,
              data: toArray(arguments)
            });
          });
        });

        obj = new _Array(obj);
        inheritor = _Array.prototype;

        setval = function(a,b,c){
          return define(a,b,c);
        }
      }

    }

    var overwrite = inheritor[names.emit] || inheritor[names.listen] ||
                    inheritor[names.unlisten] || inheritor[names.stream];

    /* Checking free namespace */
    if(is.exist(overwrite)){
      throw new Error("Can't overwrite: " + (overwrite.name ? overwrite.name : overwrite) + " of object");
    }

    /*
      Setting up standart DOM event listener
      and emitters  function to not overwrite them
      and user should do not use that in config
    */
    if(jQueryInited && (!isConstructor ? obj instanceof jQuery : true)){
      config.emitter = config.emitter || 'trigger';
      config.listener = config.listener || 'on';
    }else
    if(is.fn(inheritor[nativeListener]) || is.fn(inheritor[alternativeListener])){
      config.listener = config.listener || (is.fn(inheritor[nativeListener]) ? nativeListener : alternativeListener);
    }

    /* Emitter method */
    setval(inheritor, names.emit, function(ev, data){
      var self = this,
          type = is.str(ev) ? ev : ev.type,
          data = is.obj(ev) ? ev : data || ev,
          callbacks = filter(getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), function(i){
            return is.str(i.type) ? i.type == type : i.type.test(type);
          });

      each(callbacks, function(callback){
        callback.callback.call(self, data);
      });

      return this;
    });

    /* Listen events of @type */
    setval(inheritor, names.listen, function(types, callback){
      var self = this,
        reactor = binder(function(event){
          this.emit(event);
        }, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), callback);

      each(types.split(','), function(type){
        type = trim(type);
        reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
      });

      return this;
    });

    /* Unsubscribe from events of @type */
    setval(inheritor, names.unlisten, function(type, name){
      var self = this, 
          indexes = [], //to remove
          type = trim(type),
          handlers = getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')); // link to object

      if(handlers.length){
        
        if(!name){
          indexes = new Array(handlers.length);
        }else{
          each(handlers, function(handler, index){
            if(handler.callback.name == (name.name || name) && handler.type.toString() == type.toString()){
              indexes.push(index);
            }            
          });
        }

        each(indexes, function(i){
          handlers.splice(i,1);
        });
      }
      return this;
    });

    /* Creates stream of @type type events*/
    setval(inheritor, names.stream, function(types, cnt){
      var self = this,
          stream = Warden.Stream(null, cnt || this),
          seval = function(event){
            stream.fire(event, cnt || this)
          },
          reactor = binder(seval, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), seval);
      
      each(types.split(','), function(type){
        type = trim(type);
        reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
      });

      return stream;
    });

    return obj;
  };
})();