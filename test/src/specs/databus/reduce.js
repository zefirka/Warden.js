describe('.reduce()', function () {  
	_clear();

	function isInReduce(d){
		return d.reduce ? true : false;			
	}

	var asReduce = bus.filter(isInReduce).map('.val')

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

    it('-- type error catched', function (done) {
    	var reduceError;
    	try{
			bus.reduce('string', 'dsds')
		}catch(err){
			reduceError = err; 
		}
		expect(reduceError).toBe('TypeError: unexpected type of argument at: .reduce(). Expected type: function. Your argument is type of: string');
		done();
    });
});