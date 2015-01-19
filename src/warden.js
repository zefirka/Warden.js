((function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    if(root.Warden == null){ //initialize Warden
      Warden = {};
    }
    factory(Warden);
    if (typeof define === "function" && define.amd) {
      define(Warden); // AMD
    } else {
      root.Warden = Warden; // <script>
    }
  }
})(this, function(Warden){

  'use strict';

  var jQueryInited = typeof jQuery != "undefined";

  Warden.version = "0.2.0-prerelease";
  Warden.configure = {
    cmp : function(x,y){ return x === y; }
  };

  /*
    Globals:
      Utils
      Analyze
  */
  include "Utils.js"

  /*
    Globals:
      Warden.extend
  */
  include "Extend.js"

  /*
    Globals:
      Processor
  */
  include "Processor.js"

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

}));
