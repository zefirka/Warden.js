/* 
	Equilizer Module:
	version: 0.0.1
*/

Warden.Equilizer = (function(){
	var each = Utils.each;

	var self = {},
		compractor,
		collection = {
			sortings : {
				data : [],
				bus : null
			}
		}


	
	self.sort = function(bus){
		var merged = Warden.makeStream().get();

		collection.sortings.data.push(bus);
		collection.sortings.bus = null;

		each(collection.sortings.data, function(i){
			merged =  merged.merge(i);
		});

		merged.listen(function(data){
			compractor(data);
		});

		collection.sortings.bus = merged;

		return self;
	}


	return function Equilizer(fn){
		Analyze('Equilizer', fn);

		compractor = fn;
		return self;
	}
})();

