describe('Lock/Unlock methods ', function () {
	var Context = {
		syncemitted: 0,
		syncLastValue: 0
	};
	var Stream = Warden.Stream(function(trigger){
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
		

		Stream.listen(function(x){
			Context.syncemitted++
			Context.syncLastValue = x;
		});

		Context.sync(10);
		Context.sync(10);
		Context.sync(20);

		Stream.lock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(30);

		expect(Context.syncemitted).toBe(3);
		expect(Context.syncLastValue).toBe(20);

		Stream.unlock();

		Context.sync(10);
		Context.sync(10);
		Context.sync(10);
		expect(Context.syncemitted).toBe(6);
		expect(Context.syncLastValue).toBe(10);

		done();
	});

	it('-- locking and unlocking difference buses', function (done) { 
		var bus1 = Stream.stream(),
			bus2 = Stream.stream();

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

});