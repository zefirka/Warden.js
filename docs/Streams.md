Streams
=========

Source at: 
  - `./src/module/Host.js` : Host module
  - `./src/module/Stream.js` : Stream module

Usage :
 - `object.stream(type, [context])` - Create stream from events of given type,
 - `Warden.Stream(creator, [context], [strictCheck])` - Create custom stream by creator function in given context and checks name overwriting if you need (look at strict name checking);
 - `Waden.Host([context]).newStream();` - Create Host and associate with it new stream. Returns stream.

Streams in Warden.js are simple pipelines which associated with some Host. Every data can be transmitted through the stream, so streams are data which can be changed. Stream has context of evaluation and stack of memory (3 last taken data by default, but you can configure it by `Warden.configure.history`).

## Event streams
Event streams creates from standart DOM API events or custom events in Warden Pub/Sub wrapper (from .emit()).  

```js
Warden(document); // wrapping document to as Pub/Sub container
var clicks = document.stream('click'); // creating stream of clicks on document 
clicks.log('User clicked at document'); // logging that into console
```

or, if you prefer jQuery:

```js
var clicks = $(document).stream('click');  // Warden automaticaly extends jQuery if detect it
clicks.log('User clicked at document');
```

or, without any DOM:

```js
var module = Warden({ 
	sync: function(data){
		this.emit({
			type: 'someType',
			data: data
		});
	}
});

// now module has method sync which emits events of 'someType'

var someTypeStream = module.stream('someType'); // creating  stream of custom type

// subscribing to the stream updates
someTypeStream.listen(function(event){ 
	console.log(event.data);
});

module.sync("Hello world!");
// -> Hello World!
```

## Creating streams of custom data
You can create not only event streams. Streams can take data from any source, not only from events. It allows you to wrap all changes in system's state as data transmissions (synchronious or not), so you can manipulate your system easy with pure function without any side effects in while processing data.
General method to create custom data streams is `Warden.Stream`

```js
var pulse = {}, //context
	pulser = Warden.Stream(function(emit){
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
	}, pulse);

pulser.log();
/* This creates side effect: log to console PULSE! every second

  pulse.stop() - will stop pulsing
  pulse.start() - will start pulsing
*/
```

As you can see, we created a simple module `pulse`. But wait, there is a state inside of `pulser` context. Yep. Bu state is simple and predictivem it's not coming out from stream creation function.

## Streams from arrays
You can also create streams from arrays. It means that you can listen and process array changes.
```js
var array = ['alpha', 'beta', 'delta']; 
var pushes = Warden(array).stream('push');

pushes.listen(function(changes){
  console.log("To array added items: " + changes.data.join(', '));
});

array.push('eta', 'theta');
//-> To array added items: eta, theta
```

## Usage

#### .stream
Usage: `object.stream(type, [context])`

Returns: `Stream` object

Description: Creates stream of given event type. Can be used RegEx notation.

[`Warden.extend`](https://github.com/zefirka/Warden.js/blob/master/docs/Extend.md) gives you a Pub/Sub object from given, so your objects will have method `.stream` which listens all events of given type and evaluates all streams conjuncted with adequate object (look [DataBuses](https://github.com/zefirka/Warden.js/blob/master/docs/DataBus.md)). This method returns first DataBus associated with stream. To get stream use:
```js
var clicks = element.stream('click'),
    clicksSource = clicks.host;
```

#### Warden.Stream
Usage: `Warden.Stream(creator, [context], [strict])`

Returns: Stream object.

Description: creates stream. If type of `creator` is not `function`, then just creates stream which `.$$type` property equals to `creator` value, else it calls  `creator` function when first argument is Stream evaluation callback. `context` is a context of all stream processing methods and final callback. If `strict` argument is truthy, then it checks the text of `creator` and warns about the coincidence in properties name with `context` properties. It means if inside creator you want to define property in context with name `test` and context have alredy had property named `test`  then you will get excetpion.

```js
var defferedStream = Warden.Stream(function(emit){
    // emit - is function which fires stream with given argument
    setTimeout(function(){
      emit('Hello world!');
    }, 5000);
});

defferedStream.log();

//-> Hello world! (after 5 seconds)
```

Now let's try a tiny ajax module based on jQuery's `$.get`:
```js
var http = {}; // module

http.ajax = Warden.Stream(function(emit){
    function response(type){
      return function(data){
        emit({
            type: type,
            data: data
        });
      }
   }

    this.get = function(url){
        $.get(url)
          .success(response('success'))
          .error(response('error'))
    }
}, http) // <- look at context, inside of stream creation function

http.errors = http.ajax.filter(function(e){
  return e.type == 'error'
});

http.successes = http.ajax.filter(function(e){
  return e.type == 'success'
});

http.errors.map('.data').interpolate('HTTP ERROR! Status: {{statusText}}').log();
http.successes.log('HTTP SUCCESS!');

/* Let's test it now */
http.get('thereIsNoSuchPage.html');
//--> HTTP ERROR! Status: Not found
http.get('index.html');
//--> HTTP SUCCESS!
```

Strict checking: 
```js
var ctx = {
  x: 10;
}

Warden.Stream(function(f){
  this.x = 20;
})

// -> ERROR: 
// -> Coincidence: property: 'x' is already defined in stream context! Object {x: 10}
```

##### Difference between streams and hosts:
While stream's firing method fires only given stream, hosts' `eval` method firing all active streams of host. It pretty optimizing and allows to prevent situation when we creating a lots' of event listeners from DOM. Actually you can have only one listener of definitive type per node.

```js
var simpleStream = Warden.Stream();
var host = Warden.Host({x: 10});
var streamA = host.stream(); 
var streamB = host.stream(); 

simpleStream.map('Hello!').log();

simpleStream.fire(); // nothing happens

streamA.map('Hello')
streamB.map('World');

streamA.merge(streamB).log();

host.eval(); 

// -> Hello
// -> World
```