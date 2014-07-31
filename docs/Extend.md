Warden.extend
=========

Module at: `./src/module/Extend.js`
Usage : `Warden.extend(object, config)`
Description: Extends object with `emit()`, `.listen()` and `.stream()` methods. And returns extented object;

###Usage###
####Extend objects with Warden.extend()###
Extension method is the base method of Warden, that extends objects or object constructors by methods that implements custom event triggering/listening for simple Pub/Sub pattern

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
-  `max` - Count of maximal handlers of unique event type per each object. Default: 512
-  `emitter` - Name of native emitter function if you have such. For example $.trigger() for jQuery. Use it if your framework has already have event emitter method and you creating emittor from object that contains native emittor. If you use jQuery you can't dont use this configuration item because Warden automaticaly find it.
-  `listener` - Name of native listener function if you have such. For example $.on() for jQuery, or .addEventListener for native browser's DOM API, both of them you can don't configure. 
-  `context` - Value of `this` variable in handler. Extented object by default.

###Methods###
####emit####
Emits custom event



