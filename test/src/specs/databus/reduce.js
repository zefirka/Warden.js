describe('.reduce()', function () {  
	_clear();

	function isInReduce(d){
		return d.reduce ? true : false;			
	}

	var asReduce = bus.filter(isInReduce).grep('.val')

	asReduce
	.reduce(0, function(a,b){
		return a + b;
	}).listen(function(e){
		reduced.first = reduced.first || e;
		reduced.sum = e;
	});

	asReduce
	.reduce('start', function(a,b){
		return a.toString() + ":" + b.toString();
	}).listen(function(e){
		reduced.str = e;
	});


	asReduce
	.reduce(0, function(a,b){
		return a > b ? a : b;
	})
	.listen(function(e){
		reduced.sort = e;
	})

	sync.transmit({reduce : true,val : 20});
	sync.transmit({reduce : true,val : 20});
	sync.transmit({reduce : true,val : 20});
	sync.transmit({reduce : true,val : 40});
	

    it('-- once', function (done) {     			
	    expect(reduced.first).toBe(20);
	    done();
    }); 
    
    it('-- sum', function (done) {     			
	    expect(reduced.sum).toBe(100);
	    done();
    }); 

    it('-- string', function (done) {     			
	    expect(reduced.str).toBe("start:20:20:20:40");
	    done();
    }); 

	it('-- sort', function (done) {     			
	    expect(reduced.sort).toBe(40);
	    done();
    }); 

	(function(){

		var run;
		var bus = Warden.Stream(function(f){
			run = f;
		})

	    it('--in initial value', function (done){
	    	var gres = 0;

	    	bus.reduce(100, function(a, b){
	    		return a + b;
	    	}).listen(function(res){
	    		gres = res;
	    	})

	    	run(0);
	    	run(10);
	    	run(20);
	    	run(30);

	    	expect(gres).toBe(160);
	    	done();
	    });

	    it('--no initial value', function (done){
	    	var gres = 0;

	    	bus.reduce(function(a, b){
	    		return a + b;
	    	}).listen(function(res){
	    		gres = res;
	    	})

	    	run(0);
	    	run(10);
	    	run(20);
	    	run(30);

	    	expect(gres).toBe(60);
	    	done();
	    });


	    it('--map after reduce', function (done){
	    	var res = 0;
	    	var run;
	    	var bus = Warden.Stream(function(e){
	    		run = e;
	    	});

	    	bus.reduce(function(a,b){
	    		return a + b;
	    	}).map(Math.round).listen(function(x){
	    		res = x;
	    	})

	    	run(0.1)
	    	run(0.1)
	    	run(0.1)
	    	run(0.1)

	    	expect(res).toBe(0);

	    	run(0.1)
	    	run(0.1)

	    	expect(res).toBe(1);
	    	
	    	done();
	    });

	})();
});