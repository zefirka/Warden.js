Warden.extend
=========

Module at: `./src/module/Extend.js`

Usage : `Warden.extend(object, config)`

Description: Extends object with `emit()`, `.listen()`, `unlisten()`and `.stream()` methods. And returns extented object;


###Usage###
####Extend objects with Warden.extend()###
Extension method is the base method of Warden, that extends objects or object constructors by methods that implements custom event triggering/listening for Pub/Sub pattern. You can extend simple JS objects, then that object will be transmitter for Pub/Sub or you can extend constructor of objects and then `emit`, `listen`  and `stream` will be methods of prototype.

#####With constructors#####
```js
var Box = Warden.extend(function Box(){
	//constructor of box
	this.addToBox = function(itemname){
		var self = this;
		return setTimeout(function(){
			self.emit({
				type: "added",
				item: itemname
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
or function that inctanced as constructo (like jQuery): 
```
Warden.extend($);
var clicks = $('body').stream('click');
clicks.listen("Hey, clicked to body")
```

####With simple objects####
```js

var module = Warden.extend({
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

var lols = module.stream('lol', {value: 'Value of other object'});

lols.listen(function(event){
	console.log("Now i'm lold inside of object that have value: "  + this.value);
});
```

####Configuration

You can configure next terms:
-  `emitter` - Name of native emitter function if you have such. For example $.trigger() for jQuery. Use it if your framework has already have event emitter method and you creating emittor from object that contains native emittor. If you use jQuery you can't dont use this configuration item because Warden automaticaly find it.
-  `listener` - Name of native listener function if you have such. For example $.on() for jQuery, or .addEventListener for native browser's DOM API, both of them you can don't configure. 
- `names` - Object of names you want to take your mathods. Can contain next properties: `emit`, `listen`, `stream`, `unlisten`.

###Methods###
####emit####
Usage: `object.emit(event)`

Returns: `object`

Emits custom event. If you use `emit([string])`, than it will emit event of `[string]` type empty event. To transfer data though event - use JSON:
```js

mod.emit({
	type : 'custom',
	data : 'some data!'
});

```

If you use JSON, event type is on `type` property and it's required. Note that `emit` - is method of object that emits event which you will can subscibe on same object.

####listen####
Usage: `object.listen(type, handler)`

Returns: `object`.

Attaching to the object handler that proces all events of `@type` type.
```js
mod.emit({
	type: 'custom',
	greet: 'Hello world!'
});

mod.listen('custom', function(event){
	console.log(event.greet);
});

// --> Hello world!
```

Handlers will be started in same order which they was registered. If you reach maximal number of handlers for current object you'l recieve error : `Maximal handlers count` in console.

####unlisten####
Usage: `object.unlisten(type, handler)`

Returns: `object`.

`handler` can be both string or function. Unsubscribes handler from object's `type` events.

####stream####
Usage: `object.stream(type, [context])`

Returns: `DataBus` object associated with created stream
```js
var recievedTweets = socket.stream('tweet'),
	recievedPosts = socket.stream('post');

recievedTweets
	.map({
		user : 'author',
		time : 'timestamp'
	})
	.listen(function(data){
		console.log("@" + data.user + " has been tweeted at " + data.time);
	});

recievedTweets.merge(recievedPosts).map(['author','type']).listen(function(data){
	console.log('@'+data[0]+" have made " + data[2]);
});

```
Creates stream of data. 