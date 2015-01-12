DataBus
=========

Source at: `./src/module/DataBus.js` : DataBUs module

Create :
 - `object.stream(type, [context])` - Creates an event stream and returns associated data bus,
 - `stream.bus()` - Creates data bus associated with `stream`

Usage:
 - `bus[methodName]([params])[methodName]([params])...` - Chain of methods.

## Concept
Each stream (as source of data) can host data buses. Data bus is a pipeline for data which we take from stream.


## Firing and side-effects
Actualy, you can process data in data bus by pure functions because every processing method like `map` or `reduce` returns new data bus object inherited from current.

## Methods

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

### Side-effects
This functions

  - `log([text])` - logs transmitted value to the console. If `text` is setted then logs that value.

    ```js
      ticks.log(); // -> TICK! (every second)
      ticks.log('Hello World!'); // -> Hello World! (every second)
    ```

  - `listen(callback)` - handled `callback` to the data bus.

    ```js
      clicks.listen(function(event){
        console.log("You clicked at x:" + event.clientX + " y:" + event.clientY );
      });
    ```

  - `toggle(fn1, fn2)` - puts two functions to the data bus pipe and calls them one after one every time bus is firing.

    ```js
      clicks.toggle(
        function(){
          console.log('EVEN');
        },
        function(){
          console.log('ODD');
        }).log();
    ```

  - `bindTo` - binds transmitted value of event. Look at [Binding](https://github.com/zefirka/Warden.js/blob/master/docs/Bind.md)

### Processing

You can see result just logging these buses with `.log()` method.

  - `map(proc)` - processing transmitted data.

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

      - With properties:
        ```js
          clicks.map('.clientX') // equals to:
          clicks.map(function(event){
            return event.clientX;
          })

          clicks.map('@prop') //equals to:
          clicks.map(function(){
            return this.prop;
          })
        ```
      -With multiple values:
        ```js

        ```

      -With object of aliases:

        ```js

        ```

  - `get(line)` transmits event's property in "path/to" notatation
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
  - `reduce(initial, fn)`
  - `nth(number)` - transmits array's n-th element.
      ```js
        ticks.map(['alpha', 'betta', 'gamma']).nth(0).log() // -> 'alpha'
      ```

  - `include(ins)`

### Filtering

  - `filter(fn)` - transmits only events which `fn(event) === true`.
    ```js
      clicks.filter(function(event){
        return event.clientX > 512;
      })
    ```

  - `skip(number)` - skips 'number' events.
  - `take(number)` - takes only `number` events.

    ```js
      clicks.skip(5).take(5) //skips first 5 clicks and takes only 5 clicks
    ```

  - `unique(compractor)` - transmits only unique events. Checks with (`===` comparing operation) if `compractor` is not setted.

    ```js
      clicks.unique(function(a, b){
        return a.clientX === b.clientX && a.clientY === b.clientY;
      })
    ```

  - `equals(value, compractor)` - transmits only events which value equals to `value`. Checks with (`===` comparing operation) if `compractor` is not setted.

    ```js
      clicks.map('.clientX').equals(100)
    ```

### Interpolation
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

### Timing
  - `debounce(miliseconds)` - debouncing transmission of bus for given time in ms.
  - `getCollected(miliseconds)` - collecting transmission's data for given time in ms and then flush them to the next processor
  - `collectFor(bus)` - collecting transmission's data and flush them to the given `bus`
  - `delay(ms)` - delays every transmission for given time in ms
  - `repeat(count, ms)` - repeats transmission `count` times with given interval in ms (it's always async)

### Composing
  - `merge(bus1, [bus2] ... [busN])` - merges buses with current
  - `sync(bus1, [bus2] ... [busN])` - syncing buses with current
  - `syncFlat(bus1, [bus2] ... [busN])` - syncing given buses with current to the flat array
  - `after(bus)` - return bus that will be fired only after than `bus` will be evaluated
  - `waitfor` -
  - `combine` -
  - `resolveWith(bus, fn)` -

## Properties
