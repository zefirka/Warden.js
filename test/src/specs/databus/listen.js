describe('Listening/muting()', function () {  
    /* Mappings: integer */
    var run;
	var bus = Warden.Stream(function(fire){
		run = fire;
	})

	var val = 0;



	it('-- .listen(lambda)', function (done) {     
		bus.listen(function(e){
			val = e;
		});

		run(10);

	    expect(val).toBe(10);
	    done();
    }); 

	it('-- .listen(named)', function (done) {     
		function callback(e){
			val = e;
		}
		bus.listen(callback);

		run(13);

	    expect(val).toBe(13);
	    done();
    }); 

    it('-- .mute(named)', function (done) {     
		var j = 0;
		function named(e){
			j = e;
		}
		bus.listen(named);

		run(14);

		bus.mute(named);

		run(99);
		expect(j).toBe(14);
		done();	
		
    }); 

    it('-- .mute(unnamed)', function (done) {     
		var d = 0;
		var x = function(e){
			d = e;
		}
		bus.listen(x);

		run(999);

		bus.mute(x);

		run(111);
		expect(d).toBe(999);
		done();	
		
    }); 


    it('-- .mute(string)', function (done) {     
		var r = 0;
		function rnamed(e){
			r = e;
		}
		bus.listen(rnamed);

		run(344);

		bus.mute('rnamed');

		run(99);
		expect(r).toBe(344);
		done();	
		
    }); 

    it('-- .clear()', function (done) {     
		var a = 0,
			b = 0;
		
		bus
			.listen(function(){
				a = 10;
			})
			.listen(function(){
				b = 20;
			})

		run();

		expect(a).toBe(10);
		expect(b).toBe(20);

		run();
		

		a = 0;
		b = 0;

		bus.clear();

		expect(a).toBe(0);
		expect(b).toBe(0);


		done();	
		
    }); 

});