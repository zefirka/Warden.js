/* 
	Watcher module:
		version: 0.1.0
*/

Warden.watcher = (function(){
	var is = Utils.is,
		each = Utils.each;

	return function(bus, a, b, c){
		var argv = Utils.toArray(arguments).slice(1,arguments.length),
			argc = argv.length,
			fn;

		if(!is.exist(b) && is.exist(a)){
			if(is.str(a)){
				fn = function(event){
					return this[a] = event;
				}			

			}else
			if(is.obj(a)){
				fn = function(event){
					a = event;
				}
			}else
			if(is.fn(a)){
				fn = function(event){
					return a(event);
				}
			}
		}else

		if(is.exist(b)){
			if(is.obj(a) && is.str(b)){
				if(b.split('/').length>1){
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
					if(is.fn(a[b])){
						fn = function(event){
							a[b](event);
						}
					}else{
						fn = function(event){
							return a[b] = event;
						}
					}
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