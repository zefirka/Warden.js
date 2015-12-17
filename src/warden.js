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

  Warden.version = "0.4.3-unstable";
  Warden.configure = {
    history : 3,
    cmp : function(x,y){ return x === y; }
  };

  (function(){
    //=require ./modules/Utils.js
    //=require ./modules/Extend.js
    //=require ./modules/Pipeline.js
    //=require ./modules/Stream.js
    //=require ./modules/Watcher.js
    //=require ./modules/Plugins.js
  })();

  if(jQueryInited){
    Warden(jQuery);
  }

  return Warden;

}));
