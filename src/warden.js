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
  
  // Helpers
  include "helpers.js"

  // Warden properties and methods
  Warden.version = "0.0.1"; 
  Warden.toString = function() {
    return "Warden.js";
  };
      
  include "extend.js"
  /* Extending fn with warden methods */
  
  include "Processor.js"
  include "Streams.js"
  
  // Private functions  
  
  
  // Conncector class
  include "Connector.js"
}));