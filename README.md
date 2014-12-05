Warden.js
=========

Small declarative library for event-driven development in functional reactive style.

Warden.js provides a functionality for the development of event-driven applications. It requires no dependencies. You can emit custom events with [`.emit()`](#emit) method and listen them with [`.listen()`](#listen) method, you can also listen native DOM events or extend EventEmitter utility of NodeJS. But the greatest is you can create and maintain event streams with [`.stream()`](#stream). And more: you can create a custom data streams by [`Wardem.makeStream()`](#makeStream).

##Why Warden.js?##

<img src="./src/warden.png" align="right" width="301px" style='z-index: 32323; position: relative;'/>

 - There is no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js library. If you want to your object can emit, listen and creating streams of events you should use <code>Warden.extend</code> method to extend your objects (or constructor's prototypes) with Pub/Sub methods (`emit`, `listen`, `unlisten`, `stream`).
 - Simple combine, conjuncte and resolve concpetually connected events. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining and resolving problems - that Warden.js is for you.
 - Pretty flexible API. There is no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.
 - It's lighweight. Current version (0.1.0): 13.6 KB. And it's with datatype checking, utilities package and internal plugin system with configuration.
 - Low-level functional abstraction. You cant write a bunch of cool things. An events sampler (for example).
 
##Why not Warden.js?##
 
  - Too early to use it in realy large and demandig applications. Currently library is too raw. If you are orienting to the secure, verified, popular library or framework don't use Warden.js. But you can help us make it [better](https://github.com/zefirka/Warden.js/issues)!
  - It's just a weaky realization of FRP with too flexible API. If you are looking at ready solutions check out [kefir](https://github.com/pozadi/kefir) or [SWARM](https://github.com/gritzko/swarm).
  - Low-level functional abstaction. You should write a bunch of code to develop an events sampler (for example).
  
##Installation (NodeJS)##

    npm install warden.js
  
##Contribute##
We're always glad to new pull reqests or issues. Feel free to make contributions.
