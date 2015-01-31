/* 
	Watcher module:
		version: 0.2.0
*/
Warden.watcher = (function(){
	var is = Utils.is,
		each = Utils.each;

	return function(bus, a, b){
		var argv = Utils.toArray(arguments).slice(1,arguments.length),
			argc = argv.length,
			fn,
			st;

		if(argc===1){
			if(is.str(a)){
				fn = function(event){this[a] = event;}			
			}else	
			if(is.obj(a)){
				fn = function(event){a = event;}
			}else
			if(is.fn(a)){
				fn = function(event){a(event);}
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

					fn = function(event){
						eval("a" + dest + "= event");
					}
				}else{
					fn = is.fn(a[b]) ? function(event){a[b](event);} : fn = function(event){a[b] = event} ;
				}
			}else
			if(is.fn(b)){
				fn = function(event){b.call(a, event);}
			} 
		}

		st = fn;

		return {
			update : fn,
			unbind : function(name){
				st = fn;
				fn = function(){} 
			},
			bind : function(f){
				fn = st;
			}
		};

	};
})();