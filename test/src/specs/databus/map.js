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

	it('-- from .map()', function (done) {     
		sync.transmit(data);
	    expect(mapped.getFMap).toEqual('name');
	    done();
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