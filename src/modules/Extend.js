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
        
    /* Emitter method */
    inheritor.emit = function(ev){
      var self = this,
          callbacks = this['$$handlers'].filter(function(i){
            return i.type == ev || i.type == ev.type            
          });
      
      forEach(callbacks, function(callback){
        callback.callback.call(self, ev);
      });
        
      return this;
    };

    /* Listener function */
    inheritor.listen = function(type, callback){
      var self = this;
      //handlers.set(this, type, callback);    
      var handlers = this['$$handlers'] = this['$$handlers'] || [];

      if(!handlers.filter(function(i){return i.type == type;}).length){
        if(this[config.listener]){
          this[config.listener].apply(this, [type, function(event){ 
            self.emit(event)
          }]);
        }
      }

      this['$$handlers'].push({
        type: type,
        callback: callback
      });      

      return this;
    };

    inheritor.mute = function(type, name){
      var self = this;
      name = name.name || name;
      if(self['$$handlers']){
        var indexes = [];
        forEach(self['$$handlers'], function(i, index){
          if(i.callback.name == name){
            indexes.push(index);
          }
        });
        forEach(indexes, function(i){
          self['$$handlers'].splice(i,1);
        });
      }
      return this;
    };

    /* Creates stream */
    inheritor.stream = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this);

      var handlers = this['$$handlers'] = this['$$handlers'] || [];
         
      if(!handlers.filter(function(i){return i.type == type;}).length){
        if(this[config.listener]){
          this[config.listener].apply(this, [type, function(event){     
            stream.eval(event);      
          }]);
        }
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