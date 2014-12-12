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

(function (d, w, scr) {
    var n = d.getElementsByTagName("script")[0],
    s = d.createElement("script"),
    f = function () { 
    	n.parentNode.insertBefore(s, n);
    	debugger;
    };

    var date = new Date();
    var siteId = 933;
    var productId = 0;

    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:")
        + "//dmp.rtcdn.ru/pixel.js?t=" + date.getTime()
        + "&timeOffset=" + date.getTimezoneOffset()
        + "&siteId=" + siteId
        + "&productId=" + productId
        + "&screen=" + scr.width + ',' + scr.height + ',' + scr.pixelDepth
        + "&referer=" + encodeURIComponent("http://pudra.ru/skindinavia/the-makeup-primer-spray-oil-control-card.html");

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, screen);