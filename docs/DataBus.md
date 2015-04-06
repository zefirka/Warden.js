Streams as DataBuses
=========

Source at: `./src/modules/DataBus.js` : DataBUs module
Source of pipeline `./src/modules/Pipeline.js`


Create :
 - `object.stream(type, [context])` - Creates an event stream and returns associated data bus,
 - `Warden.Stream([creator], [context], [strict])` - creates a simple stream,
 - `Warden.Host([context]).newBus()` - Creates data bus associated with given host.

Usage:
 - `bus[methodName]([params])[methodName]([params])...` - Chain of methods.

## Concept
Each source of data can host data buses (e.g. streams), each one of them represent a pipeline for data which we take from source. When stream evaluated (takes data from event/callback/timer/etc) all associated data buses evaluating too. Data buses is the simple roads of your application could take and process data. With composing methods of data buses you can declare behavior of your application. All data buses are immutable. It means that every method (except .listen, .toggle and .log) of data bus returns new data bus inherited from given, so you can implement side-effects and don't worry about state. Like in functional languages real state incapsulated into call stack, there real state incapsulated into data bus processor stack.


## Firing and side-effects
Actualy, you can process data in data bus by pure functions because every processing method like `map` or `reduce` returns new data bus object inherited from current. Finally you can process side-effects in methods [`.listen`](#listen-fn) and [`.toggle`](#toggle-fn). Combining, merging and conjuncting data buses you can cover any side-effect you want. Side-effect methods doesn't create new data bus, they return that data bus from which was called.

# Methods

Let's prepare something for examples.

```js
Warden.extend(document);

var clicks = document.stream('click'),
    keydowns = document.stream('keydown'),
    mousemoves = document.stream('mousemove'),
    ticks = Warden.makeStream(function(emit){
      setInterval(function(){
        emit('TICK!');
      }, 1000)
    }).bus();
```

## Side-effects
This functions

  - <a href="#log-fn"></a>`log([text])` - logs transmitted value to the console. If `text` is setted then logs that value.

    ```js
      ticks.log(); // -> TICK! (every second)
      ticks.log('Hello World!'); // -> Hello World! (every second)
    ```

  - <a href="#listen-fn"></a>`listen(callback)` - handled `callback` to the data bus.

    ```js
      clicks.listen(function(event){
        console.log("You clicked at x:" + event.clientX + " y:" + event.clientY );
      });
    ```

  - <a href="toggle-fn"></a>`toggle(onFn, offFn)` - puts two functions to the data bus pipe and calls them one after one every time bus is firing.

    ```js
      var emitted = 0;
      clicks.toggle(
        function(){
          console.log('ODD', emitted++);
        },
        function(){
          console.log('EVEN', emitted++);
        }).log();
    ```

  - `bindTo` - binds transmitted value of event. Look at [Binding](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)

## Processing

You can see result just logging these buses with [`.log()`](#log-fn) method.


  - #### map
      `.map(proc)` - mapping data bus

      - With functions:

        ```js
          clicks.map(function(event){
            return event.clientX + event.clientY;
          }) // -> will transmit event's coordinates sum
        ```

      - With simple values:

        ```js
          clicks.map(12) // -> will transmit 12
          clicks.map('Hello!') // -> will transmit 'Hello'
        ```

      - With properties of event or context:

        ```js
          clicks.map('.clientX') // equals to:
          clicks.map(function(event){
            return event.clientX;
          })

          clicks.map('.handle()') // equals to:
          clicks.map(function(event){
            return event.handle();
          })

          clicks.map('@prop') //equals to:
          clicks.map(function(){
            return this.prop;
          })

          clicks.map('@method()') //equals to
          clicks.map(function(){
            return this.method();
          })

          clicks.map('@') //equals to
          clicks.map(function(){
            return this;
          })
        ```

      - With multiple values:
        ```js
          clicks.map(['.clientX', '.clientY']) //equals to
          clicks.map(function(event){
            return [event.clientX, event.clientY];
          })
        ```

      - With object of aliases. Usage: `.map({ alias: 'value' })`
        ```js
          clicks.map({
            x: '.clientX',
            y: '.clientY',
            ctx: '@',
            event: '.'
          })// equals to

          clicks.map(function(e){
            return {
              x: e.clientX,
              y: e.clientY,
              ctx: this,
              event: e
            }
          })
        ```

  - #### get
      `get(route)` transmits event's property in "path/to" notatation

      ```js
        clicks.get('path/[0]') // equals to:
        clicks.map(function(event){
          return event.path[0];
        })

        clicks.get('path/to/object/[3]/or/[0]') // equals to
        clicks.map(function(event){
          return event.path.to.object[3].or[0];
        })
      ```
  - #### reduce
    `reduce([initial], fn)` -if `initial` skiped, then initial value will be first taken value of data bus
    ```js
        clicks.map('.clientX').reduce(function(a, b){
          return a + b;
        })

        ticks.reduce('Start', function(a, b){
          return a + ":" + b;
        }).log() // -> Start:TICK!:TICK!:TICK ...
    ```
  - #### nth
    `nth(number)` - transmits array's (n+1)-th element.
      ```js
        ticks.map(['alpha', 'betta', 'gamma']).nth(1).log() // -> 'alpha'
      ```

## Filtering

  - `filter(f)` - if `f` is function then transmits only events which `f(event) === true`, else transmits only events equals to `f`:
  - 
    ```js
      // will transmit only clicks with clientX more than 512
      clicks.filter(function(event){
        return event.clientX > 512;
      })

      ```js
      // will transmit only clicks with clientX equals to 512
      clicks.map('.clientX').filter(512)
    ```

  - `skip(number)` - skips 'number' events.
  - `take(number)` - takes only `number` events.

    ```js
      clicks.skip(5).take(5) //skips first 5 clicks and takes only 5 clicks
    ```

  - `diff(compractor)` - transmits only different events. Checks with (`===` comparing operation) if `compractor` is not setted.

    ```js
      clicks.unique(function(a, b){
        return a.clientX === b.clientX && a.clientY === b.clientY;
      })
    ```


## Interpolation
  - `mask(data)` - masking event (which is string like `"Hello {{data}}"`) with given data (like `{data: "World!"}`),
      ```js
        ticks.map('User: {{name}}, Email: {{email}}').mask({
          name: 'John',
          email: 'abc@test.com'
        }).log() // -> User: John, Email: abc@test.com
      ```

  - `interpolate(string)` - interpolates to the given `string` (which should be templated mustache style) transmitted data
      ```js
      ticks.map({
        name: 'John',
        email: 'abc@test.com'
      }).interpolate('User: {{name}}, Email: {{email}}').log() // -> User: John, Email: abc@test.com
      ```

## Timing
  - `debounce(miliseconds)` - debouncing transmission of bus for given time in ms. It means that if there was events emitted during given interval then data bus will transmit only last.
      ```js
        keydowns.map('.keyCode').map(String.fromCharCode).debouce(1000).log();
        // press a lot of keys
        // -> logs last key's char
      ```

  - `collect(miliseconds)` - collecting all events for given time in ms and then flush them to the next processor.
      ```js
        keydowns.map('.keyCode').map(String.fromCharCode).collect(1000).log();
        // press a lot of keys
        // -> logs all of their's chars as array
      ```

  - `collectFor(bus)` - collecting all events and flush them when `bus` is fired
      ```js
      keydowns.map('.keyCode').map(String.fromCharCode).collectFor(clicks).log();
      // press a lot of keys and after it click on document
      // -> logs all of their's chars as array
      ```

  - `delay(ms)` - delays every transmission for given time in ms

  - `repeat(count, ms)` - repeats transmission `count` times with given interval in ms (it's always async)

## Composing
  - #### merge
    `merge(bus1, [bus2] ... [busN])` - merges buses with current. Returns new bus (inheritance loses).
    ```js
      var userActions = clicks.merge(keydowns, mousemoves);
      userActions.log('User have made something on document');
    ```

  - #### sync
    `sync(bus1, [bus2] ... [busN])` - syncing buses with current (inheritance loses)
    ```js
      var synced = clicks.sync(keydowns, mousemoves);
      synced.log();
      // will loges:
      // [MouseClickEvent, KeyDownEvent, MouseMoveEvent] only when they all will be fired
    ```

  - #### after and waitFor
    `after(bus)` - return bus that fires only if `bus` was fired before

    `waitFor(bus)` - return bus that fires when `bus` firing and only if current bus was already fired

    `alternately(bus)` - return bus that fires alternately first given stream after `bus`

  - #### combine and resolve
    `combine(bus, fn, seed)` - return bust that emits combined with given function events with current last and given bus' last event
      ```js
      var xs = clicks.map('.clientX'),
          ys = clicks.map('.clientY');

      xs.combine(ys, function(x,y){
        return "SUMM: " (x+y);
      }, 0).log();
      ```

    `resolve(bus, fn)` - resolve one event by function `fn` which gives two arguments: first is data from current bus, second is data from second bus;
      ```js
      clicks.resolve(keydowns, function(e1, e2){
        return e1.timeStamp > e2.timeStamp ? {event: 'keydown'} : {event: 'click'};
      }).interpolate("{{event}} was first").log()
      ```

## Properties

 - `data` - collected data. It's object contains properties: `fires`, - array of fired events on bus, `takes` - array of taken events of bus, `last` - last taken value
 - `parent` - parent bus
 - `children` - array of children buses

## Other
  `bus.watch()` - method that makes your bus observable
  `bus.bindTo` - [data binding](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)
