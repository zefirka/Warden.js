const Warden = require('../../dist/warden.min.js');

describe('Warden Stream methods', function () {  
	var sync = {
			contextItem: 'hello context item',
			contextMethod: function(){
				return 'hello context method'
			}
		}, 
		value = 0, 
		mapped = {}, 
		filtered = {},
		reduced = {},
		taken = 0,
		_clear = function(){
			value = 0;
			mapped = {};
			filtered = {};
			reduced = {};
			taken = 0;
		},
		bus = Warden.Stream(function(trigger){
			this.transmit = function(val){
				trigger(val);
			}
		}, sync);

	/* Simple */
	bus.listen(function(data){
		value = data;
	});

	//=require ./specs/databus/simple.js
	//=require ./specs/databus/listen.js
	//=require ./specs/databus/map.js
	//=require ./specs/databus/filter.js
	//=require ./specs/databus/reduce.js
	//=require ./specs/databus/take.js
	//=require ./specs/databus/skip.js
	//=require ./specs/databus/mask.js
	//=require ./specs/databus/unique.js
	//=require ./specs/databus/timefunc.js
	//=require ./specs/databus/combinig.js
	//=require ./specs/common/lockunlock.js
	//=require ./specs/common/context.js
});