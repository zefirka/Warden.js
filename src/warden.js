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
  Warden.version = "0.1.0"; 
  Warden.configure = {};
  
  /* 
    Globals: 
      Utils
      Analyze
  */
  include "Helpers.js"

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
}));