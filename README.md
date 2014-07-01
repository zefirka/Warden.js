Warden.js
=========

Small declarative library for event-driven development

Warden.js library provides a functionality for the development of event-driven web-applications without any dependencies. You can emit custom events with <code>[`.emit()`](#emit)</code> method and listen them with <code>[`.on()`](#on)</code> method, you can also listen native DOM events. But the greatest is you can create and maintain event-streams with <code>[`.stream()`](#streams)</code> and programming event-bus. 

##Warden.create##

<img src="http://ps.cms-service.ru/warden/assets/img/warden.png" align="right" width="301px" style='z-index: 32323; position: relative;'/>

There is no dependencies with DOM, jQuery events or another event emitting system in the Warden library. If you want to your object can emit, listen and creating streams of events you should use <code>Warden.create</code> method.

<code>[`Warden.create(constructor, [config])`](https://github.com/zefirka/Warden.js/blob/master/docs/EmitterDocs.md)</code>
```js
var Clicker = Warden.create(function Clicker(name){
	this.name = name;
});
```
Now <code>Clicker</code> class has methods <code>.on</code>, <code>.emit</code> and <code>.stream</code> and you can use them.
