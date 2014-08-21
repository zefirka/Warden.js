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
  Warden.version = "0.0.4"; 
  Warden.log = function(x){
    console.log(x);
  }
  
  include "Helpers.js"      
  include "Extend.js" 
  include "Processor.js" 
  include "Streams.js"
  include "DataBus.js"
  include "Watcher.js"
}));