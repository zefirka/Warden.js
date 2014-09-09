Warden.watcher = (function(){
	return function(bus, a, b, c){
		var ta = typeof a, tb = typeof b, terr = "TypeError", fn, is = Utils.is;

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
			}else{
				throw terr;
			}
		}else

		if(is.exist(b)){
			if(ta == 'object' && tb == 'string'){
				fn = function(event){
					return a[b] = event;
				}
			}else

			if(ta == 'object' && tb == 'function'){
				fn = function(event){
					return b.call(a, event);
				}
			}else
			{
				throw terr;
			}
		} else

		{
			throw "Arg Error"
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