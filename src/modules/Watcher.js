Warden.Watcher = function(){
	var argv = Utils.toArray(arguments).slice(1,arguments.length),
		argc = argv.length,
		bus = arguments[0],
		a = argv[0],
		b = argv[1],
		fn,
		st;

	if(argc===1){
		if(is.str(a)){
			fn = function binding(event){this[a] = event;}			
		}else	
		if(is.fn(a)){
			fn = function binding(event){a(event);}
		}
	}else{
		if(is.obj(a) && is.str(b)){
			if(b.indexOf('/')>=0){
				var dest = "";

				each(b.split('/'), function(name){
					if(!is.exist(eval("a" + dest)[name])){
						throw "Unknown property: " + name + " from chain: " + b;
					}
					dest += ('["'+name+'"]');
				});

				fn = function binding(event){
					eval("a" + dest + "= event");
				}
			}else{
				fn = is.fn(a[b]) ? function binding(event){a[b](event);} : fn = function binding(event){a[b] = event} ;
			}
		}else
		if(is.fn(b)){
			fn = function binding(event){b.call(a, event);}
		} 
	}

	st = fn;

	bus.listen(fn);

	return {
		update: fn,
		remove: function(){
			bus.mute('binding');
		}
	}
};