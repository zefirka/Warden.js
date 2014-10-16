Warden.watcher = (function(){
	return function(bus, a, b, c){
		var fn, is = Utils.is;

		if(!is.exist(b) && is.exist(a)){
			if(ta == 'string' || ta == 'object'){
				fn = function(event){
					return this[a] = event;
				}
			}else
			if(ta == 'function'){
				fn = function(event){
					return a(event);
				}
			}
		}else

		if(is.exist(b)){
			if(is.obj(a) && is.str(b)){
				fn = function(event){
					return a[b] = event;
				}
			}else

			if(is.obj(a) && is.fn(b)){
				fn = function(event){
					return b.call(a, event);
				}
			}
		}

		bus.listen(fn);

		return Utils.extend(new (function Observable(){}), {
			update : fn,
			unbind : function(name){
				bus.mute(name);
			},
			bind : function(f){
				bus.listen(fn || fn)
			}
		});

	};
})();