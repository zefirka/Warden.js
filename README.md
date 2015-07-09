# Warden.js [![Build Status](https://travis-ci.org/zefirka/Warden.js.svg?branch=master)](https://travis-ci.org/zefirka/Warden.js) 

<img src="./src/warden.png" align="center" width="728" style='display: block; z-index: 32323; position: relative;'/>

Small declarative library for event-driven development in functional reactive style.

## Concept

Warden.js provides instruments to make development of event-driven applications easy and declarative. General idea of Warden.js that to make composing, combining and resolving concurrent events simpler. In mathematical sense, idea that to change your app's events representation from tree of states to the partially ordered set in time (or other) priority relation.

Warden.js is not pure functional library. It's trade-off between pure FRP and traditional event-driven development. It's good solution for ready event-driven applications. If you don't want to think how to construct app with true functional practices from start or/and you already have partially ready app then you can try Warden to make you life easy.

#### Warning! Breaking changes from 0.3.*. Documentation deprecated for 0.4.*

## Documentation [![GitHub version](https://badge.fury.io/gh/zefirka%2Fwarden.js.svg)](http://badge.fury.io/gh/zefirka%2Fwarden.js)
  - [Pub/Sub](https://github.com/zefirka/Warden.js/blob/master/docs/Extend.md)
  - [Creating streams](https://github.com/zefirka/Warden.js/blob/master/docs/Streams.md)
  - [Using streams](https://github.com/zefirka/Warden.js/blob/master/docs/Stream.md)
  - [Binding data](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)
  - [Reactive calculations](https://github.com/zefirka/Warden.js/blob/master/docs/Formulas.md)

## Why Warden.js?

 - There are no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js. You can use it on the front and on the back. With jQuery or with Node's Event Emiter or without anything. It's flexible.
 - Simple declarative methods to combine, conjuncte and resolve concpetually connected events. Like `sync` or `resolve`. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining events in time and resolving problems - then Warden.js is for you.
 - Pretty flexible API. There are no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.
 - It's not pure functional, but stay simple. In Warden you can create modules with dirty state, but if you're sure that these modules are simple and state is predictable. So after you can combine and reuse modules in more declarative way. It's not required to use pure functional programming technics from start to end while develop with Warden.
 - It's lighweight. Current version (0.3.5): 15 KB (5.9 KB gzipped). And it comes with crossbrowser utilities package.
 - It's configurable. You can extend stream processing methods, create your own methods, configure data types and comparsion checking.
 - Low-level functional abstraction. You can write a bunch of cool things. An events sampler (for example).

## Why not Warden.js?

  - Too early to use it in really large and demandig applications. Currently library is pretty raw. No community, no experience. If you are orienting to the secure, high performance, popular library or framework don't use Warden.js. But you can help us make it [better](https://github.com/zefirka/Warden.js/issues)!
  - Weaky realization of F from FRP. If you are looking at ready solutions for pure functional in reactive way - check out [Bacon](https://github.com/baconjs/baconjs),  [kefir](https://github.com/pozadi/kefir), [ProAct](https://github.com/proactjs/proactjs)
  - Low performance. In optimal usage it's faset than Bacon.js, but if you want to stay pure functional you could find that Warden is much more slower than Kefir, RxJS (sometimes it's a bit of slower than Bacon.js). 
  - Low-level functional abstraction. You should write a bunch of code to develop an events sampler (for example).

## Installation and usage

### Node [![npm version](https://badge.fury.io/js/warden.js.png)](http://badge.fury.io/js/warden.js)
    npm install warden.js

and

    var Warden = require('warden.js');

### Browser
    bower install warden.js

and

    <script src="path/to/warden.js"></script>

## Contribute
We're always glad to new pull requests or issues. Feel free to make contributions.
