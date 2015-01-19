Warden.extend
=========

Source at: `./src/module/Extend.js`

Usage : `Warden.extend([inheritor], [config])`

Description: Extends `inheritor` with `emit()`, `.listen()`, `unlisten()`and `.stream()` methods. And returns extented object. If inheritor is empty than returns extended empty object. Inheritor can be function, object or array.


## Usage

Extension method is the base method of Warden, that takes objects/constructors/arrays and returns them extended by methods that implements event triggering/listening for Pub/Sub pattern. You can extend simple JS objects, then that object will be transmitter for Pub/Sub or you can extend constructor of objects and then `emit`, `listen`  and `stream` will be methods of prototype. If you extending array then you will get new array item with own Pub/Sub methods ([look here](#with-arrays)).

##### With constructors
```js
var Box = Warden.extend(function Box(){
	//constructor of box
	this.addToBox = function(item){
		var self = this;
		return setTimeout(function(){
			self.emit({
				type: "added",
				item: item
			});
		}, 2000);
	}
});

var myBox = new Box();

myBox.listen('added', function(event){
	//this is a handler of custom event
	console.log("Into box added " + event.item + " item.");
});

myBox.addToBox("watermellon");

// --> Into box added watermellon item.

```
or function that instanced as constructor, like jQuery (actually Warden extending jQuery automatically if find it):

```js
var clicks = $(document).stream('click');
clicks.log("Hey, user clicked to page")
```

#### With simple objects
Than Pub/Sub methods is own properties of object.
```js
var module = Warden.extend({
	value : 'some value',
	asyncLol : function(data){
		var self = this;
		setInterval(function(){
			self.emit({
				type: "lol",
				data: data
			});
		}, 1000);
	}
});

module.listen('lol', function(event){
	//here @this is @module
	console.log("I lol'd! And recieved data is " + event.data);
});

var lols = module.stream('lol');

lols.listen(function(event){
	console.log("I'm lold inside of object that have value: "  + this.value);
});
```
#### With arrays
By default array extension allows to listen next methods calls: 'pop', 'push', 'splice', 'reverse', 'shift', 'unshift', 'sort' (only destructing methods). [You can configure it](#arrconfig).

```js
var personas = Warden.extend(['Jack', 'Bob', 'Alice']);

personas.listen('push', function(changes){
	console.log('To the array was pushed names: ' + changes.data.join(', '));
});

personas.push('Fonzee', 'Jane');
// -> To the array was pushed names: Fonzee, Jane

```

### Configuration

You can configure next terms:
-  `emitter` - Name of native emitter function if you have such. For example $.trigger() for jQuery. Use it if your framework has already have event emitter method and you creating emittor from object that contains native emittor. If you use jQuery you can't dont use this configuration item because Warden automaticaly find it.
-  `listener` - Name of native listener function if you have such. For example $.on() for jQuery, or .addEventListener for native browser's DOM API, both of them you can don't configure.
- `names` - Object of names you want to take your mathods. Can contain next properties: `emit`, `listen`, `stream`, `unlisten`.
- <a name="arrconfig"></a> 'arrays' - Array of array's method names which should be listened in extended arrays. By default: `['pop', 'push', 'splice', 'reverse', 'shift', 'unshift', 'sort']`  


## Methods

### .emit
Usage: `object.emit(event)` or `object.emit(name, [data])`

Returns: `object`

Description: Emits event.
```js
mod.emit({
	type : 'custom',
	data : 'some data!'
});

// is equivalent

mod.emit('custom', {data: 'some data!'});
```

If you use JSON, event type is on `type` property and it's required. Note that `emit` - is method of object that emits event which you will should subscribe on same object.

### .listen
Usage: `object.listen(type, handler)`

Returns: `object`.

Description: Attaching to the object handler that process all events of `type` type.
```js
mod.emit('greet', 'Hello World!');

mod.listen('greet', function(greeting){
	console.log(greeting);
});

// --> Hello World!
```
#### Regular Expressions
<a name="regexp-notation"></a>You can also use regular expressions notation, which mean that you can listening methods in terms of matching of JS RegExp objects. Example:
```js
mod.listen('get:*', function(e){
	console.log(e);
});

mod.emit('get:one', 'foo');
//--> foo
mod.emit('get:two', 'bar');
//--> bar
```

or

```js
mod.listen('^cl[io]ck(ed)?(\\d+)?$', function(type){
	console.log(type);
});

// it will be called for every event type that match to given regex.
// For example: 'click', 'clock', 'clicked', 'clicked2', 'clicked232323'
```

Handlers will be started in same order which they was registered.

__Deprecated__: If you reach maximal number of handlers for current object you'l recieve error : `Maximal handlers count` in console.

### .unlisten
Usage: `object.unlisten(type, handler)`

Returns: `object`.

Description: Unsubscribes handler from object's `type` events. `handler` can be both string or function. Note: if you handled lambda-function to the event you can't unsubscribe it, because functions comparing by name property.
Allowed [regexp notation](#regexp-notation)

### .stream
Usage: `object.stream(type, [context])`

Returns: `DataBus` object associated with created stream

Description: Creates stream of events and associated to it new DataBus object. Allowed [regex notation](#regexp-notation).

```js
var recievedTweets = socket.stream('tweet'),
	recievedPosts = socket.stream('post');

recievedTweets
	.map({
		user : 'author',
		time : 'timestamp'
	})
	.listen(function(data){
		console.log("@" + data.user + " has been tweeted at " + new Date(data.time));
	});

recievedTweets
	.merge(recievedPosts)
	.map(['author','type'])
	.listen(function(data){
		console.log('@'+data[0]+" have made " + data[2]);
	});

```

or with comma notation:

```js
var userActions = document.stream('click, mousemove, keypress, user:*');
```

__Configuration of context:__
By default context of evaluation is equal object which takes stream.
```js
var module = Warden.extend({
	foo: 'bar'
});

module.stream('ev').listen(function(data){
	console.log(this);
});

module.emit('ev');

//--> {foo: 'bar'}
```
But you can set your own context:
```js
module.stream('goo', {baz: 'Hello!'}).listen(function(){
	console.log(this);
});

module.emit('goo');

//--> {baz: 'Hello!'}
```
