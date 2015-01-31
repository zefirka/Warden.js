describe('Lock/Unlock methods ', function () {
	var Context = {
		syncemitted: 0,
		syncLastValue: 0
	};
	var Stream = Warden.makeStream(function(trigger){
		this.sync = function(value){
			trigger(value);
		}

		this.async = function(time, value){
			setTimeout(function(){
				trigger(value);
			}, time);
		}
	}, Context);

	it('-- locking and unlocking simple listened bus', function (done) { 
		var bus = Stream.bus();
		bus.listen(function(x){
			Context.syncemitted++
			Context.syncLastValue = x;
		});

		Context.sync(10);
		Context.sync(10);
		Context.sync(20);

		bus.lock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(30);

		expect(Context.syncemitted).toBe(3);
		expect(Context.syncLastValue).toBe(20);

		bus.unlock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(10);
		expect(Context.syncemitted).toBe(6);
		expect(Context.syncLastValue).toBe(10);

		bus.lock();
		done();
	});

	it('-- locking and unlocking difference buses', function (done) { 
		var bus1 = Stream.bus(),
			bus2 = Stream.bus();

		var b1 = {t: 0,v: 0},
			b2 = {t: 0,v: 0}

		bus1.listen(function(x){
			b1.t++
			b1.v = x;
		});

		bus2.listen(function(x){
			b2.t++
			b2.v = x;
		});

		Context.sync(10);
		Context.sync(10);
		Context.sync(20);

		expect(b1.t).toBe(3);
		expect(b1.v).toBe(20);
		expect(b2.t).toBe(3);
		expect(b2.v).toBe(20);

		bus1.lock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(30);

		expect(b1.t).toBe(3);
		expect(b1.v).toBe(20);
		expect(b2.t).toBe(6);
		expect(b2.v).toBe(30);

		bus2.lock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(10);
		
		expect(b1.t).toBe(3);
		expect(b1.v).toBe(20);
		expect(b2.t).toBe(6);
		expect(b2.v).toBe(30);

		bus1.unlock();						

		Context.sync(10);
		Context.sync(10);
		Context.sync('test');

		expect(b1.t).toBe(6);
		expect(b1.v).toBe('test');
		expect(b2.t).toBe(6);
		expect(b2.v).toBe(30);

		bus2.unlock();

		Context.sync(10);
		Context.sync(10);
		Context.sync('10');

		expect(b1.t).toBe(9);
		expect(b1.v).toBe('10');
		expect(b2.t).toBe(9);
		expect(b2.v).toBe('10');

		bus1.lock();
		bus2.lock();
		done();
	});

	
	it('-- locking all children', function (done) { 
		var parent = Stream.bus(),
				child1 = parent.map('c1'),
				child2 = parent.map('c2'),
				childChild1 = child1.map('cc1');

		var p = 0, c1 = 0, c2 = 0, cc1 = 0;

		var clear = function(){p = 0, c1 = 0, c2 = 0, cc1 = 0;}

		parent.listen(function(x){p=x;});
		child1.listen(function(x){c1 = x;});
		child2.listen(function(x){c2 = x;});
		childChild1.listen(function(x){cc1 = x;});

		Context.sync(666);

		expect(p).toBe(666);
		expect(c1).toBe('c1');
		expect(c2).toBe('c2');
		expect(cc1).toBe('cc1');

		clear();

		expect(p).toBe(0);
		expect(c1).toBe(0);
		expect(c2).toBe(0);
		expect(cc1).toBe(0);

		parent.lock();

		Context.sync(666);

		expect(p).toBe(0);
		expect(c1).toBe('c1');
		expect(c2).toBe('c2');
		expect(cc1).toBe('cc1');

		clear();

		parent.lockChildren();

		Context.sync(666);

		expect(p).toBe(0);
		expect(c1).toBe(0);
		expect(c2).toBe(0);
		expect(cc1).toBe(0);

		clear();

		parent.unlock();

		Context.sync(666);

		expect(p).toBe(666);
		expect(c1).toBe(0);
		expect(c2).toBe(0);
		expect(cc1).toBe(0);			

		done();
	});
});