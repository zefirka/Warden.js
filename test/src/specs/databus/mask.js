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