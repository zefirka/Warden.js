describe('Utilities', function(){
	var Utils = Warden.Utils,
		is = Utils.is;

	var str = 'string',
		num = 10,
		obj = {x:20},
		array = [20],
		fn = function name(){},
		bool = true,
		nil = null,
		undef;

	include "utils/datatypes.js"
	include "utils/logical.js"	

});