Warden.js
=========

Small declarative library for event-driven development

Warden.js library provides a functionality for the development of event-driven web-applications without any dependencies. You can emit custom events with [`.emit()`](#emit) method and listen them with [`.on()`](#on) method, you can also listen native DOM events. But the greatest is you can create and maintain event-streams with [`.stream()`](#stream) and programming event-bus. 

##Warden.create##

<img src="http://ps.cms-service.ru/warden/assets/img/warden.png" align="right" width="301px" style='z-index: 32323; position: relative;'/>

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
			timeout : timeout
		});
	})	
};
```
####on####
`.on(type, callback, [config])`
Binding callback as a handler for events which type is `type`.
####stream####
`.stream(type, [config])`
Creates event stream returns event Bus class item. You can use second argument to say, that you'r not binding on Warden.emitter's .on method and want to listen only your framework's listener's function. So, if your object is not, a class but a #HTML object for example, you can you `htmlObj.stream('click', 'addEventListener')`. But prefered way to configure listeners is say in `Warden.create` config param that you use nativeListener
####streamOf####

##Streams##
Stream is representing Bus class object.