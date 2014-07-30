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
  
  // Warden properties and methods
  Warden.version = "0.0.1"; 
  Warden.toString = function() {
    return "Warden.js";
  };


  include "helpers.js"      
  include "extend.js" 
  include "Processor.js" 
  include "Streams.js" 
  include "Connector.js"
}));