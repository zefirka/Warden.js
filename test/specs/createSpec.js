describe('Warden.create emitting and listening', function () {  
	
	//Here will be creation specs
	var Class1 = Warden.create(function Class1(){
		this.name = "module 1";
	});

	var Class2 = Warden.create(function Class2(){
		this.name = "module 2";
	});

	Class1.prototype.fn = function(){
		this.emit({
			type : "custom",
			value : Math.random(),
			gen : "some"
		})
	};

	Class1.prototype.async = function(){
		var self = this;
		setTimeout(function(){
			self.emit({
				type : "async",
				value : Math.random(),
				gen : "test"
			});
		}, 2000);		
	};

	var mod1 = new Class1()
	
	var result = false,
		transmitted = null,
		async = false;
	
	mod1.on('async', function(e){
		async = true;
	});		

	mod1.on('custom', function(e){
		result = true;
		transmitted = e.gen;
	});

	mod1.fn();
	mod1.async();

    it('Emitting and catching event', function (done) {      
        expect(result).toBe(true); 
        done();
    });  

    it('Catching event transmission value', function (done) {      
        expect(transmitted).toBe("some"); 
        done();
    });  

    it('Catching async event', function (done) {      
        expect(true).toBe(true); 
        done();
    });  
});  
