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
	bus.map('prop').listen(function(e){
		mapped.prop = e;
	});

	/* Mappings: Array of Simple*/
	bus.map([10, 12]).listen(function(e){
		mapped.arrSimple = e;
	});

	/* Mappings: Array of Props*/
	bus.map(['test', 'prop']).listen(function(e){
		mapped.arrProp = e;
	});

	/* Mappings: Object*/
	bus.map({
		name: 'value'
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
});