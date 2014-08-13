describe('Warden.extend: With constructors', function () {  

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

	describe('Warden.extend emitting and listening sync events', function () {  
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

	describe('Warden.extend incapsulation', function () {  
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

	describe('Warden.extend different classes', function () {  
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

describe('Warden.extend: With objects', function () {  

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

	describe('Warden.extend emitting and listening sync events', function () {  
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
});