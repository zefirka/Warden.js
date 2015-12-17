const Warden = require('../../dist/warden.min.js');

describe('Configure', function(){
	var run;

	var stream = Warden.Stream(function(fire){
			run = fire;
		});
		
	Warden.configure.addToStream('first', function(){
		return function(event, pipe){
			if(Warden.Utils.is.exist(event[0])){
				pipe.next(event[0])
			}else{
				pipe.stop();
			}
		}
	});

	Warden.configure.addToStream('unlazy', function(){
		return function(event, pipe){
			if(typeof event == 'object'){
				pipe.next(event.map(function(fn, i){
					return fn(i)
				}));
			}else{
				pipe.stop()
			}
		}
	});

	Warden.configure.addToStream('equals', function(value){
		return function(event, pipe){
			if(event == value){
				pipe.next(event)
			}else{
				pipe.stop();
			}
		}
	});

	Warden.configure.addToStream('mul', function(val){
		return function(event, pipe){
			pipe.next(event * val);			
		}
	});

	Warden.configure.addToStream('myMerge', function(bus){
		var self = this;
		return Warden.Stream(function(fire){
			self.listen(fire);
			bus.listen(fire);
		});
	}, true);

	it(':: first', function(done){
		var res = 0;

		stream.first().listen(function(val){
			res = val;
		});

		run([12, 30]);

		expect(res).toBe(12);
		done();
	});

	it(':: unlazy', function(done){
		var res = [0, 0, 0];

		stream.unlazy().listen(function(val){
			res = val;
		});

		run([function(i){ return i}, function(i){ return i*2}, function(i){ return i*i}]);


		expect(res).toEqual([0,2,4]);
		done();
	});


	it(':: mul', function(done){
		var res = 0;

		stream.mul(10).listen(function(val){
			res = val;
		});

		run(10);

		expect(res).toBe(100);
		done();
	});

	it(':: myMerge', function(done){
		var res = [];

		var run2;

		var stream2 = Warden.Stream(function(f){
			run2 = f;
		})

		stream.myMerge(stream2).listen(function(val){
			res.push(val);
		});

		run(1);
		run(2);
		run2(3);
		run2(4);

		expect(res).toEqual([1,2,3,4]);
		done();
	});

	it('Warden.configure.isStream', function(done){
		expect(Warden.configure.isStream(stream)).toBe(true);
		expect(Warden.configure.isStream({})).toBe(false);
		done();
	});

});

