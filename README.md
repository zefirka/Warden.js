Warden.js
=========

Small declarative library for event-driven development.

Warden.js provides a functionality for the development of event-driven web-applications without any dependencies. You can emit custom events with [`.emit()`](#emit) method and listen them with [`.on()`](#on) method, you can also listen native DOM events or extend EventEmitter class of Node. But the greatest is you can create and maintain streams of events with [`.stream()`](#stream) and [`.streamOf()`](#streamOf).

##Warden.create##

<img src="https://raw.githubusercontent.com/zefirka/Warden.js/master/src/warden.png" align="right" width="301px" style='z-index: 32323; position: relative;'/>

There is no dependencies with DOM, jQuery events or another event emitting system in the Warden library. If you want to your object can emit, listen and creating streams of events you should use <code>Warden.create</code> method.

[`Warden.create(constructor, [config])`](https://github.com/zefirka/Warden.js/blob/master/docs/EmitterDocs.md)
```js
var Clicker = Warden.create(function Clicker(btn){
	this.btn = btn;
});
```
or
```js
function Clicker(btn){
	this.btn = btn;
}
Warden.create(Clicker);
```
Now <code>Clicker</code> class has methods <code>.on</code>, <code>.emit</code>, <code>.stream</code> and `streamOf`. 

####Configuration####
You can configure next terms:
-  `max` - Count of maximal handlers per one event type. Default: 128
-  `nativeEmitter` - Name of native emitter function. For example $.trigger() for jQuery. Use it if your framework has already have event emitter method and you creating emittor from object that contains native emittor.
-  `nativeListener` - Name of native listener function. For example $.on() for jQuery, or .addEventListener for native browser's DOM API
-  `context` - Value of `this` variable in handler. Class object by default.

###Methods###
####emit####
`.emit(event)`
Emitting custom event. Use object notation to describe event. Event argument required `type` property. For example:
```js
object.prototype.async = function(timeout){
	var self = this;
	setTimeout(function(){
		self.emit({
			type : "async",
			msg : "timeout is ended",
		});
	})	
};
```
####on####
`.on(type, callback, [config])`
Binding callback as a handler for events which type is `type`.
####stream####
`.stream(type, [config])`
Creates event stream and returns event Bus class object. 
####streamOf####
`.streamOf(object, type, [config])`
Creates an event stream from `item[object]` 
##Streams##
Stream is representing Bus class object.