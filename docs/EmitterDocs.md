Emitter
=========

Wrapping class to implement <code>emit()</code>, <code>.on()</code> and <code>.stream()</code> interface;


###Usage###
####Creation###

If you want to create your own event-emitting objects use <code>Warden.module</code>

<pre>
var className = Warden.module(function(){
	//constructor
});
</pre>

Now you can do 
<pre>
	var classObject = new className();

	classObject.emit({
		type : "eventType",
		val : "some text"
	});

	//callback style
	classObject.on("eventType", function(e){
		// context - class object
		// e - emitted event;
	}, {
		//config
	});

	//streams
	var stream = classObject.stream("eventType");
</pre>

###Methods###
####emit####



