Stream
=========

Source at: `./src/modules/Stream.js` : Stream module
Source of pipeline `./src/modules/Pipeline.js`

Create :
 - `object.stream(type, [context])` - Creates an event stream
 - `Warden.Stream([creator], [context], [strict])` - creates a custom stream
 - `Warden([nonObjectValue])` - creates stream which already contains given value

Usage:
 - `stream[methodName]([params])[methodName]([params])...` - Chain of methods
 - `streamA + streamB` - operations which calls `.valueOf` (returns last taken value of stream)

## Concept
Each source of data can host stream, each one of them represent a pipeline for data which we take from source. When host evaluates (takes data from event/callback/timer/etc) all associated stream evaluating too. Streams are the simple roads of your application, with them  you could take and process data through time and avoid troubles of asynchronious programming. With composing methods of streams you can declare behavior of data flow. Most of stream methods (except subsribing and handling side-effects) return new stream object inherited from given.Like in functional languages real state incapsulated into call stack, real state in Warden incapsulated into stream processor stack.

## Firing and side-effects
You can process data in streams by pure functions because every processing method like `map` or `reduce` returns new stream object inherited from current. At the end you need to make side-effects. Methods [`.listen`](#listen-fn) , [`bindTo`](#bindto) and [`.toggle`](#toggle-fn) are developed for that. By combining, merging and conjuncting streams you can cover any side-effect you want. Side-effect methods doesn't create new stream.

# Methods

Let's prepare something for examples.

```js
Warden(document);

var clicks = document.stream('click'),
    keydowns = document.stream('keydown'),
    mousemoves = document.stream('mousemove'),
    ticks = Warden.Stream(function(emit){
      setInterval(function(){
        emit('TICK!');
      }, 1000)
    });
```

## Side-effects
This functions

  - <a href="#log-fn"></a>`log([text])` - logs transmitted value to the console. If `text` is setted then logs that value.

    ```js
      ticks.log(); // -> TICK! (every second)
      ticks.log('Hello World!'); // -> Hello World! (every second)
      ticks.log('Get: $'); // -> Get: TICK! 
    ```

    Notation of `log` allows you use `$` symbol as given data in text (will use `.toString` to convert value to string in `log`).

  - <a href="#listen-fn"></a>`listen(callback)` - handled `callback` to stream

    ```js
      clicks.listen(function(event){
        console.log("You clicked at x:" + event.clientX + " y:" + event.clientY );
      });
    ```

  - <a href="toggle-fn"></a>`toggle(onFn, offFn)` - calls given functions alernately one after other when stream is firing.

    ```js
      var emitted = 0;
      clicks.toggle(
        function(){
          console.log('ODD');
        },
        function(){
          console.log('EVEN');
        });
    ```

  - `bindTo` - binds transmitted value. Result depends on arguments signature. Look at [Binding](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)

## Processing

You can see result just logging these buses with [`.log()`](#log-fn) method.

  - #### map 
      `.map(f)` - mapping stream
      If `f` is function - then stream will transmit `f(value)` else will transmit `f`

      ```js
        ticks.map(10).log(); // logs 10
        ticks.map(function(e){
          return e.toLowerCase();
        }).log(); // logs: tick! (instead of TICK!)
      ```

  - #### grep
      `.grep(proc)` - taking data from stream with given pattern. It's more complex and flexible variant of `.map()`.

      - With functions (same as `map`):

        ```js
          clicks.grep(function(event){
            return event.clientX + event.clientY;
          }) // -> will transmit event's coordinates sum
        ```

      - With simple values (same as `map`):

        ```js
          clicks.grep(12) // -> will transmit 12
          clicks.grep('Hello!') // -> will transmit 'Hello'
        ```

      - With properties of event or context:

        ```js
          clicks.grep('.clientX') // equals to:

          clicks.map(function(event){
            return event.clientX;
          })

          clicks.grep('.handle()') // equals to:

          clicks.map(function(event){
            return event.handle();
          })

          clicks.grep('@prop') //equals to:

          clicks.map(function(){
            return this.prop;
          })

          clicks.grep('@method()') //equals to

          clicks.map(function(){
            return this.method();
          })

          clicks.grep('@') //equals to

          clicks.map(function(){
            return this;
          })
        ```

      - With multiple values:
        ```js
          clicks.grep(['.clientX', '.clientY']) //equals to
          
          clicks.map(function(event){
            return [event.clientX, event.clientY];
          })
        ```

      - With object of aliases. Usage: `.grep({ alias: 'value' })`
        ```js
          clicks.grep({
            x: '.clientX',
            y: '.clientY',
            ctx: '@',
            event: '.'
            deep: '.a.b.c'
            fn: '.fn("arg")',
            deepInContext: '@a.b.c()'
          })// equals to

          clicks.map(function(e){
            return {
              x: e.clientX,
              y: e.clientY,
              ctx: this,
              event: e,
              deep: e.a.b.c,
              fn: e.fn("arg"),
              deepInContext: this.a.b.c()
            }
          })
        ```

      - With expressions where `$` symbol replaces with transmitting data:
        ```js
          clicks.grep(' ($.clientX * 2) + $.clientY ') //equals to

          clicks.map(function(e){
            return ( e.clientX * 2) + e.clientY;
          });
        ```

      
  - #### reduce
    `reduce([initial], fn)` -if `initial` skiped, then initial value will be first taken value of stream
    ```js
        clicks.map('.clientX').reduce(function(a, b){
          return a + b;
        })

        ticks.reduce('Start', function(a, b){
          return a + ":" + b;
        }).log() // -> Start:TICK!:TICK!:TICK ...
    ```

## Filtering

  - `filter(f)` 
    if `f` is function then transmits only events which `f(event) === true`, else transmits only events equals to `f`:
   
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
  - `debounce(miliseconds)` - debouncing transmission of stream for given time in ms. It means that if there was events emitted during given interval then stream will transmit only last.
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

  - `collectFor(stream)` - collecting all events and flush them when `stream` is fired
      ```js
      keydowns.map('.keyCode').map(String.fromCharCode).collectFor(clicks).log();
      // press a lot of keys and after it click on document
      // -> logs all of their's chars as array
      ```

  - `delay(ms)` - delays every transmission for given time in ms

  - `repeat(count, ms)` - repeats transmission `count` times with given interval in ms (it's always async)

  - `pipe(fn)` - takes pipe function which takes 2 arguments: data and `next` function:
    ```
      ticks.pipe(function(data, next){
        setTimeout(function(){
          next("DELAYED: " + next);
        }, 1000)
      }).log();

      // will log "DELAYED: TICK!" with one second delay
    ```

## Composing
  - #### merge
    `merge(stream1, [stream2, ... streamN])` - merges stream with current. Returns new stream (inheritance loses).
    ```js
      var userActions = clicks.merge(keydowns, mousemoves);
      userActions.log('User have made something on document');
    ```

  - #### sync
    `sync(stream1, [stream2, ... streamN])` - syncing streams with current (inheritance loses)
    ```js
      var synced = clicks.sync(keydowns, mousemoves);
      synced.log();
      // will loges:
      // [MouseClickEvent, KeyDownEvent, MouseMoveEvent] only when they all will be fired
    ```

  - #### after and waitFor
    `after(stream)` - return stream that fires only if `stream` was fired before

    `waitFor(stream)` - return stream that fires when `stream` firing and only if current stream was already fired

    `alternately(stream)` - return stream that fires alternately first given stream after `stream`

  - #### combine and resolve
    `combine(stream, fn, seed)` - return stream that emits combined with given function events with current last and given stream' last event
      ```js
      var xs = clicks.map('.clientX'),
          ys = clicks.map('.clientY');

      xs.combine(ys, function(x,y){
        return "SUMM: " (x+y);
      }, 0).log();
      ```

    `resolve(stream, fn)` - resolve one event by function `fn` which gives two arguments: first is data from current stream, second is data from second stream;
      ```js
      clicks.resolve(keydowns, function(e1, e2){
        return e1.timeStamp > e2.timeStamp ? {event: 'keydown'} : {event: 'click'};
      }).interpolate("{{event}} was first").log()
      ```

## Locking/Unlocking
  -  `swap(state)` - locks or unlocks stream

## Properties

 - `data` - collected data. It's object contains properties: `fires`, - array of fired events on stream, `takes` - array of taken events of stream, `last` - last taken value
 - `parent` - parent stream
 - `children` - array of children streams

## Other
  `stream.watch()` - method that makes your stream observable
  `stream.bindTo` - [data binding](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)
