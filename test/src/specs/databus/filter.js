describe('.filter()', function () {  
	var equals = {
		i: 0,
		s: 's',
		b: true,
		a: [1,2,3]
	}

	bus.filter(function(x){
		return x > 100;
	}).listen(function(e){
		filtered.passed = true;
	});

	bus.filter(function(x){
		return x <= 100;
	}).listen(function(e){
		filtered.passed = false;
	});



	it('-- passed', function (done) {     
		sync.transmit(101);
	    expect(filtered.passed).toBe(true);
	    done();
    }); 

    it('-- not passed', function (done) {     
		sync.transmit(10);
	    expect(filtered.passed).toBe(false);
	    done();
    });


    (function(){
    	var run;
    	var bus = Warden.Stream(function(fire){
    		run = fire
    	});

    	bus.filter(0).listen(function(){
			filtered.i = true;
		});

		bus.filter('s').listen(function(){
			filtered.s = true;
		});

		bus.filter(true).listen(function(){
			filtered.b = true;
		});

		bus.filter([1,2,3]).listen(function(){
			filtered.a = true;
		});


		var filtered = {}; 

		it('-- number (equality)', function (done) {     
			run(55);
		    expect(filtered.i).not.toBe(true);
		    run(0);
		    expect(filtered.i).toBe(true);
		    done();
	    }); 


		it('-- string (equality)', function (done) {     
			run('soso');
		    expect(filtered.s).not.toBe(true);
		    run('s');
		    expect(filtered.s).toBe(true);
		    done();
	    }); 


		it('-- bool (equality)', function (done) {     
			run(false);
		    expect(filtered.b).not.toBe(true);
		    run(true);
		    expect(filtered.b).toBe(true);
		    done();
	    }); 


		it('-- arr (equality)', function (done) {     
			run([1,2,3]);
		    expect(filtered.a).not.toBe(true);
			run([1,2,3,4]);
		    expect(filtered.a).not.toBe(true);
		    done();
	    }); 

    })();
});


describe('.filterFor()', function () {   
	var run;
	var bus = Warden.Stream(function(fire){
		run = fire
	});
	var res;
	var max;


	bus.filterFor(function(e, p){
  		var taken = p.get();

  		if(taken && taken.indexOf(e)>=0){
  			p.stop();
  		}else{
  			p.next(e, function(data, val){
	    		if(typeof data == 'object') { 
	      			data.push(val); 
	      			return data; 
	      		} else {
	      			return [val]
	      		} 
	      	});
	     }
	}).listen(function(e){
		res = e;
	});

	it('-- unique ', function (done){
		run(1);
		expect(res).toEqual(1);

		run(1);
		expect(res).toEqual(1);

		run(2);
		expect(res).toEqual(2);

		run(1);
		expect(res).toEqual(2);
		
		run(3);
		expect(res).toEqual(3);

		run(12);
		expect(res).toEqual(12);

		run(1);
		run(2);
		run(3);
		expect(res).toEqual(12);
		done();
	});

	it('-- maximal ', function (done){
		var bm;
		bus.filterFor(function(e, p){
			var max = p.get();

			if(max && max >= e){
				p.stop();
			}else{
				p.next(e);
			}
		}).listen(function(e){
			bm = e;
		});

		run(1);
		expect(bm).toBe(1);
		run(100)
		expect(bm).toBe(100);
		run(10)
		expect(bm).toBe(100);
		run(40)
		expect(bm).toBe(100);
		run(430)
		expect(bm).toBe(430);
		done();
	});
});