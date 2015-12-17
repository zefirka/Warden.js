const Warden = require('../../dist/warden.min.js');

describe('Warden.extend', function(){

	describe('Using constructors', function () {  
		var Ajax = Warden.extend(function Ajax(name){
			this.name = name;
		});
	
		Ajax.prototype.sync = function(){
			var self = this;
			this.emit({
				type : "sync",
				name : self.name,
			})
		};
	
		Ajax.prototype.load = function(){
			var self = this;
			setTimeout(function(){
				self.emit({
					type: "load",
					name: self.name
				});
			});
		};
	
		var Mod = Warden.extend(function Class1(name){
			this.name = name;
			this.value = 200;
		});
	
		Mod.prototype.sync = function(){
			var self = this;
			this.emit({
				type : "sync",
				value : Math.random(),
				name : self.name,
				ng : "sync"
			})
		};
	
		Mod.prototype.async = function(){
			this.emit({
				type : "async",
				value : Math.random(),
				ng : "async"
			})
		};
	
		describe('Emitting and listening sync events', function () {  
			var test = new Mod();
			var custom = null;	
			function transmit(e){
		      custom = e;
		    }
	
			test.listen('sync', transmit);
		    
		    beforeEach(function(done) {
			    test.sync();
			    done();
			});
	
		    it('Emitting and catching sync event', function (done) {      
		    	expect(custom.ng).toBe("sync"); 
		    	done();
		    });  
	
		    it('Transmitting data', function (done) {      
		    	expect(custom.value).not.toBe(null); 
		    	done();
		    });  
		});  
	
		describe('Incapsulation', function () {  
			var t1 = new Mod("Foo");
			var t2 = new Mod("Bar")
	
			var res1, res2;
	
			t1.listen("sync", function(e){
		      	res1 = e;
		      	res1.ctx = this;
		    });
		    t2.listen("sync", function(e){
		      	res2 = e;
		      	res2.ctx = this;
		    });
			
		    
		    beforeEach(function(done) {
			    t1.sync();
			    t2.sync();
			    done();
			});
	
		    it('Emitting and catching sync event', function (done) {      
		    	expect(res1.ng).toBe("sync"); 
		    	expect(res1.ctx).not.toBe(res2.ctx); 
		    	expect(res1.ctx.name).not.toBe(res2.ctx.name); 
		    	done();
		    });  
	
		    it('Transmitting data', function (done) {      
		    	expect(res1.name).toBe('Foo'); 
		    	expect(res2.name).toBe('Bar'); 
		    	done();
		    });  
	
		    it('Context transmitting', function (done) {      
		    	expect(res1.ctx.name).toBe(res1.name); 
		    	expect(res2.ctx.name).toBe(res2.name); 	    	
		    	expect(res1.ctx).toBe(t1); 
		    	expect(res2.ctx).toBe(t2); 
		    	done();
		    });  
		}); 
	
		describe('Different classes', function () {  
			var t1 = new Mod("Foo");
			var t2 = new Ajax("Bar")
	
			var res1, res2;
	
			t1.listen("sync", function(e){
		      	res1 = e;
		      	res1.ctx = this;
		    });
		    t2.listen("sync", function(e){
		      	res2 = e;
		      	res2.ctx = this;
		    });
			
		    
		    beforeEach(function(done) {
			    t1.sync();
			    t2.sync();
			    done();
			});
	
		    it('Emitting and catching sync event', function (done) {      
		    	expect(res1.ng).toBe("sync"); 
		    	expect(res1.ctx).not.toBe(res2.ctx); 
		    	expect(res1.ctx.name).not.toBe(res2.ctx.name); 
		    	done();
		    });  
	
		    it('Transmitting data', function (done) {      
		    	expect(res1.name).toBe('Foo'); 
		    	expect(res2.name).toBe('Bar'); 
		    	done();
		    });  
	
		    it('Context transmitting', function (done) {      
		    	expect(res1.ctx.name).toBe(res1.name); 
		    	expect(res2.ctx.name).toBe(res2.name); 	    	
		    	expect(res1.ctx).toBe(t1); 
		    	expect(res2.ctx).toBe(t2); 
		    	done();
		    });  
		}); 
	});
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
	describe('Using arrays', function () {  
		var array = Warden.extend([1,2,3,4,5]);
	
		describe('Emitting and listening', function () {  
			var custom = null;
	
			array.listen('push', function(data){
				custom = data;
			});
	
		    it('Emitting and catching sync event', function (done) {      
		    	array.push('ng');
		    	expect(custom.data[0]).toBe("ng"); 
		    	done();
		    });  
	
		});
	
		it('- sequentially', function (done) {      
			var res = [];
			
			Warden([0,1,2,3]).sequentially(200).map(function(e){ return e*2}).listen(function(val){
				res.push(val);
			});
	
			
			expect(res).toEqual([]); 
	
			setTimeout(function(){
				expect(res[0]).toBe(0); 
				expect(res).toEqual([0]);
	
				setTimeout(function(){
					expect(res[1]).toBe(2); 
					expect(res).toEqual([0, 2]);
	
					setTimeout(function(){
						expect(res).toEqual([0, 2, 4, 6]);
						done();
					}, 1400)
				}, 210);
	
			}, 210);
	
			
		});
	
		it('- repeatedly', function (done) {      
			var res = [];
			
			Warden([0,1,2,3]).repeatedly().map(function(e){ return e*2}).listen(function(val){
				res.push(val);
			});
			
	
			setTimeout(function(){
				expect(res).toEqual([0, 2, 4, 6]);
				done();
			}, 10)
			
	
			
		});
	
		it('- own properties', function (done) {      
			var owns = [];
			for(var prop in Warden([1,2,3])){
				owns.push(prop);
			}
			expect(owns.indexOf('stream')).toBe(-1)
			expect(owns.indexOf('emit')).toBe(-1)
			expect(owns.indexOf('listen')).toBe(-1)
			expect(owns.indexOf('unlisten')).toBe(-1)
			expect(owns.indexOf('push')).toBe(-1)
			expect(owns.indexOf('pop')).toBe(-1)
			expect(owns.indexOf('sort')).toBe(-1)
			expect(owns.indexOf('slice')).toBe(-1)
			expect(owns.indexOf('splice')).toBe(-1)
			expect(owns.indexOf('reverse')).toBe(-1)
			expect(owns.indexOf('shift')).toBe(-1)
			expect(owns.indexOf('unshift')).toBe(-1)
	
			done();
		});
	
	});
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
	
		it('Unlistening all handlers by @event name', function(done){
			data = {};
	
			obj.listen('haarz', function(e){
				data.val = e.val;
			});
			obj.listen('haarz', function(e){
				data.dal = e.dal;
			});
	
			obj.push({type: 'haarz', val: 123, dal:332});
			
	
			expect(data.val).toBe(123);
			expect(data.dal).toBe(332);
	
			obj.unlisten('haarz');
			
			obj.push({type: 'haarz', val: 333, dal:666});
	
			expect(data.val).toBe(123);
			expect(data.dal).toBe(332);
	
			done();
		});
	
	});
	describe('Security', function(){
			it('Overwriting', function(done){
				var obj = {listen: function foo(){}}
				function Constr(){}
				Constr.prototype.emit = function emit(){};
	
				var err = "", cerr = "";
				
				try{
					Warden.extend(obj);
				}catch(e){
					err = e;
				}
	
				try{
					Warden.extend(Constr);
				}catch(e){
					cerr = e;
				}
	
	
				expect(err).toEqual(new Error("Can't overwrite: foo of object"));
				expect(cerr).toEqual(new Error("Can't overwrite: emit of object"));			
				done();
			});
	
			it('Resolving conflict', function(done){
				var obj = {listen: function foo(){}}
				function Constr(){}
				Constr.prototype.emit = function emit(){};
	
	
				Warden.extend(obj, {names: {listen: 'lusten'}});
				Warden.extend(Constr, {names: {emit: 'emot'}});
				
				var f = new Constr();
	
				expect(typeof obj.lusten).toBe('function');
				expect(typeof f.emot).toBe('function');
	
				done();
			})
		});
	describe('Configuration', function(){
		function Pork(name){
			this.name = name;
		}
	
		Pork.prototype.greet = function(x){
			var self = this;
			return this.emit({
				type : 'greet',
				message : ['Hello!', x || 'My name is', self.name].join(' ') 
			});
		}
		
	});

});
