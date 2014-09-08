describe('.interpolate() and .mask()', function () {  		
	it('-- interpolate', function (done) {
		var res = "", str = "Hello, {{val}}!";     			
		bus.interpolate(str).listen(function(e){
			res = e;
		});
		
	    sync.transmit({
	    	val: "world"}
	    );

	    expect(res).toBe("Hello, world!");
	    done();
    });

	it('-- mask', function (done) {
		var res = "", str = "Hello, {{val}}!";     			
		var b = bus.mask({
			val: 'world'
		}).listen(function(e){
			res = e;
		});
		
	    sync.transmit(str);

	    expect(res).toBe("Hello, world!");
	    b.lock();
	    done();
    });
});