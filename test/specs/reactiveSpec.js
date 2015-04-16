describe('Reactive Programming', function(){
	var runa, runb;

	var a = Warden.Stream(function(fire){
		runa = fire;
	});

	var b = Warden.Stream(function(fire){
		runb = fire;
	});
		
	
	it('-- type operating', function(done){
		var res = 0;

		var x = a.map(10).watch();
		var y = b.map(20).watch();


		runa(); runb();

		expect(+x).toBe(10);
		expect(+y).toBe(20);
		expect(x+y).toBe(30);
		done();
	});

	it('-- formula: (+)', function(done){
		var res = 0;

		var cell = Warden.Formula([a, b], function(a, b){
			return a + b;
		});

		runa(12); 

		expect(+cell).toBe(12);

		runb(10);

		expect(+cell).toBe(22);

		done();
	});

	it('-- formula: (from taken)', function(done){
		var res = 0;

		runa(0);
		runb(0);

		var cell = Warden.Formula([a, b], function(a, b){
			return a + b;
		});

		runa(12); 
		expect(+cell).toBe(12);


		runb(10);
		expect(+cell).toBe(22);	
		done();
	

		
	});

	it('-- formula: (bigger)', function(done){
		var a = Warden(0),
			b = Warden(1);

		var bigger = Warden.Formula([a, b], function(x, y){
			return x > y ? x : y;
		});

		
		expect(bigger.value).toBe(1);
		a.value = 10;
		expect(bigger.value).toBe(10);
		b.value = 9;
		expect(bigger.value).toBe(10);
		b.value = 91;
		expect(bigger.value).toBe(91);

		done();

	});

});

