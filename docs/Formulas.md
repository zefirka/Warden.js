Formula
=========

Formulas is a way to represent dependencies of streams with other streams. Making long story short - formulas are values in time.

Usage :
 - `Warden.Formula(dependencies, formula)` - Create formula stream which updates, when each one of dependencies streams update
 

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
console.log(c.value); 
// -> 3

a.fire(4);

console.lof(+a); // now a stream contains 4
// -> 4

console.log(+c); // c updates automaticaly
// -> 6

a.value = 10;
console.log(c.value); 
// -> 12

```