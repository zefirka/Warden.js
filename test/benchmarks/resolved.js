var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Stream: resolving and sampling',
  tests: [
  	{
    	name: 'Warden: resoveWith',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run1, run2;

    		var stream1 = Warden.Stream(function(e){
    			run1 = e;
    		})
    		var stream2 = Warden.Stream(function(e){
    			run2 = e;
    		});

    		stream1.resolveWith(stream2, function(a,b){
    			return a > b ? a : b
    		}).listen(function(e){
    			done++
    			if(done>1000){
    				red.resolve();
    			}
    		})

    		while(done<=1000){
    			run1(Math.random()*10);
    			run2(Math.random()*10);
    		}
    	}
    },
	{
    	name: 'Bacon: sampledBy',
    	defer: true,
    	fn: function(red) {
    		var done = 0;

    		var run1, run2;

    		var stream1 = Bacon.fromBinder(function(e){
    			run1 = e;
    		})
    		var stream2 = Bacon.fromBinder(function(e){
    			run2 = e;
    		});

    		stream1.sampledBy(stream2, function(a,b){
    			return a > b ? a : b
    		}).onValue(function(e){
    			done++
    			if(done>1000){
    				red.resolve();
    			}
    		})

    		while(done<=1000){
    			run1(Math.random()*10);
    			run2(Math.random()*10);
    		}
    	}
    },
  ]
};