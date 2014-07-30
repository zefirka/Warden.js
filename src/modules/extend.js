Warden.extend = function(obj, conf) {
  /* Default configuration */
  var config = conf || {
    max : 128,
    context : 'this',
    nativeEmitter : null,
    nativeListener : null
  };
  
  /* Choose object to extend,
     if fn is constructor function, then that's prototype, else
     use actual object element 
  */
  
  var ctype = typeof obj, // type of object to extend
      inheritor = obj, // final object to expand
      isConstructor = true; 
    
  switch(ctype){
    case 'function': 
      inheritor = obj.prototype;
      isConstructor = true;
    break;
    case 'object':
      isConstructor = false;
    break;
  }
    
  if(typeof jQuery !== 'undefined'){
    config.nativeEmitter = config.nativeEmitter || 'trigger';
    config.nativeListener = config.nativeListener || 'on';    
  }else
  if(typeof inheritor.addEventListener === 'function') {
    config.nativeListener = config.nativeListener || "addEventListener";
  }
    
  /* Collections of private handlers */
  var handlers = [];
  handlers.setNewHandler = function(object, type, fn){
    var handlers = this.getHandlers(object, type);
    if(handlers){
      handlers.push(fn);
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
  
  handlers.getCollection = function(object){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i]
      }
    }
    return false;
  };

  handlers.getHandlers = function(object, type){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i].handlers[type];
      }
    }
    return null;
  };  
  
  /* Emitter function */
  inheritor.emit = inheritor.emit || function(ev) {
    console.log("Emitted " + ev.type);
    var self = this,
        callbacks = handlers.getHandlers(this, ev.type);
      
    forEach(callbacks, function(callback){
      callback.call(self, ev);
    });
      
    return this;
  };

  /* Listener function */
  inheritor.listen = function(ev, callback, settings){    
    var self = this;
    handlers.setNewHandler(this, ev, callback);    
    if(this[config.nativeListener]){
      this[config.nativeListener].apply(this, [ev, function(event){ self.emit(event)}]);
    }
    return this;
  };
    
  /* Creates stream */
  inheritor.stream = function(type, cnt) {
    var self = this,
        stream = Warden.makeStream(type, cnt || this);
    
    handlers.setNewHandler(this, type, function(event){
      stream.eval(event);
    });
    
    if(this[config.nativeListener]){
      this[config.nativeListener].apply(this, [type, function(event){ stream.eval(event);}]);
    }
    
    return stream.get();
  };

  return obj;
};