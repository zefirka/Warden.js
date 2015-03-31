<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
        <h2>Using Pub/Sub pattern with Warden</h2>
        <h3>Simple objects and ready modules</h3>
        <p><code>Warden</code> is function that extends object with methods <code>listen, unlisten, emit, stream</code>.</p>
        <pre><code  class="javascript">var empty = Warden();
empty.listen('foo', function(event){
  console.log(event.message);
});

empty.emit({type: 'foo', message: 'Hello World!'});

// -> Hellow World!
</code></pre>
        <p>When object is already exists.</p>
        <pre><code  class="javascript">Warden(module); 
// now module has Warden methods
module.listen('foo', function(event){
  console.log(event.message);
});

module.emit({type: 'foo', message: 'Hello World!'});

// -> Hellow World!
</code></pre>
        <p>With modules which already have Pub/Sub methods with 'addEventListener' or 'on' methods</p>
        <pre><code  class="javascript">Warden(document);
document.listen('click', function(){
  console.log('Hey! You clicked at me!');
});

//or 
</code></pre>
        <h3>With constructors</h3>
        <p>If your module implemented as class constructor:</p>
        <pre><code  class="javascript">var Mammal = Warden(function Mammal(name){
  this.name = name;
        });
Mammal.prototype.say = function(){
  this.emit('say', {
    name: this.name
  });
}

var dog = new Mammal('Zorg');

//subscribing on event
dog.listen('say', function(e){
  console.log('Hello my name is ' + e.name);
});

dog.say();

// -> Hello my name is Zorg;
</code></pre>
        </section>
      </div>
    </div>
  </div>
</div>
