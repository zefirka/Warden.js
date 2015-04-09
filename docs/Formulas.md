Formula
=========

Usage :
 - `Warden.Formula(dependencies, formula)` - Create streams which updates, when each on of dependencies streams update
 

```js
var a = Warden(1),
    b = Warden(2);

console.log(a + b); 
// -> 3;

var c = Warden.Formula([a,b], function(a, b){
  return a + b;
});

console.log(+c); // +c because to call c.valueOf()
// -> 3

a.fire(4);

console.lof(+a); // now a stream contains 4
// -> 4

console.log(+c); // c updates automaticaly
// -> 6
```