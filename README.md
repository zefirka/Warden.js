# Warden.js

<img src="./src/warden.png" align="center" width="728" style='display: block; z-index: 32323; position: relative;'/>

Small declarative library for event-driven development in functional reactive style.

## Concept

Warden.js provides instruments to make development of event-driven applications easy. It requires no dependencies. It comes with no outer plugins for jQuery or Node.js.

General idea of Warden.js that to make composing, combining and resolving concurrent events simpler. In mathematical sense, idea that to change your app's events representation from tree of states to the partially ordered set in time (or other) priority relation.

## Documentation
  - [Including Pub/Sub](https://github.com/zefirka/Warden.js/blob/master/docs/Extend.md)
  - [Creating streams](https://github.com/zefirka/Warden.js/blob/master/docs/Streams.md)
  - [Using streams](https://github.com/zefirka/Warden.js/blob/master/docs/DataBus.md)
  - [Binding data](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)

## Why Warden.js?

 - There are no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js. You can use it on the front and on the back. With jQuery or with Node's Event Emiter or without anything.
 - Simple declarative methods to combine, conjuncte and resolve concpetually connected events. Like `sync` or `resolveWith`. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining events in time and resolving problems - then Warden.js is for you.
 - Pretty flexible API. There are no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.
 - It's lighweight. Current version (0.2.0): 15.3 KB. And it's with datatype checking and crossbrowser utilities package.
 - Real immutable data streams gives you access to taken data on every step of computation (if you need). That gives you power to develop really cool stream handlers.
 - Low-level functional abstraction. You can write a bunch of cool things. An events sampler (for example).

## Why not Warden.js?

  - Too early to use it in really large and demandig applications. Currently library is too raw. No community, no experience. If you are orienting to the secure, high performance, popular library or framework don't use Warden.js. But you can help us make it [better](https://github.com/zefirka/Warden.js/issues)!
  - Weaky realization of F from FRP. If you are looking at ready solutions for pure functional in reactive way - check out [Bacon](https://github.com/baconjs/baconjs),  [kefir](https://github.com/pozadi/kefir), [ProAct](https://github.com/proactjs/proactjs)
  - Low performance
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
