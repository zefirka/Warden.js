describe('Using JS objects', function () {  
	var objc1 = {
		val : 10,
		sync : function(){
			var self = this;
			this.emit({
				type: "sync",
				ng: 'sync',
				val: self.val
			});
		}
	}

	var objc2 = {
		val : 20,
		sync : function(){
			var self = this;
			this.emit({
				type: "sync",
				ng: 'sync',
				val: self.val
			});
		}
	}

	var obj1 = Warden.extend(objc1);
	var obj2 = Warden.extend(objc2);

	describe('Emitting and listening sync events', function () {  
		var custom = null;	
		function transmit(e){
	      custom = e;
	    }

		obj1.listen('sync', transmit);
	    
	    beforeEach(function(done) {
		    obj1.sync();
		    done();
		});

	    it('Emitting and catching sync event', function (done) {      
	    	expect(custom.ng).toBe("sync"); 
	    	done();
	    });  

	    it('Transmitting data', function (done) {      
	    	expect(custom.val).not.toBe(null); 
	    	expect(custom.val).toBe(10); 
	    	done();
	    });  
	});

	describe('Different objects', function(){
		var a = Warden.extend({
				foo : 'bar'
		}),
			b = Warden.extend({
				foo : 'baz'
		});

		var data = {
			a: 0,
			ab : 0,
			b: 0,
			ba : 0
		}

		a.listen('a', function(x){
			data.a = x;
		}).listen('b', function(x){
			data.ab = x;
		});

		b.listen('a', function(x){
			data.ba = x;
		}).listen('b', function(x){
			data.b = x;
		});

		it('One data two events', function(done){
			a.emit('a');
			a.emit('b');
			expect(data.a).toBe('a');
			expect(data.ab).toBe('b');
			done();
		});

		it('Two data two events', function(done){
			a.emit('a');
			b.emit('b');
			expect(data.a).toBe('a');
			expect(data.b).toBe('b');
			done();
		});
		
	});

	describe('Emitting and listening events by regexs', function () {  
		var mod = Warden.extend({}),
			catched = [];

		mod.listen('cl[io]ck', function(e){
			catched.push(e);
		});

		mod.listen('rom*', function(e){
			catched.push(e);
		});

		it('Two data two events', function(done){ 
			mod.emit('click', 'click')
			mod.emit('clock', 'clock')
			mod.emit('clack', 'clack')
			mod.emit('romarg', 'romarg')

			expect(catched).toEqual(['click', 'clock', 'romarg']);

			done()
		});

		catched = [];

	});

});