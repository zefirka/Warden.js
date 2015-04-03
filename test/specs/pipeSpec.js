describe('Pipeline', function(){
	var pipe = Warden.Pipeline(),
		res = 0;
		
		pipe.pipe(function(e, pipe){
			pipe.next(e*10);
		}).pipe(function(e, pipe){
			if(e > 100){
				pipe.stop();
			}else{
				pipe.next(e);
			}
		}).pipe(function(e, pipe){
			if(e == 50){
				setTimeout(function(){
					pipe.play();
					pipe.next('timed')
				}, 1000);
				pipe.pause();
			}else{
				pipe.next(e);
			}
		});

	it('breaked', function(done){
		pipe.start(11, {}, function(res){

		});

		expect(res).toBe(0);
		done();
	});

	it('next', function(done){
		pipe.start(3, {}, function(r){
			res = r
			expect(res).toBe(30);
			done();
		});
	});


	it('timed', function(done){
		pipe.start(5, {}, function(r){
			res = r
			expect(res).toBe('timed');
			done();
		});
	});	

});

