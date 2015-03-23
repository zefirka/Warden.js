var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Nth: mapped with nth function',
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

    		stream.nth(1).listen(function(){
    			done++;
    			if(done>1000){
    				red.resolve();
    			}
    		});

    		while(done<=1000){
    			run(['a', 'b', 'c']);
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

    		stream.map(function(e){
                return e[1];
            }).onValue(function(){
    			done++;
    			if(done>1000){
    				red.resolve();
    			}
    		});

    		while(done<=1000){
    			run(['a', 'b', 'c']);
    		}
    	},
    },
  ]
};