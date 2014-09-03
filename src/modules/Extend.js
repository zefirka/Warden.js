/* 
  Extend module: 
    docs: ./docs/Extend.md
    version: v.0.3.1

  This methods extends @obj which can be both 
  function or object with Warden.js methods .emit(), 
  .listen() and .stream() 
*/

Warden.extend = (function(){
  var forEach = Utils.forEach, 
    is = Utils.is,
    extend = Utils.extend,
    nativeListener = "addEventListener",
    alternativeListener = "attachEvent",

    defaultConfig = {
      max : 512, // maximal handlers per object
      context : 'this', // context of evaluation
      emitter : null, // custom event emitter if exists
      listener : null // custrom event listener if exists
    }

  return function(obj, conf) {
    Analyze('extend', obj);

    var config = extend(defaultConfig, conf || {}), // default configuration 
        inheritor = obj, // final object to expand
        isConstructor = true; //obj is constructor
    /* 
      Choose object to extend,
      if fn is constructor function, then that's prototype, else
      use actual object element 
    */    
    if(is.fn(obj)){
      inheritor = obj.prototype;
    }else{
      isConstructor = false;
    }

    var overwrite = inheritor.emit || inheritor.listen || inheritor.stream;

    /* Checking free namespace */
    if(is.exist(overwrite)){
      throw "Can't overwrite: " + (overwrite.name ? overwrite.name : overwrite) + " of object";
    }
    
    /* 
      Setting up standart DOM event listener 
      and emitters  function to not overwrite them 
      and user should do not use that in config 
    */
    if(typeof jQuery!=="undefined"){
      config.emitter = config.emitter || 'trigger';
      config.listener = config.listener || 'on';    
    }else
    if(is.fn(inheritor[nativeListener]) || is.fn(inheritor[alternativeListener])){
      config.listener = config.listener || (is.fn(inheritor[nativeListener]) ? nativeListener : alternativeListener);
    }
    
    /* Collections of private handlers */
    /* Developed to incapsulate handlers of every object */
    var handlers = [];

    /* Get handlers of @object by @type */
    handlers.get = function(object, type){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].o === object){
          return this[i].h[type];
        }
      }
      return false;
    };  

    /* Setting new handler @fn of event type @type to @object */
    handlers.set = function(object, type, fn){
      var handlers = this.get(object, type), collection;
      if(handlers){
        if(handlers.length < config.max){
          handlers.push(fn);
        }else{
          throw "Maximal handlers count reached";
        }
      }else{
        collection = this.getCollection(object);
        if(collection){
          collection.h[type] = collection.h[type] || [];
          collection.h[type].push(fn);
        }else{ 
          collection = {
            o : object,
            h : {}
          };
          collection.h[type] = [fn];
          this.push(collection);
        }
      }
    };
    
    handlers.removeHandler = function(object, type, name){
      var handlers = this.get(object, type), index = false;
      if(handlers){

        forEach(handlers, function(h, i){
          h.name === name;
          index = i;
        });

        if(index!==false){
          handlers = handelrs.slice(0, index).concat(handlers.slice(index+1, handlers.length));
        }
      }
    };

    /* Get collections of handlers by types of @object */
    handlers.getCollection = function(object){
      for(var i=this.length-1; i>=0; i--){
        if(this[i].o === object){
          return this[i]
        }
      }
      return false;
    };
    
    /* Emitter method */
    inheritor.emit = function(ev){
      var self = this,
          callbacks = handlers.get(this, ev.type || ev);
      
      forEach(callbacks, function(callback){
        callback.call(self, ev);
      });
        
      return this;
    };

    /* Listener function */
    inheritor.listen = function(type, callback){
      var self = this;
      handlers.set(this, type, callback);    
      if(this[config.listener]){
        this[config.listener].apply(this, [type, function(event){ 
          self.emit(event)
        }]);
      }
      return this;
    };

    inheritor.mute = function(type, name){
      if(is.fn(name)){
        name = name.name;
      }
      handlers.removeHandler(this, type, name);
      return this;
    };

    /* Creates stream */
    inheritor.stream = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this);

      handlers.set(this, type, function(event){
        stream.eval(event);
      });

      if(this[config.listener]){
        this[config.listener].apply(this, [type, function(event){     
          stream.eval(event);      
        }]);
      }
      
      return stream.get();
    };

    return obj;
  };

})();