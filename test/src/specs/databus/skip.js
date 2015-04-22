describe('.skip()', function () {  
	var emitted = 0;	
	
	it('-- integer 2', function (done) {     			
		bus.skip(2).listen(function(){
			emitted ++;
		});

	    sync.transmit(0);
	    sync.transmit(0);
	    sync.transmit(0);
	    expect(emitted).toBe(1);
	    done();
    });

    it('-- integer 200', function (done) {     			
		var em = 0, c = 200;
		
		bus.skip(c).listen(function(){
			em ++;
		});

		while(c-- >= 0){
			sync.transmit(0);	
		}
	    
	    
	    expect(em).toBe(1);
	    done();
    });
});