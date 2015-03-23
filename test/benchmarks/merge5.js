var Warden = require("../../dist/warden.min.js"),
	Bacon = require('baconjs');
	utils = require('./utils/utils.js');


module.exports = {
  name: 'Stream: merging 5 stream streams',
  tests: [
  	{
    	name: 'Warden',
    	defer: true,
    	fn: function(red) {
    		var called = 0;

    		var run1, run2, run3, run4, run5;

    		var stream1 = Warden.Stream(function(e){
    			run1 = e;
    		})
    		var stream2 = Warden.Stream(function(e){
    			run2 = e;
    		});
    		var stream3 = Warden.Stream(function(e){
    			run3 = e;
    		})
    		var stream4 = Warden.Stream(function(e){
    			run4 = e;
    		});
    		var stream5 = Warden.Stream(function(e){
    			run5 = e;
    		})
    		

    		stream1.merge(stream2).merge(stream3).merge(stream4).merge(stream5).listen(function(e){
                called++;

                if(called>999){
                    red.resolve();
                }
    		})

    	   utils.repeat(1000, function(x){
                var mod = x%5;
                switch(mod){
                	case 1:
                		run2(x)
                	break;
                	case 2:
                		run3(x)
                	break;
                	case 3:
                		run4(x)
                	break;
                	case 4:
                		run5(x)
                	break;
                	case 0:
                		run1(x)
                	break;
                }
            });
    	}
    },
    {
        name: 'Bacon',
        defer: true,
        fn: function(red) {
            var called = 0;

            var run1, run2, run3, run4, run5;

            var stream1 = Bacon.fromBinder(function(e){
                run1 = e;
            })
            var stream2 = Bacon.fromBinder(function(e){
                run2 = e;
            });
            var stream3 = Bacon.fromBinder(function(e){
                run3 = e;
            })
            var stream4 = Bacon.fromBinder(function(e){
                run4 = e;
            });
            var stream5 = Bacon.fromBinder(function(e){
                run5 = e;
            })
            
            
            stream1.merge(stream2).merge(stream3).merge(stream4).merge(stream5).onValue(function(e){
                called++;

                if(called>999){
                    red.resolve();
                }
            });

    	   utils.repeat(1000, function(x){
                var mod = x%5;
                switch(mod){
                	case 1:
                		run2(x)
                	break;
                	case 2:
                		run3(x)
                	break;
                	case 3:
                		run4(x)
                	break;
                	case 4:
                		run5(x)
                	break;
                	case 0:
                		run1(x)
                	break;
                }
            });
        }
    }
  ]
};