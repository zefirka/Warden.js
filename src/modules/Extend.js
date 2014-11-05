/* 
  Extend module: 
    docs: ./docs/Extend.md
    version: v1.0.1

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
    map = Utils.map,
    filter = Utils.filter,
    extend = Utils.extend,
    nativeListener = "addEventListener",
    alternativeListener = "attachEvent",

    defaultConfig = {
      arrayMethods : ['pop', 'push', 'slice', 'splice',  'reverse', 'join', 'concat', 'shift', 'sort', 'unshift' ],
      names : {
        emit : 'emit',
        listen : 'listen',
        stream : 'stream',
        unlisten : 'unlisten'
      },
      emitter : null, /* custom event emitter if exists */
      listener : null /* custrom event listener if exists */
    }

  Warden.configure.changeDefault = function(newConfig){
    return Utils.extend(defaultConfig, newConfig);
  }

  Warden.configure.natives = function(obj){
    nativeListener = obj.listener;
    alternativeListener = obj.altenativeListener;
  }

  return function(obj, conf) {
    Analyze('extend', obj);

    var config = extend({}, defaultConfig, conf || {}), // default configuration 
        inheritor = obj, // final object to expand
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
          var functionalObjects = map(config.arrayMethods, function(fn){
            return {
              name: fn,
              fun: Array.prototype[fn] }
          });

        /* Extending methods of a current array with stream evaluation */
        each(functionalObjects, function(item){
          obj[item.name] = function(){
            var argv = Array.prototype.slice.call(arguments);
            item.fun.apply(obj, argv);
            obj.emit({
              type: item.name, 
              current: obj,
              data: argv
            });
          }
        });      
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
          callbacks = filter(this['$$handlers'], function(i){
            return i.type == type;
          });
      
      each(callbacks, function(callback){
        callback.callback.call(self, data);
      });
        
      return this;
    };

    /* listen events of @type */
    inheritor[names.listen] = function(type, callback){
      var self = this,
          handlers = this['$$handlers'] = this['$$handlers'] || [];
      
      if(!filter(handlers, function(i){return i.type == type;}).length && this[config.listener]){
        this[config.listener].apply(this, [type, function(event){ 
          self.emit(event)
        }]);
      }
    
      this['$$handlers'].push({
        type: type,
        callback: callback
      });

      return this;
    };

    /* Unsubscribe from events of @type */
    inheritor[names.unlisten] = function(type, name){
      var self = this;
      if(self['$$handlers']){
        var indexes = [];
        each(self['$$handlers'], function(i, index){
          if(i.callback.name == (name.name || name)){
            indexes.push(index);
          }
        });
        each(indexes, function(i){
          self['$$handlers'].splice(i,1);
        });
      }
      return this;
    };

    /* Creates stream of @type type events*/
    inheritor[names.stream] = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this),
          handlers = this['$$handlers'] = this['$$handlers'] || [];
         
      if(!filter(handlers, function(i){return i.type == type;}).length && this[config.listener]){
        this[config.listener].apply(this, [type, function(event){     
          stream.eval(event);      
        }]);
      }

      this['$$handlers'].push({
        type: type,
        callback: function(event){
          stream.eval(event);
        }
      });

      return stream.get();
    };

    return obj;
  };
})();