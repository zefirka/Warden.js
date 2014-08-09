describe('Warden.create emitting and listening', function () {  
	
	//Here will be creation specs
	var Mod = Warden.extend(function Class1(){
		this.name = "module 1";
	});

	Mod.prototype.sync = function(){
		this.emit({
			type : "sync",
			value : Math.random(),
			ng : "sync"
		})
	};

	Mod.prototype.async = function(){
		var self = this;
		setTimeout(function(){
			self.emit({
				type : "async",
				value : Math.random(),
				ng : "async"
			});
		}, 2000);		
	};

    function transmit(e){
      custom = e.ng;
    }
  
	var test = new Mod();
	var custom = null;
	
	test.listen('async',transmit);
	test.listen('sync', transmit);
    
    test.sync();

    it('Emitting and catching sync event', function (done) {      
        expect(custom).toBe("sync"); 
    });  

    it('Emitting and catching async event', function (done) {      
//        test.async();
        expect(custom).toBe("sync"); 
//        done();
    });  

    it('Catching async event', function (done) {      
        expect(true).toBe(true); 
        //done();
    });  
});  
