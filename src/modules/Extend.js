/*
  Extend module:
    docs: ./docs/Extend.md
    version: v2.1.0
  
  -- v2.1.0
    Added full regexp notation for listen/stream/emit/unlisten

  -- v2.0.0
    Added regext for events (listen and emit)
    Fixed array extension usage (now simplier)

  -- v1.1.0 --
    Incapsulated $$handlers and now shows only $$id of object
    Added extended arrays methods sequentially and toBus
    Added multiple events listenins, unlistening and streaming

  -- v1.0.1 --
    Removed maximal handlers counter
    Changed array observation methods, now it's own properties of new array (extented)

  -- v1.0.0 --
    Added array changes observation.
    Stabilized default configuration behavior with current deepExtend (Utils/extend) method.
    Changed all functions from ES5 to Utils module analogues.

  This methods extends @obj which can be function, object or array with Warden.js methods .emit(), .listen(), .unlisten() and .stream()
*/

Warden.extend = (function(){
  var each = Utils.each,
    is = Utils.is,
    filter = Utils.filter,
    extend = Utils.extend,
    hashc = Utils.$hash,
    nativeListener = "addEventListener",
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
      each(Utils.toArray(arguments).slice(1), function(handler){
        ghandlers[id].push(handler);
      });
      return ghandlers[id];
    },

    getHandlers = function(id){
      return ghandlers[id] || [];
    }

    function isRegExp(str){
      return /.?[\*\[\]\{\}\.\?\$\^\\\|].?/g.test(str);
    }

  return function(obj, conf) {
    Analyze('extend', obj);

    function binder (fn, handlers, callback){
      return function(type){
        var self = this;

        if(!filter(handlers, function(i){return is.str(type) ? i.type == type : i.type.test(type)}).length && self[config.listener]){
          if(is.not.str(type)){
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


    var config = extend({}, defaultConfig, conf || {}), // default configuration
        inheritor = obj || {}, // final object to extend
        isConstructor = true, //obj is constructor
        names = config.names;

    /*
      Choose object to extend,
      if fn is constructor function, then that's prototype, else
      use actual object element
    */
    if(is.fn(obj)){
      inheritor = obj.prototype;
    }else{
      isConstructor = false;

      if(is.array(obj)){
        /* Extending methods of a current array with stream evaluation */
        each(config.arrays, function(fn){
          obj[fn] = function(){
            obj.constructor.prototype[fn].apply(obj, arguments);
            obj.emit({
              type: fn,
              current: obj,
              data: Utils.toArray(arguments)
            });
          }
        });

        inheritor.sequentially = function(timeout){
          var stream = Warden.makeStream(),
              self = this,
              i = 0,
              interval = setInterval(function(){
                if(i==self.length){
                  i=0;
                  clearInterval(interval);
                }else{
                  stream.eval(self[i++])
                }
              }, timeout);

          return stream.bus();
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
    inheritor[names.emit] = function(ev, data){
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
    };

    /* Listen events of @type */
    inheritor[names.listen] = function(types, callback){
      var self = this,
        reactor = binder(function(event){
          this.emit(event);
        }, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), callback);

      Analyze('listen', types);

      each(types.split(','), function(type){
        type = Utils.trim(type);
        reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
      });

      return this;
    };

    /* Unsubscribe from events of @type */
    inheritor[names.unlisten] = function(types, name){
      var self = this, handlers = getHandlers(this['$$id'] = this['$$id'] || hashc.set('o'));

      Analyze('unlisten', types)

      each(types.split(','), function(type){
        type = Utils.trim(type);
        if(handlers.length){
          var indexes = [];
          each(handlers, function(handler, index){
            if(handler.callback.name == (name.name || name) && ( is.str(handler.type) ? handler.type == type : handler.type.test(type))){
              indexes.push(index);
            }
          });
          each(indexes, function(i){
            handlers.splice(i,1);
          });
        }
      });

      return this;
    };

    /* Creates stream of @type type events*/
    inheritor[names.stream] = function(types, cnt){
      Analyze('stream', types);

      var self = this,
          stream = Warden.makeStream(types, cnt || this),
          seval = function(event){
            stream.eval(event)
          },
          reactor = binder(seval, getHandlers(this['$$id'] = this['$$id'] || hashc.set('o')), seval);
      
      each(types.split(','), function(type){
        type = Utils.trim(type);
        reactor.call(self, isRegExp(type) ? new RegExp(type) : type);
      });

      return stream.get();
    };

    return obj;
  };
})();
