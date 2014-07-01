Emitter
=========

Wrapping class to implement <code>emit()</code>, <code>.on()</code> and <code>.stream()</code> interface;


###Usage###
####Creating objects with Warden.create()###
If you want to create your own event-emitting object use <code>Warden.create()</code>

```js
var className = Warden.create(function className(){
	//constructor of class
},{
	//configuration, not required
});
```
Example:
```js
var Clicker = Warden.create(function Clicker(name){
	this.name = name;
});

// some custom event emitting function
Clicker.prorotype.async = function(){
	var self = this;
	setTimeout(function(){
		self.emit({
			type: "custom",
			msg : "Hellow World! My name is " + self.name
		});
	}, 3000);
}

var clickerObject = new Clicker('Jared');

// Registring handler
clickerObject.on('custom', function(e){
	alert(e);
});

clickerObject.async(); 
```
After 3 seconds we see alert with message "Hello world! My name is Jared". 

###Methods###

####emit####



