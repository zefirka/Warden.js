Host
=========

Source at: 
  - `./src/module/Host.js` : Host module
  
Usage :
 - `Warden.Host([context])` - Create streams host with given context.
 

Streams in Warden.js are simple pipelines which associated with some host. Hosts are made to prevent avoid creating a lot of similiar DOM (or not)listeners of same nodes and objects. 

## Usage
```js
var host = Warden.Host();

var a = host.newStream();
var b = host.newStream();

a.map('A').merge(b.map('B')).log();

a.fire(); // nothing happens
b.fire(); // nothing happens

host.eval();

// -> B
// -> A



```