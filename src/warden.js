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

  if(jQueryInited){
    Warden.extend(jQuery);
  }

  return Warden;

}));
