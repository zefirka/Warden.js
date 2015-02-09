####  Extend module:

docs: ./docs/Extend.md

version: v2.1.0
  
  -- v2.1.0
    Added full regexp notation for listen/stream/emit/unlisten

  -- v2.0.0
    Added regext for events (listen and emit)
    Fixed array extension usage (now simplier)

  -- v1.1.0 --
    Incapsulated $$handlers and now shows only $$id of object
    Added extended arrays methods sequentially and toBus
    Added multiple events listenins, unlistening and streaming

  -- v1.0.1 --
    Removed maximal handlers counter
    Changed array observation methods, now it's own properties of new array (extented)

  -- v1.0.0 --
    Added array changes observation.
    Stabilized default configuration behavior with current deepExtend (Utils/extend) method.
    Changed all functions from ES5 to Utils module analogues.

  This methods extends @obj which can be function, object or array with Warden.js methods .emit(), .listen(), .unlisten() and .stream()

####  Utilities module
specs: specs/src/utilsSpecs.js
version: 1.3.0
  
  - v.1.3.0
Added reduce
Make global optiomization

  - v1.2.3
    Derived .log  to .interpolate (common interpolation method) and .log (logs with interpolation)
    Added toArray method
    Added trim method

  - v1.2.2
    Added some props to analyzator's ,ap
    Added Flatten method

  - v1.2.1
    Added .log function (logging with interpolation)
    Divided Warden core Analyzer with user's

  - v1.2.0
    Fixed data type analyzer. Now it checks not by typeof but by Utils.is[type] method.
    Added .some and .every methods. 
    Added specs for utils.

  - v1.1.0
    Most of functional style reverted cause it is too slow.

  - v1.0.0
    All checing methods changed with functional paradigm.

  - v0.0.1
    Datatype checking functions. Array prototype forEach method wrap for ECMAScript 3. 

#### Streams module:
docs: ./docs/Streams.md
version: 1.0.0

  - v1.0.0
    Added sprint/stop method.

  - v0.3.3
    Added $context in object. Removed class name.

  - v0.3.2 
    Fixed mistakes in pop and push down and up

  - v0.3.0
    Stream strict checking argument now must be only boolean true

  - v0.2.0
    Added @popAllDown and @popAllUp methods;

Creates stream of data.
If @x is string, that it interprets as datatype
else if @x is function, than x's first arg is emitting data function