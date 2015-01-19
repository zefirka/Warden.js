describe('.skip()', function () {  
	var emitted = 0;	
	
	it('-- integer', function (done) {     			
		bus.skip(2).listen(function(){
			emitted ++;
		});

	    sync.transmit(0);
	    sync.transmit(0);
	    sync.transmit(0);
	    expect(emitted).toBe(1);
	    done();
    });
});