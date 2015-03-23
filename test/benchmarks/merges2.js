var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Stream: merging two streams',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var called = 0;

    		var run1, run2;

    		var stream1 = Warden.Stream(function(e){
    			run1 = e;
    		})
    		var stream2 = Warden.Stream(function(e){
    			run2 = e;
    		});

    		stream1.merge(stream2).listen(function(e){
                called++;

                if(called>999){
                    red.resolve();
                }
    		})

    	   utils.repeat(1000, function(x){
                if(x%2){
                    run1(x);
                }else{
                    run2(x);
                }
            });
    	}
    },
    {
        name: 'Bacon',
        defer: true,
        fn: function(red) {
            var called = 0;

            var run1, run2;

            var stream1 = Bacon.fromBinder(function(e){
                run1 = e;
            })
            var stream2 = Bacon.fromBinder(function(e){
                run2 = e;
            });

            stream1.merge(stream2).onValue(function(e){
                called++;

                if(called>999){
                    red.resolve();
                }
            });

           utils.repeat(1000, function(x){
                if(x%2){
                    run1(x);
                }else{
                    run2(x);
                }
            });
        }
    }
  ]
};