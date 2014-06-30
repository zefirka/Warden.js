Emitter
=========

Wrapping class to implement <code>emit()</code>, <code>.on()</code> and <code>.stream()</code> interface;


###Usage###
####Creation with Warden.create(cnstr)###

If you want to create your own event-emitting objects use <code>Warden.create</code>

```js
var className = Warden.create(function className(){
	//constructor of class
});
```

Now you can do:
```js
	var classObject = new className();

	// Registers event handler 
	classObject.on("custom", function(ev){
		/* 
			context ('this' variable) is classObject
			ev is emitted event
		*/
	}, {
		// settings
	});

	// Creating stream of events
	var customEventStream = classObject.stream("custom");

	// Listening stream
	customEventStream.listen(function(ev){
		/* 
			context ('this' variable) is classObject
			ev is emitted event
		*/
	});

	// Emitting custom event
	classObject.emit({
		type: "custom",
		value: Math.random()
	});
```

###Methods###

####emit####



