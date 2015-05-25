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
	var totalBus = Warden.Stream("name", { 
		ctxString : "STR",
		ctxInt : 21,
		ctxMethod: function(t) {
			return t*2
		}
	});

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
	
	totalBus.fire({
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