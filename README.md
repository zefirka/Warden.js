Warden.js
=========

Small declarative library for event-driven development in functional reactive style.

## Concept

Warden.js provides a functionality for the development of reactive event-driven applications in functional style. It requires no dependencies.

General idea of Warden.js that to make composing, combining and resolving concurrent events  simpler. In mathematical sense, idea that to change your app's representation from tree of states to the partially ordered set of events in time (or other) priority relation.

## Documentation
  - [Including Pub/Sub](https://github.com/zefirka/Warden.js/blob/master/docs/Extend.md)
  - [Creating streams](https://github.com/zefirka/Warden.js/blob/master/docs/Streams.md)
  - [Using streams](https://github.com/zefirka/Warden.js/blob/master/docs/DataBus.md)
  - [Binding data](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)

## Why Warden.js?

<img src="./src/logo.png" align="right" width="301px" style='z-index: 32323; position: relative;'/>

<<<<<<< HEAD
 - There are no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js. You can use it on the front and on the back. With jQuery or with Node's Event Emiter or without anything.  
 - Simple combine, conjuncte and resolve concpetually connected events. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining events in time and resolving problems - that Warden.js is for you.
 - Pretty flexible API. There are no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.
 - It's lighweight. Current version (0.1.4): 15.7 KB. And it's with datatype checking, utilities package and internal plugin system with configuration.
 - Low-level functional abstraction. You can write a bunch of cool things. An events sampler (for example).

## Why not Warden.js?

  - Too early to use it in really large and demandig applications. Currently library is too raw. No community, no experience. If you are orienting to the secure, verified, popular library or framework don't use Warden.js. But you can help us make it [better](https://github.com/zefirka/Warden.js/issues)!
  - It's just a weaky realization of FRP with too flexible API. If you are looking at ready solutions check out [Bacon](https://github.com/baconjs/baconjs),  [kefir](https://github.com/pozadi/kefir)
  - Low-level functional abstraction. You should write a bunch of code to develop an events sampler (for example).

## Installation and usage

### Node
    npm install warden.js

and

    var Warden = require('warden.js');

### Browser
    bower install warden.js

and

    <script src="path/to/warden.js"></script>

## Contribute
We're always glad to new pull requests or issues. Feel free to make contributions.
