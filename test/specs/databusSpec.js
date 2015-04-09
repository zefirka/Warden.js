describe('Warden Stream methods', function () {  
	var sync = {
			contextItem: 'hello context item',
			contextMethod: function(){
				return 'hello context method'
			}
		}, 
		value = 0, 
		mapped = {}, 
		filtered = {},
		reduced = {},
		taken = 0,
		_clear = function(){
			value = 0;
			mapped = {};
			filtered = {};
			reduced = {};
			taken = 0;
		},
		bus = Warden.makeStream(function(trigger){
			this.transmit = function(val){
				trigger(val);
			}
		}, sync).bus();

	/* Simple */
	bus.listen(function(data){
		value = data;
	});

	it('Simple', function (done) {
		sync.transmit(1);
		expect(value).toBe(1); 
		done();
	});
	describe('Listening/muting()', function () {  
	    /* Mappings: integer */
	    var run;
		var bus = Warden.Stream(function(fire){
			run = fire;
		})

		var val = 0;



		it('-- .listen(lambda)', function (done) {     
			bus.listen(function(e){
				val = e;
			});

			run(10);

		    expect(val).toBe(10);
		    done();
	    }); 

		it('-- .listen(named)', function (done) {     
			function callback(e){
				val = e;
			}
			bus.listen(callback);

			run(13);

		    expect(val).toBe(13);
		    done();
	    }); 

	    it('-- .mute(named)', function (done) {     
			var j = 0;
			function named(e){
				j = e;
			}
			bus.listen(named);

			run(14);

			bus.mute(named);

			run(99);
			expect(j).toBe(14);
			done();	
			
	    }); 

	    it('-- .mute(unnamed)', function (done) {     
			var d = 0;
			var x = function(e){
				d = e;
			}
			bus.listen(x);

			run(999);

			bus.mute(x);

			run(111);
			expect(d).toBe(999);
			done();	
			
	    }); 


	    it('-- .mute(string)', function (done) {     
			var r = 0;
			function rnamed(e){
				r = e;
			}
			bus.listen(rnamed);

			run(344);

			bus.mute('rnamed');

			run(99);
			expect(r).toBe(344);
			done();	
			
	    }); 

	    it('-- .clear()', function (done) {     
			var a = 0,
				b = 0;
			
			bus
				.listen(function(){
					a = 10;
				})
				.listen(function(){
					b = 20;
				})

			run();

			expect(a).toBe(10);
			expect(b).toBe(20);

			run();
			

			a = 0;
			b = 0;

			bus.clear();

			expect(a).toBe(0);
			expect(b).toBe(0);


			done();	
			
	    }); 

	});
	describe('.map()', function () {  
	    /* Mappings: integer */
		var mp = 10;
		bus.map(mp).listen(function(){
			mapped.integer = mp;
		});

		/* Mappings: String */
		var str = 'test';
		bus.map(str).listen(function(e){
			mapped.string = str;
		});

		/* Mappings: Prop */
		bus.map('.prop').listen(function(e){
			mapped.prop = e;
		});

		bus.map('@contextItem').listen(function(e){
			mapped.ctxi = e;
		});

		bus.map('@contextMethod()').listen(function(e){
			mapped.ctxm = e;
		})

		var total = {};
		var totalHost = Warden.Host({ 
			ctxString : "STR",
			ctxInt : 21,
			ctxMethod: function(t) {
				return t*2
			}
		});

		var totalBus = totalHost.newStream();

		totalBus.map({
			string: 'string',
			Int : 12,
			ctx : '@',
			ctxS : '@ctxString',
			ctxI : '@ctxInt',
			ctxMC : '@ctxMethod(123)',
			obj : '.',
			objS : '.str',
			objI : '.i',
			objMC : '.method(666)',
			objR : ".par.chi"
		}).listen(function(res){
			total = res;
		});

		totalHost.eval({
			str : 'string',
			i : 123,
			method : function(i){
				return i/3
			},
			par : {
				chi : 666
			}
		});

		it('-- aliasing: string', function (done) {     
		    expect(total.string).toBe('string');
		    done();
	    }); 
	    it('-- aliasing: integer', function (done) {     
		    expect(total.Int).toBe(12);
		    done();
	    }); 
	    it('-- aliasing: context', function (done) {     
		    expect(total.ctx.ctxString).toBe("STR");
		    expect(total.ctx.ctxInt).toBe(21);
		    expect(typeof total.ctx.ctxMethod).toBe(typeof function(t) {return t*2});
		    done();
	    }); 
	    it('-- aliasing: context string', function (done) {     
		    expect(total.ctxS).toBe('STR');
		    done();
	    }); 
	    it('-- aliasing: context integer', function (done) {     
		    expect(total.ctxI).toBe(21);
		    done();
	    }); 
	    it('-- aliasing: context method call', function (done) {     
		    expect(total.ctxMC).toBe(123*2);
		    done();
	    }); 

	    it('-- aliasing: object string', function (done) {     
		    expect(total.objS).toBe('string');
		    done();
	    }); 
	    it('-- aliasing: object integer', function (done) {     
		    expect(total.objI).toBe(123);
		    done();
	    }); 
	    it('-- aliasing: object method call', function (done) {     
		    expect(total.objMC).toBe(666/3);
		    done();
	    }); 
	    it('-- aliasing: object route', function (done) {     
		    expect(total.objR).toBe(666);
		    done();
	    }); 

		/* Mappings: Array of Simple*/
		bus.map([10, 12]).listen(function(e){
			mapped.arrSimple = e;
		});

		/* Mappings: Array of Props*/
		bus.map(['test', '.prop']).listen(function(e){
			mapped.arrProp = e;
		});

		/* Mappings: Object*/
		bus.map({
			name: '.value'
		}).listen(function(e){
			mapped.obj = e;
		});

		it('-- simple data type: integer', function (done) {     
			sync.transmit(200);
		    expect(mapped.integer).toBe(10);
		    done();
	    }); 

	    it('-- simple data type: string', function (done) {     
			sync.transmit('not test');
		    expect(mapped.string).toBe('test');
		    done();
	    }); 

	    it('-- simple data type: name of string', function (done) {     
			sync.transmit({
				prop: 'test'
			});
		    expect(mapped.prop).toBe('test');
		    done();
	    }); 

	    it('-- array of simple data types (integers)', function (done) {     
			sync.transmit(0);
		    expect(mapped.arrSimple).toEqual([10,12]);
		    done();
	    }); 

	    it('-- array of names of properties', function (done) {     
			sync.transmit({
				prop: 'val'
			});
		    expect(mapped.arrProp).toEqual(['test','val']);
		    done();
	    }); 

	    it('-- object', function (done) {     
			sync.transmit({
				value : 20
			});
		    expect(mapped.obj).toEqual({name : 20});
		    done();
	    }); 

	    it('-- context item', function (done) {     
			sync.transmit({
				prop: 'val'
			});
		    expect(mapped.ctxi).toEqual('hello context item');
		    done();
	    }); 

	    it('-- context method', function (done) {     
			sync.transmit({
				prop: 'val'
			});
		    expect(mapped.ctxm).toEqual('hello context method');
		    done();
	    }); 
	});

	describe('.get()', function () {  
		var data = {
			root : {
				parent: {
					object : {
						prop: 'value'
					},
					child: {
						prop: 'name',
						array: ['alpha', 'betta']
					}
				}
			},
			simple: 'simple'
		}

		bus.map('root/parent/child/prop').listen(function(e){
			mapped.getFMap = e;
		});

		bus.get('root/parent/child/prop').listen(function(e){
			mapped.getF = e;
		});

		bus.get('root/parent/child/array/[0]').listen(function(e){
			mapped.getFArray = e;
		});

		bus.get('simple').listen(function(e){
			mapped.getFSimple = e;
		});

		bus.get('root/parent/object').listen(function(e){
			mapped.getFObject = e;
		});

	    it('-- from .get()', function (done) {     
			sync.transmit(data);
		    expect(mapped.getF).toEqual('name');
		    done();
	    }); 

	    it('-- get from array', function (done) {     
			sync.transmit(data);
		    expect(mapped.getFArray).toEqual('alpha');
		    done();
	    }); 

	    it('-- get simple', function (done) {     
			sync.transmit(data);
		    expect(mapped.getFSimple).toEqual('simple');
		    done();
	    }); 

	    it('-- get object', function (done) {     
			sync.transmit(data);
		    expect(mapped.getFObject).toEqual({prop: "value"});
		    done();
	    }); 

	});
	describe('.filter()', function () {  
		var equals = {
			i: 0,
			s: 's',
			b: true,
			a: [1,2,3]
		}

		bus.filter(function(x){
			return x > 100;
		}).listen(function(e){
			filtered.passed = true;
		});

		bus.filter(function(x){
			return x <= 100;
		}).listen(function(e){
			filtered.passed = false;
		});



		it('-- passed', function (done) {     
			sync.transmit(101);
		    expect(filtered.passed).toBe(true);
		    done();
	    }); 

	    it('-- not passed', function (done) {     
			sync.transmit(10);
		    expect(filtered.passed).toBe(false);
		    done();
	    });


	    (function(){
	    	var run;
	    	var bus = Warden.Stream(function(fire){
	    		run = fire
	    	});

	    	bus.filter(0).listen(function(){
				filtered.i = true;
			});

			bus.filter('s').listen(function(){
				filtered.s = true;
			});

			bus.filter(true).listen(function(){
				filtered.b = true;
			});

			bus.filter([1,2,3]).listen(function(){
				filtered.a = true;
			});


			var filtered = {}; 

			it('-- number (equality)', function (done) {     
				run(55);
			    expect(filtered.i).not.toBe(true);
			    run(0);
			    expect(filtered.i).toBe(true);
			    done();
		    }); 


			it('-- string (equality)', function (done) {     
				run('soso');
			    expect(filtered.s).not.toBe(true);
			    run('s');
			    expect(filtered.s).toBe(true);
			    done();
		    }); 


			it('-- bool (equality)', function (done) {     
				run(false);
			    expect(filtered.b).not.toBe(true);
			    run(true);
			    expect(filtered.b).toBe(true);
			    done();
		    }); 


			it('-- arr (equality)', function (done) {     
				run([1,2,3]);
			    expect(filtered.a).not.toBe(true);
				run([1,2,3,4]);
			    expect(filtered.a).not.toBe(true);
			    done();
		    }); 

	    })();
	});


	describe('.filterFor()', function () {   
		var run;
		var bus = Warden.Stream(function(fire){
			run = fire
		});
		var res;


		bus.filterFor(function(e, p){
	  		var taken = p.get();

	  		if(taken && taken.indexOf(e)>=0){
	  			p.stop();
	  		}else{
	  			p.next(e, function(data, val){
		    		if(typeof data == 'object') { 
		      			data.push(val); 
		      			return data; 
		      		} else {
		      			return [val]
		      		} 
		      	});
		     }
		}).listen(function(e){
			res = e;
		});

		it('-- unique ', function (done){
			run(1);
			expect(res).toEqual(1);

			run(1);
			expect(res).toEqual(1);

			run(2);
			expect(res).toEqual(2);

			run(1);
			expect(res).toEqual(2);
			
			run(3);
			expect(res).toEqual(3);

			run(12);
			expect(res).toEqual(12);

			run(1);
			run(2);
			run(3);
			expect(res).toEqual(12);
			done();
		});
	});
	describe('.reduce()', function () {  
		_clear();

		function isInReduce(d){
			return d.reduce ? true : false;			
		}

		var asReduce = bus.filter(isInReduce).map('.val')

		asReduce
		.reduce(0, function(a,b){
			return a + b;
		}).listen(function(e){
			reduced.first = reduced.first || e;
			reduced.sum = e;
		});

		asReduce
		.reduce('start', function(a,b){
			return a.toString() + ":" + b.toString();
		}).listen(function(e){
			reduced.str = e;
		});


		asReduce
		.reduce(0, function(a,b){
			return a > b ? a : b;
		})
		.listen(function(e){
			reduced.sort = e;
		})

		sync.transmit({reduce : true,val : 20});
		sync.transmit({reduce : true,val : 20});
		sync.transmit({reduce : true,val : 20});
		sync.transmit({reduce : true,val : 40});
		

	    it('-- once', function (done) {     			
		    expect(reduced.first).toBe(20);
		    done();
	    }); 
	    
	    it('-- sum', function (done) {     			
		    expect(reduced.sum).toBe(100);
		    done();
	    }); 

	    it('-- string', function (done) {     			
		    expect(reduced.str).toBe("start:20:20:20:40");
		    done();
	    }); 

		it('-- sort', function (done) {     			
		    expect(reduced.sort).toBe(40);
		    done();
	    }); 

		(function(){

			var run;
			var bus = Warden.Stream(function(f){
				run = f;
			})

		    it('--in initial value', function (done){
		    	var gres = 0;

		    	bus.reduce(100, function(a, b){
		    		return a + b;
		    	}).listen(function(res){
		    		gres = res;
		    	})

		    	run(0);
		    	run(10);
		    	run(20);
		    	run(30);

		    	expect(gres).toBe(160);
		    	done();
		    });

		    it('--no initial value', function (done){
		    	var gres = 0;

		    	bus.reduce(function(a, b){
		    		return a + b;
		    	}).listen(function(res){
		    		gres = res;
		    	})

		    	run(0);
		    	run(10);
		    	run(20);
		    	run(30);

		    	expect(gres).toBe(60);
		    	done();
		    });

		})();
	});
	describe('.take()', function () {  
		bus.take(2).listen(function(){
			taken ++;
		});


		it('-- integer', function (done) {     			
		    sync.transmit(0);
		    sync.transmit(0);
		    sync.transmit(0);
		    expect(taken).toBe(2);
		    done();
	    });

	});
	describe('.skip()', function () {  
		var emitted = 0;	
		
		it('-- integer', function (done) {     			
			bus.skip(2).listen(function(){
				emitted ++;
			});

		    sync.transmit(0);
		    sync.transmit(0);
		    sync.transmit(0);
		    expect(emitted).toBe(1);
		    done();
	    });
	});
	describe('.interpolate() and .mask()', function () {  		
		it('-- interpolate', function (done) {
			var res = "", str = "Hello, {{val}}!";     			
			bus.interpolate(str).listen(function(e){
				res = e;
			});
			
		    sync.transmit({
		    	val: "world"}
		    );

		    expect(res).toBe("Hello, world!");
		    done();
	    });
	  
	    it('-- interpolate (advanced)', function(done){
	      var res = "", str = "<{{tag}}>{{property}} = {{value}}</{{tag}}>"
	      
	        bus.interpolate(str).listen(function(e){
				res = e;
			});
			
		    sync.transmit({
	          tag: 'span',
	          property : 'няш',
	          value : 'мяш',
	        });
	      
	      expect(res).toBe("<span>няш = мяш</span>");
	      done();
	    });

		it('-- mask (simple)', function (done) {
			var res = "", str = "Hello, {{val}}!";     			
			var b = bus.mask({
				val: 'world'
			}).listen(function(e){
				res = e;
			});
			
		    sync.transmit(str);

		    expect(res).toBe("Hello, world!");
		    b.lock();
	        done();
	    });
	  
	    it('-- mask (advanced)', function (done) {
	      var res = "", str = "<{{tag}}>{{property}} = {{value}}</{{tag}}>"
	      
	      var b = bus.mask({
			  tag: 'span',
	          property : 'няш',
	          value : 'мяш',
			}).listen(function(e){
				res = e;
			});
			
		    sync.transmit(str);

		    expect(res).toBe("<span>няш = мяш</span>");
		    b.lock();
	      
	      done();
	    });
	});
	describe('.diff()', function () {  		
		it('-- no function', function (done) {
			var res = "";
			
			var u = bus.diff().listen(function(e){
				res++;
			});
			
		    sync.transmit(10);
		    sync.transmit(10);
		    sync.transmit(20);
		    sync.transmit(20);

		    expect(res).toBe(2);
		    u.lock();
		    done();
	    });

	    it('-- compare second letter', function (done) {
			var res = 0;
			
			var u = bus.diff(function(a,b){
				return  a[1] == b[1];
			}).listen(function(e){
				res++;
			});
			
		    sync.transmit("123");
		    sync.transmit("222");
		    sync.transmit("321");
		    sync.transmit("524444");
		    sync.transmit("011");

		    expect(res).toBe(2);
		    u.lock();
		    done();
	    });

	    it('-- compare length of string', function (done) {
			var res = 0;
			
			var u = bus.diff(function(a,b){
				return  a.length == b.length
			}).listen(function(e){
				res++;
			});
			
		    sync.transmit("123");
		    sync.transmit("524444");
		    sync.transmit("222");
		    sync.transmit("524444");
		    sync.transmit("321");
		    sync.transmit("011");

		    expect(res).toBe(5);
		    u.lock();
		    done();
	    });
	});
	describe('Time methods ', function () {  		
		it('-- debounce (200 ms)', function (done) {
			var res = 0;
			
			var u = bus.debounce(200).listen(function(e){
				res++;
			});
			
		    sync.transmit(0); //res = 1
		    sync.transmit(0);
		    sync.transmit(0);
		    setTimeout(function(){
		    	sync.transmit(0); // res =2;
			    u.lock();
			    setTimeout(function(){
			    	expect(res).toBe(2);
			    	done();
			    }, 300);			    
		    }, 300);		    
	    });

	    it('-- collect (200 ms)', function (done) {
			var res = "";
			
			var u = bus.collect(200).listen(function(e){
				res = e;
			});
			
		    sync.transmit(0); 
		    sync.transmit(1); 
		    sync.transmit(2); 
		    setTimeout(function(){
		    	sync.transmit(0); // res =2;
			    u.lock();
		    	expect(res).toEqual([0,1,2]);
			    done();
		    }, 300);		    
	    });

	});
	describe('Combining methods ', function () {  		
		it('-- merge', function (done) { 
			var cl;

			var bus1 = bus.filter(function(x){return x==1}).map('One'),
				bus2 = bus.filter(function(x){return x==0}).map('Two'),
				merged = bus1.merge(bus2);

			merged.reduce([],function(a,b){
				a.push(b);
				return a;
			}).listen(function(x){
				cl = x;
			});

			sync.transmit(1);
			sync.transmit(0);

			expect(cl).toEqual(['One', 'Two']);
			merged.lock();
			done();
		});

		it('-- merge 2 and more', function (done) { 
			var cl;

			var bus1 = bus.filter(function(x){return x==1}).map('One'),
				bus2 = bus.filter(function(x){return x==0}).map('Two'),
				bus3 = bus.filter(function(x){return x==2}).map('Three'),
				merged = bus1.merge(bus2, bus3);

			merged.reduce([],function(a,b){
				a.push(b);
				return a;
			}).listen(function(x){
				cl = x;
			});

			sync.transmit(2);
			sync.transmit(1);
			sync.transmit(0);

			expect(cl).toEqual(['Three', 'One', 'Two']);
			merged.lock();
			done();
		});

		it('-- resolve (bigger)', function (done) {
			var cl;

			var bus1 = bus.filter(function(x){return x.one}).map(10),
				bus2 = bus.filter(function(x){return x.two}).map(20),
				produced = bus1.resolve(bus2, function(a,b){
					return a > b ? 'first' : 'second';
				});

			produced.listen(function(x){
				cl = x;
			});

			sync.transmit({one:true});
			sync.transmit({two:true});

			expect(cl).toBe('second');
			done();
		});

		it('-- resolve (smaller)', function (done) {
			var cl;

			var bus1 = bus.filter(function(x){return x.one}).map(30),
				bus2 = bus.filter(function(x){return x.two}).map(20),
				produced = bus1.resolve(bus2, function(a,b){
					return a > b ? 'first' : 'second';
				});

			produced.listen(function(x){
				cl = x;
			});

			sync.transmit({one:true});
			sync.transmit({two:true});

			expect(cl).toBe('first');
			done();
		});


		it('-- resolve (first is earlier)', function (done) {
			var cl;
			var time = function(d){
				d.time = (new Date()).getTime();
				return d;
			}

			var bus1 = bus.filter(function(x){return x.one}).map(time),
				bus2 = bus.filter(function(x){return x.two}).map(time),
				produced = bus1.resolve(bus2, function(a,b){
					return a.time <= b.time ? 'first' : 'second';
				});

			produced.listen(function(x){
				cl = x;
			});

			sync.transmit({one:true});
			setTimeout(function(){
				sync.transmit({two:true});
				expect(cl).toBe('first');
				done();
			},10);
			
		});

		it('-- resolve (second is earlier)', function (done) {
			var cl;

			bus.map(function(d){
				d.time = (new Date()).getTime();
				return d;
			});

			var bus1 = bus.filter(function(x){return x.one}),
				bus2 = bus.filter(function(x){return x.two}),
				produced = bus1.resolve(bus2, function(a,b){
					return a.time <= b.time ? 'first' : 'second';
				});

			produced.listen(function(x){
				cl = x;
			});

			sync.transmit({two:true});
			setTimeout(function(){
				sync.transmit({one:true});
				expect(cl).toBe('second');
				done();
			},10);
			
		});


		it('-- combine (+)' ,function (done){
			var sum = 0;

			var host1 = Warden.Host(),
				host2 = Warden.Host();

			var bus1 = host1.newStream().map(10),
				bus2 = host2.newStream().map(20),
				combined = bus1.combine(bus2, function(a,b){
					return a + b;
				}, 0).listen(function(res){
					sum = res;
				});

				host1.eval();
				expect(sum).toBe(10);
				host2.eval();
				expect(sum).toBe(30);
				host2.eval();
				host1.eval();
				expect(sum).toBe(30);

				done();
		});

		it('-- alternately', function (done) { 
			var cl = [];

			var bus1 = bus.filter(1).map(1),
				bus2 = bus.filter(2).map(2),
				alternately = bus1.alternately(bus2);

			alternately.listen(function(x){
				cl.push(x);
			});

			sync.transmit(1);
			sync.transmit(1);
			sync.transmit(1);
			sync.transmit(2);
			sync.transmit(2);
			sync.transmit(1);
			sync.transmit(2);

			
			expect(cl).toEqual([1,2,1,2]);
			done();
			
		});

		it('-- sync (with intreval of 300 ms);', function (done) { 
			var cl;

			var bus1 = bus.filter(function(x){return x==1}).map('a'),
				bus2 = bus.filter(function(x){return x==0}).map('b'),
				synced = bus1.sync(bus2);

			synced.listen(function(x){
				cl = x;
			});

			sync.transmit(1);
			setTimeout(function(){
				sync.transmit(0);	
				expect(cl).toEqual(['a', 'b']);
				synced.lock();
				done();
			}, 300)
			
		});	

		it('-- sync 4 streams (with intreval of 300 ms);', function (done) { 
			var cl;

			var bus1 = bus.filter(function(x){return x==1}).map('a'),
				bus2 = bus.filter(function(x){return x==2}).map('b'),
				bus3 = bus.filter(function(x){return x==3}).map('c'),
				bus4 = bus.filter(function(x){return x==4}).map('d'),			
				synced = bus1.sync(bus2, bus3, bus4);

			synced.listen(function(x){
				cl = x;
			});

			sync.transmit(1);
			setTimeout(function(){
				sync.transmit(2);	
				setTimeout(function(){
					sync.transmit(3);
					setTimeout(function(){
						sync.transmit(4)
						expect(cl).toEqual(['a', 'b', 'c', 'd']);
						synced.lock();
						done();
					}, 300);
				}, 300);
			}, 300)
			
		});

	});
	describe('Lock/Unlock methods ', function () {
		var Context = {
			syncemitted: 0,
			syncLastValue: 0
		};
		var Stream = Warden.Stream(function(trigger){
			this.sync = function(value){
				trigger(value);
			}

			this.async = function(time, value){
				setTimeout(function(){
					trigger(value);
				}, time);
			}
		}, Context);

		it('-- locking and unlocking simple listened bus', function (done) { 
			var bus = Stream.bus();
			bus.listen(function(x){
				Context.syncemitted++
				Context.syncLastValue = x;
			});

			Context.sync(10);
			Context.sync(10);
			Context.sync(20);

			bus.lock();

			Context.sync(10);
			Context.sync(10);
			Context.sync(30);

			expect(Context.syncemitted).toBe(3);
			expect(Context.syncLastValue).toBe(20);

			bus.unlock();

			Context.sync(10);
			Context.sync(10);
			Context.sync(10);
			expect(Context.syncemitted).toBe(6);
			expect(Context.syncLastValue).toBe(10);

			bus.lock();
			done();
		});

		it('-- locking and unlocking difference buses', function (done) { 
			var bus1 = Stream.bus(),
				bus2 = Stream.bus();

			var b1 = {t: 0,v: 0},
				b2 = {t: 0,v: 0}

			bus1.listen(function(x){
				b1.t++
				b1.v = x;
			});

			bus2.listen(function(x){
				b2.t++
				b2.v = x;
			});

			Context.sync(10);
			Context.sync(10);
			Context.sync(20);

			expect(b1.t).toBe(3);
			expect(b1.v).toBe(20);
			expect(b2.t).toBe(3);
			expect(b2.v).toBe(20);

			bus1.lock();

			Context.sync(10);
			Context.sync(10);
			Context.sync(30);

			expect(b1.t).toBe(3);
			expect(b1.v).toBe(20);
			expect(b2.t).toBe(6);
			expect(b2.v).toBe(30);

			bus2.lock();

			Context.sync(10);
			Context.sync(10);
			Context.sync(10);
			
			expect(b1.t).toBe(3);
			expect(b1.v).toBe(20);
			expect(b2.t).toBe(6);
			expect(b2.v).toBe(30);

			bus1.unlock();						

			Context.sync(10);
			Context.sync(10);
			Context.sync('test');

			expect(b1.t).toBe(6);
			expect(b1.v).toBe('test');
			expect(b2.t).toBe(6);
			expect(b2.v).toBe(30);

			bus2.unlock();

			Context.sync(10);
			Context.sync(10);
			Context.sync('10');

			expect(b1.t).toBe(9);
			expect(b1.v).toBe('10');
			expect(b2.t).toBe(9);
			expect(b2.v).toBe('10');

			bus1.lock();
			bus2.lock();
			done();
		});

	});
    describe('Context saving', function () {
        var Context = {
          test : 'non-exists'
        }
      
        var module = Warden.extend({
          test : 'exists'
        });  
        
    	it('-- Stream execution Context', function(done){
          var busMod = module.stream('sync');
          var busBinded = module.stream('sync', Context); 
          
          var executed = {};
          
          busMod.listen(function(){
            executed.mod = this.test;
          });
          
          busBinded.listen(function(){
            executed.bind = this.test;
          });
          
          module.emit('sync');
          
          expect(executed.mod).toBe('exists');
          expect(executed.bind).toBe('non-exists');
          
          done();
        });
      
      	it('-- Stream methods context', function(done){
          var bus = module.stream('sync', Context); 
          
          var executed = {};
          
          function sil(){
            executed[Math.random()] = this.test;
            return true;
          }
          
          bus.map(sil).listen(sil);
          bus.filter(sil).listen(sil);
          bus.reduce(0, sil).listen(sil);
          bus.resolve(bus, sil).listen(sil);
          bus.combine(bus, sil).listen(sil);
          
          module.emit('sync');
          
          for(var i in executed){
            expect(executed[i]).toBe('non-exists');
          }
          
          done();
        });
      
        it('-- Stream Context', function (done) { 
    	  var context = {x:10};
          var stream = Warden.makeStream(function(trigger){
            this.y = 10;
            this.sync = function(x){
              trigger()
            };
          }, context);
          
          expect(context.y).toBe(10);
          
          done();
    	});
    });
});