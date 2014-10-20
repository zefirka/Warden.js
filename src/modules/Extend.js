/* 
  Extend module: 
    docs: ./docs/Extend.md
    version: v.0.3.1

  This methods extends @obj which can be both 
  function or object with Warden.js methods .emit(), 
  .listen() and .stream() 
*/

Warden.extend = (function(){
  var each = Utils.each, 
    is = Utils.is,
    map = Utils.map,
    extend = Utils.extend,
    nativeListener = "addEventListener",
    alternativeListener = "attachEvent",

    defaultConfig = {
      names : {
        emit : 'emit',
        listen : 'listen',
        stream : 'stream',
        unlisten : 'unlisten'
      },
      max : 512, // maximal handlers per object
      emitter : null, // custom event emitter if exists
      listener : null // custrom event listener if exists
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
        var arrayMethods = ['pop', 'push', 'indexOf', 'lastIndexOf', 
          'slice', 'splice',  'reverse', 'map', 
          'forEach', 'reduce', 'reduceRight', 'join', 
          'filter', 'concat', 'shift', 'sort', 'unshift'],

          functionalObjects = map(arrayMethods, function(fn){
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

    var overwrite = inheritor[names.emit] || 
                    inheritor[names.listen] || 
                    inheritor[names.unlisten] || 
                    inheritor[names.stream];

    /* Checking free namespace */
    if(is.exist(overwrite)){
      throw new Error("Can't overwrite: " + (overwrite.name ? overwrite.name : overwrite) + " of object");
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
    inheritor[names.emit] = function(ev, data){
      var self = this,
          type = is.str(ev) ? ev : ev.type,
          data = is.obj(ev) ? ev : data || ev,
          callbacks = this['$$handlers'].filter(function(i){
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

      if(this['$$handlers'].length<config.max){ 
      
        if(!handlers.filter(function(i){return i.type == type;}).length && this[config.listener]){
          this[config.listener].apply(this, [type, function(event){ 
            self.emit(event)
          }]);
        }
      
        this['$$handlers'].push({
          type: type,
          callback: callback
        });
      }else{
        throw new Error("Maximal handlers limit reached");
      }

      return this;
    };

    
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

    /* Creates stream */
    inheritor[names.stream] = function(type, cnt) {
      var stream = Warden.makeStream(type, cnt || this),
          handlers = this['$$handlers'] = this['$$handlers'] || [];
         
      if(!handlers.filter(function(i){return i.type == type;}).length && this[config.listener]){
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