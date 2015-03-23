var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Stream: reduced',
  tests: [
  	{
    	name: 'Warden: reduced',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run;
    		var stream = Warden.Stream(function(e){
    			run = e;
    		});

    		stream.map(utils.random(10)).map(utils.floor).reduce(0, utils.sadd).listen(function(e){
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
    	name: 'Bacon: reduced',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run;
    		var stream = Bacon.fromBinder(function(e){
    			run = e;
    		});

    		stream.map(utils.random(10)).map(utils.floor).scan(0, utils.sadd).onValue(function(){
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