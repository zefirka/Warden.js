Streams
=========

Source at: `./src/module/Streams.js` : Streams module

Depends on: `./src/module/DataBus.js` : DataBus module

Usage :
 - `object.stream(type, [context])` - Create an event stream and returns associated data bus,
 - `Warden.makeStream(creator, [context], [strictCheck])` - Create custom data stream

Streams in Warden.js are data sources that could be associated with sync/async pipelines called DataBus.


## Event streams
Event streams creates from standart DOM API events or custom events in Warden Pub/Sub wrapper (from .emit()).  

```js
Warden.extend(document);
var clicks = document.stream('click');
clicks.log('User clicked at document'); // logging that into console
```

or, if you prefer jQuery:

```js
var clicks = $(document).stream('click');
clicks.log('User clicked at document');
```

or, without any DOM:

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

## Creating custom events streams
You can create not only event streams. Streams can contain data of any type. These notation allows you to wrap all changes in system's state as data transmissions (synchronious or not), so you can manipulate your system easy with pure function without any side effects in while processing data.
General method to create custom data streams is [`Warden.makeStream`](#Warden.makeStream)

```js
var pulse = {}, //context
	pulser = Warden.makeStream(function(emit){
		var timer = 0;
		this.start = function(){
			clearInterval(timer);
			timer = setInterval(function(){
				emit("PULSE!");
			}, 1000);
		};
		this.stop = function(){
			clearInterval(timer);
		}
		this.start();
	}, pulse).get();

pulser.log();
/* This creates side effect: log to console PULSE! every second

  pulse.stop() - will stop pulsing
  pulse.start() - will start pulsing
*/
```

## Streams from arrays
You can also create streams from arrays. It means that you can listen and process array changes.
```js
var array = Warden.extend(['alpha', 'beta', 'delta']);

var pushes = array.stream('push');

pushes.listen(function(changes){
  console.log("To array added items: " + changes.data.join(', '));
});

array.push('eta', 'theta');
//-> To array added items: eta, theta
```

## Usage

#### .stream
Usage: `object.stream(type, [context])`

Returns: `DataBus` object associated with created stream

Description: Creates stream of events and associated to it new DataBus object. Allowed asterisk notation.

[`Warden.extend`](https://github.com/zefirka/Warden.js/blob/master/docs/Extend.md) gives you a Pub/Sub object from given, so your objects will have method `.stream` which listens all events of given type and evaluates all streams conjuncted with adequate object (look [DataBuses](https://github.com/zefirka/Warden.js/blob/master/docs/DataBus.md)). This method returns first DataBus associated with stream. To get stream use:
```js
var clicks = element.stream('click'),
    clicksSource = clicks.host;
```

#### Warden.makeStream
Usage: `Warden.makeStream(creator, [context], [strict])`

Returns: Stream object.

Description: creates stream. If type of `creator` is not `function`, then just creates stream which `.$$type` property equals to `creator` value, else it calls  `creator` function when first argument is Stream evaluation callback. `context` is a context of all stream processing methods and final callback. If `strict` argument is truthy, then it checks the text of `creator` and warns about the coincidence in properties name with `context` properties.

Difference between Stream and DataBus:
```js
var stream = Warden.makeStream(function(emit){
	setTimeout(function(){
    emit('Hello world!');
  }, 5000);
});
var dataBus = stream.bus();
dataBus.log();

//-> Hello world! (after 5 seconds)
```

Now let's try a tiny ajax module.
```js
var http = (function(){
  var ctx = {}; // context of evaluation

  ctx.ajax = Warden.makeStream(function(emit){
    function response(type){
      return function(data){
        emit({
          data: data,
          type: type
        });
      }
    }

    this.get = function(options){
      return $.ajax($.extend(options, {
        success: response('success'),
        error: response('error')
      }));
    }
  }, ctx);

  ctx.httpBus = ctx.ajax.bus();

  ctx.errors = ctx.httpBus.filter(function(e){
    return e.type == 'error';
  });
  ctx.successes = ctx.httpBus.filter(function(e){
    return e.type == 'success';
  });

  return ctx;
})();

/* Now lets bind side-effects */
http.errors.map('.data').interpolate('HTTP ERROR! Status: {{statusText}}').log();
http.successes.log('HTTP SUCCESS!');

/* Let's test it now */
http.get({url: 'thereIsNoSuchPage.html'});
//--> HTTP ERROR! Status: Not found
http.get({url: 'index.html'});
//--> HTTP SUCCESS!
```
