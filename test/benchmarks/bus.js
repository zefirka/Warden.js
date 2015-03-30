var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');

module.exports = {
  name: 'Bus',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var stream = Warden.Stream();

    		stream.listen(function(){
    			done++;
    			if(done>1000){
    				red.resolve();
    			}
    		});

    		while(done<=1000){
    			stream.fire(done);
    		}
    	},
    },
	{
    	name: 'Bacon',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run;
    		var stream = Bacon.fromBinder(function(e){
    			run = e;
    		});

    		stream.onValue(function(){
    			done++;
    			if(done>1000){
    				red.resolve();
    			}
    		});

    		while(done<=1000){
    			run(done);
    		}
    	},
    },
  ]
};