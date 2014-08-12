Warden.watcher = function(bus, a, b){
	var al = arguments.length,
		fn = null;
	if(al==3){
		if(is.fn(b)){
			if(is.obj(a)){
				fn = function(e){
					return a = b(e);
				}
			}else{
				throw "Wrong";
			}
		}else
		if(is.str(b)){
			if(is.obj(a)){
				fn = function(e){
					return a[b] = e;
				}
			}else{
				throw "Wrong";
			}
		}else{
			throw "Wrong"
		}
	}else
	if(al==2){
		fn = function(e){
			a = e;
		}
	}else
	if(al==1){
		throw "Wrong"
	}

	return bus.listen(fn);
};