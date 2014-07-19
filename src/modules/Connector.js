// Connector module 

var Connector = (function(){
  function Connector(item, prop, host){
    this.item = item;
    if(typeof item.prop === 'function'){
      this.method = prop;
    }else{
      this.prop = prop;  
    }

    this.host = host;
    this.locked = false;
  }
  Connector.prototype.assign = function(value) {
    if(this.method){
      this.item[this.method](value);
    }else{
      this.item[this.prop] = value;
    }
  };
  Connector.prototype.unbind = function() {
    this.locked = true;
  };
  Connector.prototype.bind = function() {
    this.locked = false;
  };
  return Connector;
})();