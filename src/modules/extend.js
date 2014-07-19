Warden.extend = function(child, config) {
  /* Choose object to extend,
     if fn is constructor function, then that's prototype, else
     use actual object element 
  */
  var ctype = typeof child, // type of object to extend
      inheritor = child, // final object to expand
      isConstructor = true; 
  
//  var invalid  = 'Expected only functions and objects';
  
  switch(ctype){
    case 'function': 
      inheritor = child.prototype;
      isConstructor = true;
    break;
    case 'object':
      isConstructor = false;
//      if(isArray(child)) throw new TypeError(invalid);
    break;
//    default:
//      throw new TypeError(invalid);
//    break;
  }
  
  var settings = {
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

  var collections = [];
  collections.items = [];
  collections.create = function(item){
    this.push(item);
    this.items.push({
      handlers: {},
      streams: {},
    });
    return this.items[this.length -1];
  }
  collections.isIn = function(item){
    for(var i=this.length-1; i>=0; i--){ 
      if(this[i]===item){
        return this.items[i];
      } 
    }
    return []; 
  };
  
  
  /* Emitter function */
  inheritor.emit = inheritor.emit || function(ev) {
    var self = this,
        col = collections.isIn(this),
        streams = col.streams,
        handlers = col.handlers;
    
    // Processing streams for event type
    forEach(streams[ev.type], function(i) {
      return i.evaluate(ev, self);
    });
      
    // Processing callbacks for event type
    forEach(handlers[ev.type], function(item){
      var context = (item.config && item.config.context) || self, // context of evaluation
          adj = item.config && item.config.adj; // additional data 
      return item.callback.apply(context, [ev].concat(adj));
    });
      
    return this;
  };

  
  inheritor.listen = inheritor.listen || function(ev, callback, config){
//    if (typeof ev !== 'string') {
//      throw "Type Error: Wrong argument[1] in .on method. Expected string.";
//    }
//    if (typeof callback !== 'function') {
//      throw "Type Error: Wrong argument[2] in .on method. Expected function.";
//    }
    
    var col = collections.isIn(this);
    if(!col.length){
      col = collections.create(this);
    }
    
    // creating callbacks i
    handlers = col.handlers
    handlers[ev] = handlers[ev] || [];
    
    if (handlers[ev].length >= settings.max) {
      throw("The maximum number (" + settings.max + ") of handler for event [" + ev + "] exceed.");
    }
    
    handlers[ev].push({
      callback: callback,
      config: config
    });
    return this;
  };
    
  // Creating stream
  inheritor.stream = function(type, config) {
    var l = inheritor[settings.nativeListener]; // invocation retranslator

    if(l){
      if(settings.context == 'this'){
        inheritor[settings.nativeListener](type, function(e){
          inheritor.emit(e);
        });
      }else{
        l(type, inheritor.emit);
      }
    }
    
    var streams = null,
        stream = createStream(type, config);
    
    var col = collections.isIn(this);
    if(!col.length){
      col = collections.create(this);
      streams = col.streams;
    }else{
      streams = col.streams;
    }  
    
    if(streams && streams[type] == null)
      streams[type] = [];

    streams[type].push(stream);
    return stream;
  };

  return child;
};