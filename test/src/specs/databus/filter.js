describe('.filter()', function () {  
	bus.filter(function(x){
		return x > 100;
	}).listen(function(e){
		filtered.passed = true;
	});

	bus.filter(function(x){
		return x <= 100;
	}).listen(function(e){
		filtered.passed = false;
	});

		it('-- passed', function (done) {     
		sync.transmit(101);
	    expect(filtered.passed).toBe(true);
	    done();
    }); 

    it('-- not passed', function (done) {     
		sync.transmit(10);
	    expect(filtered.passed).toBe(false);
	    done();
    });

    it('-- type error catched', function (done) {
    	var filterError;
    	try{
			bus.filter(23)
		}catch(err){
			filterError = err; 
		}
		expect(filterError).toBe('TypeError: invalid arg in: .filter(). Expected: function. Your argument is type of: number');
		done();
    });
});
