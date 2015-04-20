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
    return Warden.extend(is.exist(a) ? a : {}, b);
  }
  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.3.5";
  Warden.configure = {
    history : 3,
    cmp : function(x,y){ return x === y; }
  };


  include "Utils.js"
  
  include "Extend.js"

  include "Pipeline.js"

  include "Host.js"

  include "Stream.js"

  include "Watcher.js"

  include "Plugins.js"
  

  if(jQueryInited){
    Warden(jQuery);
  }

  return Warden;

}));
