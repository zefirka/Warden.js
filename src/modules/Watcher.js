Warden.watcher = function(bus, a, b){
	var ta = typeof a,
		tb = typeof b,
		terr = "TypeError",
		fn;

	if(!is.exist(b) && is.exist(a)){
		if(ta == 'string'){
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
				return a = b(event);
			}
		}else
		{
			throw terr;
		}
	} else

	{
		throw "Arg Error"
	}


	return bus.listen(fn);
};