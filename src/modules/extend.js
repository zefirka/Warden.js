Warden.extented = 0;

Warden.extend = function(child, config) {
  /* Choose object to extend,
     if fn is constructor function, then that's prototype, else
     use actual object element 
  */
  var ctype = typeof child, // type of object to extend
      inheritor = child, // final object to expand
      isConstructor = true; 
    
  switch(ctype){
    case 'function': 
      inheritor = child.prototype;
      isConstructor = true;
    break;
    case 'object':
      isConstructor = false;
      if(isArray(child)) throw "Type Error";
    break;
    default:
      throw "Type Error";
    break;
  }
  
  //collections of callbacks and streams
  var streams = {},
      callbacks = {},
      settings = {
        max : (config && config.max) || 128, //count of max listeners
        context : (config && config.context) || 'this' // apply global context 
      };   
  
  if(isConstructor){
    settings.nativeEmitter = null;
    settings.nativeListener = null;
  }else{
    settings.nativeEmitter = (config && config.nativeEmitter) || (typeof jQuery === 'undefined' ? null : 'trigger');
    settings.nativeListener = (config && config.nativeListener) || (typeof jQuery === 'undefined' ? "addEventListener" : 'on');
  }
  
  //inheritor.wardenid = Warden.extented++;
  
  /* Emitter function */
  inheritor.emit = inheritor.emit || function(ev) {
    var self = this;
      
    // Processing streams for event type
    forEach(streams[ev.type], function(i) {
      return i.evaluate(ev, self);
    });
      
    // Processing callbacks for event type
    forEach(callbacks[ev.type], function(item){
      var context = (item.config && item.config.context) || self, // context of evaluation
          adj = item.config && item.config.adj; // additional data 
      return item.callback.apply(context, [ev].concat(adj));
    });
      
    return this;
  };

  
  inheritor.listen = inheritor.listen || function(ev, callback, config){
    if (typeof ev !== 'string') {
      throw "Type Error: Wrong argument[1] in .on method. Expected string.";
    }
    if (typeof callback !== 'function') {
      throw "Type Error: Wrong argument[2] in .on method. Expected function.";
    }
    
    // creating callbacks i
    callbacks[ev] = callbacks[ev] || [];
    
    if (callbacks[ev].length >= settings.max) {
      throw "The maximum number (" + settings.max + ") of handler for event [" + ev + "] exceed.";
    }
    
    callbacks[ev].push({
      callback: callback,
      config: config
    });
    return this;
  };
    
  // Creating stream
  inheritor.stream = function(type, config) {
    var l = inheritor[settings.nativeListener]; // invocation retranslator

    if(exists(l)){
      if(settings.context == 'this'){
        inheritor[settings.nativeListener](type, function(e){
          inheritor.emit(e);
        });
      }else{
        l(type, inheritor.emit);
      }
    }

    var stream = createStream(type, config);
    if(streams[type] == null)
      streams[type] = [];

    streams[type].push(stream);
    return stream;
  };

  return child;
};