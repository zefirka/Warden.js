var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');

module.exports = {
  name: 'Stream: creating 10 000 streams',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var max = 10000, tmp;
            while(max--){
                Warden.Stream(function(fire){
                    tmp = fire;
                });
            }
            red.resolve();
    	}
    },
	{
    	name: 'Bacon',
    	defer: true,
    	fn: function(red) {
    	   var max = 10000, tmp;
            while(max--){
                Bacon.fromBinder(function(fire){
                    tmp = fire;
                });
            }
            red.resolve();
    	}
    },
  ]
};