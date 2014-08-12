/* 
  Extend module: 
    docs: ./docs/Extend.md
    version: v.0.1.0

  This methods extends @obj which can be both 
  function or object with Warden.js methods .emit(), 
  .listen() and .stream() 
*/

Warden.extend = function(obj, conf) {
  /* Default configuration */

  var config = conf || {
    max : 512, // maximal handlers per object
    context : 'this', // context of evaluation
    emitter : null, // custom event emitter if exists
    listener : null // custrom event listener if exists
  };
  
  /* 
    Choose object to extend,
    if fn is constructor function, then that's prototype, else
    use actual object element 
  */
  
  var ctype = typeof obj, // type of object to extend
      inheritor = obj, // final object to expand
      isConstructor = true; // is obj is constructor
  
  switch(ctype){
    case 'function': // then object is constructor
      inheritor = obj.prototype;
      isConstructor = true;
    break;
    case 'object': // else its just an js object
      isConstructor = false;
    break;
  }
  
  /* 
    Setting up standart DOM event listener 
    and emitters  function to not overwrite them 
    and user should do not use that in config 
  */

  if(typeof jQuery !== 'undefined'){
    config.emitter = config.emitter || 'trigger';
    config.listener = config.listener || 'on';    
  }else
  if(typeof inheritor.addEventListener === 'function' || typeof inheritor.attachEvent === 'function'){
    config.listener = config.listener || (typeof inheritor.addEventListener === 'function' ? "addEventListener" : "attachEvent");
  }
    
  /* Collections of private handlers */
  /* Developed to incapsulate handlers of every object */
  var handlers = [];

  /* Setting new handler @fn of event type @type to @object */
  handlers.setNewHandler = function(object, type, fn){
    var handlers = this.getHandlers(object, type);
    if(handlers){
      if(handlers.length < config.max){
        handlers = handlers.push(fn);
      }else{
        throw "Maximal handlers count reached";
      }
    }else{
      var collection = this.getCollection(object);
      if(collection){
        collection.handlers[type] = collection.handlers[type] || [];
        collection.handlers[type].push(fn);
      }else{ 
        collection = {};
        collection.object = object;
        collection.handlers = {};
        collection.handlers[type] = [fn];
        this.push(collection);
      }
    }
  };
  
  /* Get collections of handlers by types of @object */
  handlers.getCollection = function(object){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i]
      }
    }
    return false;
  };

  /* Get handlers of @object by @type */
  handlers.getHandlers = function(object, type){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i].handlers[type];
      }
    }
    return false;
  };  
  
  /* Emitter method */
  inheritor.emit = function(ev){
    var self = this,
        callbacks = handlers.getHandlers(this, ev.type);
      
    forEach(callbacks, function(callback){
      callback.call(self, ev);
    });
      
    return this;
  };

  /* Listener function */
  inheritor.listen = function(type, callback, settings){    
    handlers.setNewHandler(this, type, callback);    
    if(this[config.listener]){
      this[config.listener].apply(this, [ev, function(event){ self.emit(event)}]);
    }
    return this;
  };
    
  /* Creates stream */
  inheritor.stream = function(type, cnt) {
    var stream = Warden.makeStream(type, cnt || this);

    handlers.setNewHandler(this, type, function(event){
      stream.eval(event);
    });

    if(this[config.listener]){
      this[config.listener].apply(this, [type, function(event){ stream.eval(event);}]);
    }
    
    return stream.get();
  };

  return obj;
};