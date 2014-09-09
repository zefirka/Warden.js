describe('Combining methods ', function () {  		
	it('-- merge', function (done) { 
		var cl;

		var bus1 = bus.filter(function(x){return x==1}).map('One'),
			bus2 = bus.filter(function(x){return x==0}).map('Two'),
			merged = bus1.merge(bus2);

		merged.reduce([],function(a,b){
			a.push(b);
			return a;
		}).listen(function(x){
			cl = x;
		});

		sync.transmit(1);
		sync.transmit(0);

		expect(cl).toEqual(['One', 'Two']);
		merged.lock();
		done();
	});

	it('-- resolveWith (bigger)', function (done) {
		var cl;

		var bus1 = bus.filter(function(x){return x.one}).map(10),
			bus2 = bus.filter(function(x){return x.two}).map(20),
			produced = bus1.resolveWith(bus2, function(a,b){
				return a > b ? 'first' : 'second';
			});

		produced.listen(function(x){
			cl = x;
		});

		sync.transmit({one:true});
		sync.transmit({two:true});

		expect(cl).toBe('second');
		done();
	});

	it('-- resolveWith (smaller)', function (done) {
		var cl;

		var bus1 = bus.filter(function(x){return x.one}).map(30),
			bus2 = bus.filter(function(x){return x.two}).map(20),
			produced = bus1.resolveWith(bus2, function(a,b){
				return a > b ? 'first' : 'second';
			});

		produced.listen(function(x){
			cl = x;
		});

		sync.transmit({one:true});
		sync.transmit({two:true});

		expect(cl).toBe('first');
		done();
	});


	it('-- resolveWith (first is earlier)', function (done) {
		var cl;

		bus.setup(function(d){
			d.time = (new Date()).getTime();
			return d;
		});

		var bus1 = bus.filter(function(x){return x.one}),
			bus2 = bus.filter(function(x){return x.two}),
			produced = bus1.resolveWith(bus2, function(a,b){
				debugger;
				return a.time <= b.time ? 'first' : 'second';
			});

		produced.listen(function(x){
			cl = x;
		});

		sync.transmit({one:true});
		setTimeout(function(){
			sync.transmit({two:true});
			expect(cl).toBe('first');
			done();
		},10);
		
	});

	it('-- resolveWith (second is earlier)', function (done) {
		var cl;

		bus.setup(function(d){
			d.time = (new Date()).getTime();
			return d;
		});

		var bus1 = bus.filter(function(x){return x.one}),
			bus2 = bus.filter(function(x){return x.two}),
			produced = bus1.resolveWith(bus2, function(a,b){
				return a.time <= b.time ? 'first' : 'second';
			});

		produced.listen(function(x){
			cl = x;
		});

		sync.transmit({two:true});
		setTimeout(function(){
			sync.transmit({one:true});
			expect(cl).toBe('second');
			done();
		},10);
		
	});

	it('-- sync (with intreval of 300 ms);', function (done) { 
		var cl;

		var bus1 = bus.filter(function(x){return x==1}).map('a'),
			bus2 = bus.filter(function(x){return x==0}).map('b'),
			synced = bus1.sync(bus2);

		synced.listen(function(x){
			cl = x;
		});

		sync.transmit(1);
		setTimeout(function(){
			sync.transmit(0);	
			expect(cl).toEqual(['a', 'b']);
			synced.lock();
			done();
		}, 300)
		
	});

});