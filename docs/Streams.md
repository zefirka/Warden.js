Streams
=========

Module at: 
	- `./src/module/Streams.js` : Streams module
	- `./src/module/DataBus.js` : DataBus module

Usage : 
	- `object.stream(type, [context])` - Create an event stream,
	- `Warden.makeStream(creator)` - Create custom data stream


##Streams of events##
Потоки событий создаются из пользовательских событий или кастомных событий, созданных разработчиком, но так или иначе эмитированных напрямую либо через .emit(), либо косвенно, - через нативные триггеры. Это могут быть как DOM события, так и кастомные события извещающие о каких-то действиях в стандартно паттерне Pub/Sub.

```js
Warden.extend(document);
var clicks = document.stream('click');
clicks.listen('User clicked at document'); // logging that into console
```

##Creating custom data streams##
Кроме пользовательских данных можно создавать потоки любых данных. Такая нотация позволяет оформить практические любые изменения состояния системы как передачу данных. Неважно синхронно ли это происходит, или асинхронно. 

```js
var pulse = Warden.makeStream(function(emit){
	var timer = 0;
	this.start = function(){
		timer = setInterval(function(){
			emit("PULSE!); 
		}, 1000);
	};
	this.stop = function(){
		clearInterval(timer);
	}
	this.start();
}).get();

pulse.log(); // will log to console PULSE! every second

// pulse.context.stop() - will stop pulsing
// pulse.context.start() - will start pulsing
```

###Usage###
####Extend objects with Warden.extend()###


