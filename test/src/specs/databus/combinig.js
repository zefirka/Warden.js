describe('Combining methods ', function () {  		
	it('-- merge', function (done) { 
		var cl = [];

		var bus1 = Warden.Stream().map('One'),
			bus2 = Warden.Stream().map('Two'),
			merged = bus1.merge(bus2);

		merged.listen(cl.push.bind(cl));
		
		bus1.fire();
		bus2.fire();

		expect(cl).toEqual(['One', 'Two']);
		merged.lock();
		done();
	});

	it('-- merge 2 and more', function (done) { 
		var cl;

		var bus1 = bus.filter(function(x){return x==1}).map('One'),
			bus2 = bus.filter(function(x){return x==0}).map('Two'),
			bus3 = bus.filter(function(x){return x==2}).map('Three'),
			merged = bus1.merge(bus2, bus3);

		merged.reduce([],function(a,b){
			a.push(b);
			return a;
		}).listen(function(x){
			cl = x;
		});

		sync.transmit(2);
		sync.transmit(1);
		sync.transmit(0);

		expect(cl).toEqual(['Three', 'One', 'Two']);
		merged.lock();
		done();
	});

	it('-- resolve (bigger)', function (done) {
		var cl;

		var bus1 = bus.filter(function(x){return x.one}).map(10),
			bus2 = bus.filter(function(x){return x.two}).map(20),
			produced = bus1.resolve(bus2, function(a,b){
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

	it('-- resolve (smaller)', function (done) {
		var cl;

		var bus1 = bus.filter(function(x){return x.one}).map(30),
			bus2 = bus.filter(function(x){return x.two}).map(20),
			produced = bus1.resolve(bus2, function(a,b){
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


	it('-- resolve (first is earlier)', function (done) {
		var cl;
		var time = function(d){
			d.time = (new Date()).getTime();
			return d;
		}

		var bus1 = bus.filter(function(x){return x.one}).map(time),
			bus2 = bus.filter(function(x){return x.two}).map(time),
			produced = bus1.resolve(bus2, function(a,b){
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

	it('-- resolve (second is earlier)', function (done) {
		var cl;

		bus.map(function(d){
			d.time = (new Date()).getTime();
			return d;
		});

		var bus1 = bus.filter(function(x){return x.one}),
			bus2 = bus.filter(function(x){return x.two}),
			produced = bus1.resolve(bus2, function(a,b){
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


	it('-- combine (+)' ,function (done){
		var sum = 0;

		var host1 = Warden.Stream(),
			host2 = Warden.Stream();

		var bus1 = host1.map(10),
			bus2 = host2.map(20),
			combined = bus1.combine(bus2, function(a,b){
				return a + b;
			}, 0).listen(function(res){
				sum = res;
			});

			host1.fire();
			expect(sum).toBe(10);
			host2.fire();
			expect(sum).toBe(30);
			host2.fire();
			host1.fire();
			expect(sum).toBe(30);

			done();
	});

	it('-- alternately', function (done) { 
		var cl = [];

		var bus1 = bus.filter(1).map(1),
			bus2 = bus.filter(2).map(2),
			alternately = bus1.alternately(bus2);

		alternately.listen(function(x){
			cl.push(x);
		});

		sync.transmit(1);
		sync.transmit(1);
		sync.transmit(1);
		sync.transmit(2);
		sync.transmit(2);
		sync.transmit(1);
		sync.transmit(2);

		
		expect(cl).toEqual([1,2,1,2]);
		done();
		
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

	it('-- sync 4 streams (with intreval of 300 ms);', function (done) { 
		var cl;

		var bus1 = bus.filter(function(x){return x==1}).map('a'),
			bus2 = bus.filter(function(x){return x==2}).map('b'),
			bus3 = bus.filter(function(x){return x==3}).map('c'),
			bus4 = bus.filter(function(x){return x==4}).map('d'),			
			synced = bus1.sync(bus2, bus3, bus4);

		synced.listen(function(x){
			cl = x;
		});

		sync.transmit(1);
		setTimeout(function(){
			sync.transmit(2);	
			setTimeout(function(){
				sync.transmit(3);
				setTimeout(function(){
					sync.transmit(4)
					expect(cl).toEqual(['a', 'b', 'c', 'd']);
					synced.lock();
					done();
				}, 300);
			}, 300);
		}, 300)
		
	});

});