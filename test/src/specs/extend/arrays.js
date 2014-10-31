describe('Using arrays', function () {  
	var array = Warden.extend([1,2,3,4,5]);

	describe('Emitting and listening', function () {  
		var custom = null;

		array.listen('push', function(data){
			custom = data;
		});

	    it('Emitting and catching sync event', function (done) {      
	    	array.push('ng');
	    	expect(custom.data[0]).toBe("ng"); 
	    	done();
	    });  

	});

});