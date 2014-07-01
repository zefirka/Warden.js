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
	}

	var mod1 = new Class1()
	
	var result = false;
	var transmitted = null;

	mod1.on('custom', function(e){
		result = true;
		transmitted = e.gen;
	});

	mod1.fn();

    it('Emitting and catching event', function (done) {      
        expect(result).toBe(true); 
        done();
    });  

    it('Catching event transmission value', function (done) {      
        expect(transmitted).toBe("some"); 
        done();
    });  

});  
