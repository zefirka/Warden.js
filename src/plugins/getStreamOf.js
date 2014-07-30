(function(){
  (function(root, factory) {
    var Warden;
    if (typeof exports === 'object' && exports) {
      return factory(exports);
    } else {
      if (!root.Warden) {
        Warden = {};
      } else {
        Warden = root.Warden;
        factory(Warden);
      }
      if (typeof define === 'function' && define.amd) {
        return define(Warden);
      } else {
        return root.Warden = Warden;
      }
    }
  })(this, function(Warden) {
    
    Warden.getStreamOf = function(fn, context){
      
      var type = [0,0,0,0,0].map(function(item, i){ return (((Math.random() * Math.pow(10, i+2))  >> 0 ) >> (Math.abs(i-1)))}).join("-");
      var stream = Warden.createStream(type+'', context || this);

      fn(function(arrivedData){
        stream.eval(arrivedData);
      });

      return stream;
    }
  
  });
})();