Warden.js
=========

Small declarative library for event-driven development

Warden.js library provides a functionality for the development of event-driven web-applications without any dependencies. You can emit custom events with [`.emit()`](#emit) method and listen them with [`.on()`](#on) method, you can also listen native DOM events. But the greatest is you can create and maintain event-streams with [`.stream()`](#streams) and programming event-bus. 

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
Now <code>Clicker</code> class has methods <code>.on</code>, <code>.emit</code> and <code>.stream</code> and you can use them.

####Configuration####
You can configure next terms:
-  [`max`] - Count of maximal handlers per one event type. Default: 128

###Methods###
####emit####
Emitting custom event. Event argument required [`type`] property.
[`.emit(event)`]
####on####
[`.on(type, callback, [config])`]
####stream####
[`.stream(type, [listenerFunction])`]
