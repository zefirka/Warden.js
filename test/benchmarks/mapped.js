var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Stream: mapped with Square function',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run;
    		var stream = Warden.Stream(function(e){
    			run = e;
    		});

    		stream.map(utils.square).listen(function(){
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
	{
    	name: 'Bacon',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run;
    		var stream = Bacon.fromBinder(function(e){
    			run = e;
    		});

    		stream.map(utils.square).onValue(function(){
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