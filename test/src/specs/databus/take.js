describe('.take()', function () {  
	bus.take(2).listen(function(){
		taken ++;
	});

	bus.take(function(x){
		return x === 'takenFilter';
	}).listen(function(){
		takenFilter = true;
	})



	it('-- integer', function (done) {     			
	    sync.transmit(0);
	    sync.transmit(0);
	    sync.transmit(0);
	    expect(taken).toBe(2);
	    done();
    });

    it('-- function', function (done) {     			
	    sync.transmit('takenFilter');
	    expect(takenFilter).toBe(true);
	    done();
    });

    it('-- type error catched', function (done) {
    	try{
			bus.take('string')
		}catch(err){
			takenError = err; 
		}
		expect(takenError).toBe('TypeError: unexpected type of argument at: .take(). Expected type: function or number. Your argument is type of: string');
		done();
    });
});