describe('Time methods ', function () {  		
	it('-- debounce (200 ms)', function (done) {
		var res = 0;
		
		var u = bus.debounce(200).listen(function(e){
			res++;
		});
		
	    sync.transmit(0); //res = 1
	    sync.transmit(0);
	    sync.transmit(0);
	    setTimeout(function(){
	    	sync.transmit(0); // res =2;
		    u.lock();
		    setTimeout(function(){
		    	expect(res).toBe(2);
		    	done();
		    }, 300);			    
	    }, 300);		    
    });

    it('-- collect (200 ms)', function (done) {
		var res = "";
		
		var u = bus.collect(200).listen(function(e){
			res = e;
		});
		
	    sync.transmit(0); 
	    sync.transmit(1); 
	    sync.transmit(2); 
	    setTimeout(function(){
	    	sync.transmit(0); // res =2;
		    u.lock();
	    	expect(res).toEqual([0,1,2]);
		    done();
	    }, 300);		    
    });

});