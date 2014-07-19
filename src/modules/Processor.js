/*
  Processor module:
  In all processing functions: this variable is EventBus object;
*/

var Processor = (function(){  
  function deprecate(fn){
    return {
      busIsDeprecated : true,
      deprecationFn : fn
    }
  }
  
  var processor = {};
    
  // Processing functions:
  
  // mapping function
  processor['m'] = function map(process, event){
    var fn = process.fn;
    // fn is function then apply function
    
    if (typeof fn === 'function') {
      event = fn.apply(config.context, [event]);
    }else 
    
    // fn is property of event
    if(typeof fn === 'string' && event[fn] != undefined) {
      event = event[fn];               
    }else 
      
    // fn is array
    if(isArray(fn)){
      event = forEach(fn, function(prop){
        if (typeof prop === 'string' && event[prop] !== undefined) {
          return event[prop];
        }
      });
    }else 
    if(typeof fn === 'object'){
      var result = {};
      for(var key in fn){
        var val = fn[key];
        result[key] = event[fn[key]];
      }
      event = result;
    }else{
      if(typeof fn === 'string'){
        var props = fn.match(/{{\s*[\w\.]+\s*}}/g).map(function(x) { return x.match(/[\w\.]+/)[0]; });
        if(props.length){
          var res = fn;
          props.forEach(function(p){
            res = res.replace("\{\{"+p+"\}\}", event[p]);
          });
          event = res;
        }else{
          event = fn;
        }
      }else{
        event = fn;
      }
    }
    this.mapped = true;
    return event;
  };
  
  processor['f'] = function filter(process, event){
    var fn = process.fn;
    if(typeof fn === 'function') {
      if (fn.apply(config.context, [event]) === false) {
        return deprecate('filter');
      }
    }else{
      if(Boolean(fn) === false) {
        return derprecate('filter');
      }
    }
    this.filtered = true;
    return event;
  };
  
  processor['i'] = function include(process, event){
    var fn = process.fn;
    var self = this;
    if(isArray(fn)){
      forEach(fn, function(item){
        if(typeof item=='string'){
          if(this._public[item]!=null){
            event[item]=self._public[item];
          }
        }else{
          throw "Unexpected "+ typeof item + " at inclide";
        }
      });
    }else{
      if(this._public[fn]!=null){
        event[fn] = self._public[fn];
      }
    }
    return event;
  };
  
  processor['r'] = function reduce(process, event){
    var fn = process.fn, prev;
    if(this.taken.length>0){
      prev = this.taken[this.taken.length-1];
    }else{
      prev = process.start == 'first' ?  event : process.start;
    }
    event = fn.apply(config.context, [prev, event]);
    return event;
  };
  
  processor['u'] = function unique(process, event){
    if(this.taken.length){
      var pt = this.taken[this.taken.length-1][process.prop];
      if(pt){
        if(event[process.prop] == pt){
          return deprecate('unique');
        }  
      }else{
        if(event[process.prop] == this.history[this.history.length-1][process.prop]){
          return deprecate('unique');
        }
      }        
    }
    return event;
  };
  
  return processor;
})();