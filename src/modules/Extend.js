/* 
  Extend module: 
    docs: ./docs/Extend.md
    version: v.0.2.2

  This methods extends @obj which can be both 
  function or object with Warden.js methods .emit(), 
  .listen() and .stream() 
*/


Warden.extend = function(obj, conf) {
  /* Arguments type analysis */
  Analyze('extend', obj);

  /* Default configuration */
  var config = extend(conf, {
    max : 512, // maximal handlers per object
    context : 'this', // context of evaluation
    emitter : null, // custom event emitter if exists
    listener : null // custrom event listener if exists
  });
  
  /* 
    Choose object to extend,
    if fn is constructor function, then that's prototype, else
    use actual object element 
  */
  
  var inheritor = obj, // final object to expand
      isConstructor = true; // is obj is constructor
  
  if(is.fn(obj)){
    inheritor = obj.prototype;
  }else{
    isConstructor = false;
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
  if(is.fn(inheritor.addEventListener) || is.fn(inheritor.attachEvent)){
    config.listener = config.listener || (is.fn(inheritor.addEventListener) ? "addEventListener" : "attachEvent");
  }
  
  /* Preventing native 'emit' method override */
  var emitName = inheritor.emit ? '$emit' : 'emit';
  
  /* Collections of private handlers */
  /* Developed to incapsulate handlers of every object */
  var handlers = [];

  /* Setting new handler @fn of event type @type to @object */
  handlers.sH = function(object, type, fn){
    var handlers = this.gH(object, type);
    if(handlers){
      if(handlers.length < config.max){
        handlers = handlers.push(fn);
      }else{
        throw "Maximal handlers count reached";
      }
    }else{
      var collection = this.gC(object);
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
  handlers.gC = function(object){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i]
      }
    }
    return false;
  };

  /* Get handlers of @object by @type */
  handlers.gH = function(object, type){
    for(var i=this.length-1; i>=0; i--){
      if(this[i].object === object){
        return this[i].handlers[type];
      }
    }
    return false;
  };  
  
  /* Emitter method */
  inheritor[emitName] = function(ev){
    var self = this,
        callbacks = handlers.gH(this, ev.type || ev);
    console.log('Что-то эмитировали!');
    forEach(callbacks, function(callback){
      callback.call(self, ev);
    });
      
    return this;
  };

  /* Listener function */
  inheritor.listen = function(type, callback, settings){    
    var self = this;
    handlers.sH(this, type, callback);    
    if(this[config.listener]){
      this[config.listener].apply(this, [type, function(event){ 
        self[emitName](event)
      }]);
    }
    return this;
  };

  /* Creates stream */
  inheritor.stream = function(type, cnt) {
    var stream = Warden.makeStream(type, cnt || this);

    handlers.sH(this, type, function(event){
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