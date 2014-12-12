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

    it('-- type error catched', function (done) {
    	try{
			bus.take('string')
		}catch(err){
			takenError = err; 
		}
		expect(takenError).toBe('TypeError: unexpected type of argument at: .take(). Expected type: number. Your argument is type of: string');
		done();
    });
});