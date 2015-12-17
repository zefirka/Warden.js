

describe('Warden streams: synchronious', function () {  

	var sync = {}, value = 0, val2 = 0, mapped = 0;

	var bus = Warden.Stream(function(trigger){
		this.start = function(){
			trigger(1);
		}
		this.transmit = function(val){
			trigger({
				data: val
			});
		}
	}, sync)

	bus.listen(function(data){
		value = data;
	});

	bus.listen(function(data){
		val2 = data.data;
	});

	bus.grep('.data').listen(function(e){
		mapped = e;
	});

	it('Sync: listening custom data stream (string)', function (done) {      
		sync.start();
    	expect(value).toBe(1); 
    	done();
    });  

	it('Sync: listening custom data stream (object)', function (done) {     
		sync.transmit(200);
	    expect(val2).toBe(200);
	    done();
    }); 

    it('Sync: mapping custom data stream (object)', function (done) {     
		sync.transmit(500);
	    expect(mapped).toBe(500);
	    done();
    }); 
});

describe('Warden.Stream: asynchronious', function () {  

	var async = {}, value = 0, avalue = 0;

	beforeEach(function(done){
		Warden.Stream(function(trigger){
			this.start = function(){
				setTimeout(function(){
					trigger(1);
					done();	
				}, 100);
				
			}
		}, async).listen(function(data){
			avalue = data;
		});
		async.start();
	});	
	
	it('Async: listening custom data stream', function (done) {      
    	expect(avalue).toBe(1); 
    	done();
    });      
});

