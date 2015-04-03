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