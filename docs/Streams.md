Streams
=========

Module at: 
 - `./src/module/Streams.js` : Streams module
 - `./src/module/DataBus.js` : DataBus module

Usage : 
 - `object.stream(type, [context])` - Create an event stream,
 - `Warden.makeStream(creator, [context], [strictCheck])` - Create custom data stream


##Event streams##
Event streams creates from standart DOM API events or custom events in Warden Pub/Sub wrapper (from .emit()).  

```js
Warden.extend(document);
var clicks = document.stream('click');
clicks.listen('User clicked at document'); // logging that into console
```

or, if you prefer jQuery:

```js
Warden.extend($);
var clicks = $(document).stream('click');
clicks.listen('User clicked at document');
```

or, withour any DOM:

```js
var module = Warden.extend({
	sync: function(data){
		this.emit({
			type: 'someType',
			data: data
		});
	}
});

var someTypeStream = module.stream('someType');
someTypeStream.listen(function(event){
	console.log(event.data);
})

module.sync("Hello world!");
```

##Creating custom data streams##
You can create not only event streams. Streams can contain data of any type. These notation allows you to wrap all changes in system's state as data transmissionm (synchronious or not), so you can manipulate your system easy with pure function without any side effects. 
General method to create custom data streams is [`Warden.makeStream`](#Warden.makeStream)

```js
var pulse = {},
	pulser = Warden.makeStream(function(emit){
		var timer = 0;
		this.start = function(){
			clearInterval(timer);
			timer = setInterval(function(){
				emit("PULSE!); 
			}, 1000);
		};
		this.stop = function(){
			clearInterval(timer);
		}
		this.start();
	}, pulse).get();

pulser.log(); // will log to console PULSE! every second

// pulse.stop() - will stop pulsing
// pulse.start() - will start pulsing
```

###Usage###
####Warden.extend####
[`Warden.extend`] creates a Pub/Sub wrapper around your object or object's constructor. So all resulting objects will have method [`.stream(type, [context]`] which listens all events of [`@type`] and evaluates all streams conjuncted with adequate object (look [DataBuses](http://databuses)). If you will use much DOM API events or custom events use Warden.extend.
####Warden.makeStream####
`Warden.makeStream(creator, [context], [strict])`
Returns: Stream object.
Descriptions: creates stream. If type of `@creator` is not `function`, then just creates stream, else it executes @creator, when first argument is Stream evaluation function. `context` is a context of all stream processing methods and final callback. If `@strict` argument is truly, than it checks the text of `@creator` and warns about the coincidence in properties name with `@context` properties.

```js
var stream = Warden.makeStream(function(trigger){
	setTimeout(trigger, 2000); 
});
var dataBus = stream.get();
```

```js
var server = (function(){
	var res = {};

	res.successes = Warden.makeStream('success', res);
	res.errors = Warden.makeStream('error', res);

	res.get = function(options){
		return $.ajax($.extend(options, {
			success : function(data){
				res.successes.eval(data);
			},
			error : function(msg){
				res.errors.eval(msg);
			}
		}));	
	}

	return res;	
})();
```
