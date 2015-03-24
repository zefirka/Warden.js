((function (root, init) {
  if (typeof exports === "object" && exports) {
    module.exports = init(); // CommonJS
  } else {
    var Warden = init();
    if (typeof define === "function" && define.amd) {
      define(Warden); // AMD
    } else {
      root.Warden = Warden; // <script>
    }
  }
})(this, function(){
  'use strict';
  var Warden = function(a, b){
    return Warden.extend(a||{}, b);
  }
  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.3.0-alpha";
  Warden.configure = {
    cmp : function(x,y){ return x === y; }
  };

  include "Utils.js"

  /*
    Globals:
      Warden.extend
  */
  include "Extend.js"

  /*
    Globals:
      Pipeline
  */
  include "Pipeline.js"

  /*
    Globals:
      Warden.makeStream
  */
  include "Streams.js"

  /*
    Globals:
      DataBus
  */
  include "DataBus.js"

  /*
    Globals:
      Warden.watcher
  */
  include "Watcher.js"


  Warden.Worker = function(adr){
    adr = adr.slice(-3) == '.js' ? adr : adr + '.js';
    var worker = new Worker(adr); 
    var stream = Warden.Host();
    worker.onmessage = function(){
      stream.eval(arguments)
    }
    stream.post = worker.postMessage;
    stream.onmessage = worker.onmessage
    return stream;
  }

  Warden.Observe = function(obj){
    if(Object.observe){
      var stream = Warden.Host(obj);
      Object.observe(obj, function(){
        stream.eval.apply(obj, arguments);
      })
    }else{
      throw "This browser doesn't implement Object.observe"
    }
  }

  if(jQueryInited){
    Warden.extend(jQuery);
  }

  return Warden;

}));
