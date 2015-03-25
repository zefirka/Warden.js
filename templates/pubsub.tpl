<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
        <h2>Using Pub/Sub pattern with Warden</h2>
        <p>Using simple objects and ready modules</p>
        <pre><code  class="javascript">var empty = Warden();
empty.listen('foo', function(event){
  console.log(event.message);
});

empty.emit({type: 'foo', message: 'Hello World!'});

// -> Hellow World!
</code></pre>
        <p>When module is already exists.</p>
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
        <p>With constructors</p>

        </section>
      </div>
    </div>
  </div>
</div>
