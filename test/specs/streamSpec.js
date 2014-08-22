describe('Warden.makeStream: synchronious', function () {  

	var sync = {}, value = 0, avalue = 0;

	Warden.makeStream(function(trigger){
		this.start = function(){
			trigger(1);
		}
	}, sync).get().listen(function(data){
		value = data;
	});

	sync.start();

	it('Sync: listening custom data stream', function (done) {      
    	expect(value).toBe(1); 
    	done();
    });  
    
});

