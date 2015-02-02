Warden.watcher
=========

Source at: `./src/module/Watcher.js`

Usage : `Warden.watcher(bus, [params])`

Description: Binding data from bus to computed from `params` value.

## Usage
```js
var clicksX = Warden.extend(document).stream('click').map('.clientX').watch();

clicksX.bindTo(window, 'lastClickX');

```
or
```js
Warden.watcher(clicksX, window, 'lastClickX');
});
```

## Syntax
```js
bus.bindTo(string) -> this[string] = event
bus.bindTo(function) -> function(event)
bus.bindTo(object, line) -> line(object) = event
bus.bindTo(objtct, methodNmae) -> object[methodName](event)
```
