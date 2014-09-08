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

    it('-- type error catched', function (done) {
    	var skipError;
    	try{
			bus.skip(function(){})
		}catch(err){
			skipError = err; 
		}
		expect(skipError).toBe('TypeError: unexpected type of argument at: .skip(). Expected type: number. Your argument is type of: function');
		done();
    });
});