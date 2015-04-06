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

	it('- sequentially', function (done) {      
		var res = [];
		
		Warden([0,1,2,3]).sequentially(200).map(function(e){ return e*2}).listen(function(val){
			res.push(val);
		});

		
		expect(res).toEqual([]); 

		setTimeout(function(){
			expect(res[0]).toBe(0); 
			expect(res).toEqual([0]);

			setTimeout(function(){
				expect(res[1]).toBe(2); 
				expect(res).toEqual([0, 2]);

				setTimeout(function(){
					expect(res).toEqual([0, 2, 4, 6]);
					done();
				}, 1400)
			}, 210);

		}, 210);

		
	});

	it('- repeatedly', function (done) {      
		var res = [];
		
		Warden([0,1,2,3]).repeatedly().map(function(e){ return e*2}).listen(function(val){
			res.push(val);
		});
		

		setTimeout(function(){
			expect(res).toEqual([0, 2, 4, 6]);
			done();
		}, 10)
		

		
	});

});