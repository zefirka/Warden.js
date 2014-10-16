describe('Listening and unlistening', function(){
	var data = null;

	var obj = Warden.extend({
		push : function(x){
			this.emit(x);
		}
	});

	it('Listening', function(done){
		obj.listen('foo', function foobar(e){
			data = e.bar;
		});

		obj.push({
			type: 'foo',
			bar: 'baz'
		});

		expect(data).toBe('baz');
		done();
	});

	it('Listening from closure', function(done){
		var tx = 0;

		expect(obj.$$handlers).not.toBe(null);
		obj.listen('zor', function test(x){
			tx = x;
		});
		obj.push('zor');
		obj.push({type: 'foo', bar: 'bort'});

		expect(tx).toBe('zor');
		expect(data).toBe('bort');
		done();
	});


	it('Unlistening by @function name', function(done){
		obj.unlisten('foo', 'foobar');
		obj.push({type: 'foo', bar: 'buff'});
		expect(data).toBe('bort');
		done();
	});

});