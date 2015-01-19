describe('.take()', function () {  
	bus.take(2).listen(function(){
		taken ++;
	});


	it('-- integer', function (done) {     			
	    sync.transmit(0);
	    sync.transmit(0);
	    sync.transmit(0);
	    expect(taken).toBe(2);
	    done();
    });

});