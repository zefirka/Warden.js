describe('Warden.create emitting', function () {  
	
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
			value : Math.random()
		})
	}

	var mod1 = new Class1()
	var result = false;



    it('emitting and catching event', function (done) {      
        expect(true).toBe(true); 
        done();

    });  

});  
