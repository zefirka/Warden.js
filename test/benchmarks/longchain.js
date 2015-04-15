var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');

module.exports = {
  name: 'Stream: creating longchain streams with map',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var max = 10, tmp = Warden.Stream(), f = function(){};            
            while(max--){
                tmp = tmp.map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map('.prop').map('.prop').map('.prop').map('.prop').map('.prop')
            }
            red.resolve();
    	}
    },
	{
    	name: 'Bacon',
    	defer: true,
    	fn: function(red) {
    	   var max = 10, tmp = Bacon.fromBinder(f), f = function(){};
            while(max--){
                tmp = tmp.map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(1).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map(f).map('.prop').map('.prop').map('.prop').map('.prop').map('.prop')
            }
            red.resolve();
    	}
    },
  ]
};