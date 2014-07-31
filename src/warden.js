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
  Warden.version = "0.0.2"; 
  Warden.log = function(){
    if(Warden.debug || window.debug){
      console.log(arguments);
    }
    return void 0;
  }
  
  include "Helpers.js"      
  include "Extend.js" 
  include "Processor.js" 
  include "Streams.js" 
  //include "Connector.js"
}));