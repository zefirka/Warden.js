<div class="container">
  <div class="row">
    <div class="col-md-3 col-sm-3 hidden-xs col-lg-3">
      <h2>Methods</h2>
      <ul>
      	<li><a href="#extend">extend</a></li>
      	<li><a href="#listen">listen</a></li>
      	<li><a href="#unlisten">unlisten</a></li>
        <li><a href="#emit">emit</a></li>
      	<li><a href="#stream">stream</a></li>
      	<li><a href="#stream_cr">Stream</a></li>
      	<li><a href="#extend">listen</a></li>
      	<li><a href="#extend">toggle</a></li>
      	<li><a href="#bindTo">bindTo</a></li>
      	<li><a href="#map">map</a></li>
      	<li><a href="#filter">filter</a></li>
      	<li><a href="#reduce">reduce</a></li>
      	<li><a href="#take">take</a></li>
      	<li><a href="#skip">skip</a></li>
      </ul>
    </div>
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-9" id='docs'>
    	
<h2 id="extend">Warden.extend</h2>
<p class='d-synopsis'>Synopsis: <code>Warden([inheritor], [config])</code> or <code>Warden.extend([inheritor], [config])</code></p>
<p class='d-description'>Description: Extends <code>inheritor</code> with <code>emit</code>, <code>listen</code>, <code>unlisten</code> and <code>stream</code> methods. And returns extented object. If inheritor is empty than returns extended empty object. Inheritor can be function, object or array.</p>
<h3>Usage</h3>
<p>Extension method is the base method of Warden, that takes objects/constructors/arrays and returns them extended by methods that implements Pub/Sub pattern's methods. After extension you can use methods <a href="#listen"><code>listen</code></a>, <a href="#unlisten"><code>unlisten</code></a>, <a href="#emit"><code>emit</code></a>, <a href="#stream"><code>stream</code></a>.</p> 
<p>If extending object already has Pub/Sub methods then Warden uses them. By default event emitting/triggering objects detects by methods <code>addEventListener</code> or <code>on</code>, but you can configure them too.</p>
<p>You can configure names of methods by property <code>names</code>.</p>
<h3>Configuration</h3>
<p>You can configure next terms:</p>
<ul>
  <li><code>emitter</code> - Name of native emitter function if you have such. For example <code>$.trigger()</code> for jQuery. Use it if your framework has already have event emitter method and you creating emittor from object that contains native emittor. If you use jQuery you can't dont use this configuration item because Warden automaticaly find it.</li>
  <li><code>listener</code> - Name of native listener function if you have such. For example $.on() for jQuery, or .addEventListener for native browser's DOM API, both of them you can don't configure.  By default equals <code>addEventListener</code></li>
  <li><code>names</code> - Object of names you want to take your mathods. Can contain next properties: <code>emit</code>, <code>listen</code>, <code>stream</code>, <code>unlisten</code>. Values are adequate to Warden's mehthods.</li>
</ul>

<hr>
<h2 id="listen">listen</h2>
<p class='d-synopsis'>Synopsis: <code>object.listen(eventType, callback)</code></p>
<p class='d-description'>Description: Adds to the <code>object</code> handler of events with type of <code>eventType</code>.</p>
<h3>Usage:</h3>
<p>This method simliar to native <code>addEventListener</code>, first argument is event type (string) second is callback.</p>
<p>Warden also provides RegEx notation acces to event types, you can use regular expression-like type and set handler to all events which type will match to regex. RegEx notation works also for <a href="#stream"><code>stream</code></a>.</p>
<pre><code class='javascript'>object.listen('greet', function(greeting){
  console.log(greeting);
});

object.emit('greet', 'Hello World!');

// --> Hello World!

// With regexps

object.listen('get:*', function(e){
    console.log(e);
});

object.emit('get:one', 'foo');
//--> foo

object.emit('get:two', 'bar');
//--> bar
</code></pre>
<p>Also you can subscribe to the different types of events by separating types by comma</p>

<!-- ================================================================== -->

<hr>
<h2 id="unlisten">unlisten</h2>
<p class='d-synopsis'>Synopsis: <code>object.unlisten(eventType, callback)</code></p>
<p class='d-description'>Description: Removes from <code>object</code> handler of events with type of <code>eventType</code> with name <code>callback</code>.</p>
<h3>Usage:</h3>
<p>Similiar to native <code>removeEventListener</code>, when second arguments can be function or string which is name of handler.</p>
<p><strong>Warning: you can't use RegEx notation in <code>unlisten</code> method.</strong></p>
<pre><code class='javascript'>object.listen('x', function callback(v){
console.log(v);
});

object.emit('x', 1);

// --> 1

// Now removing handler

object.unlisten('x', 'callback');

object.emit('x', 1);
// nothing happens
</code></pre>    

<!-- ================================================================== -->


<hr>
<h2 id="emit">emit</h2>
<p class='d-synopsis'>Synopsis: <code>object.emit(eventType, eventData)</code> or <code>object.emit(event)</code></p>
<p class='d-description'>Description: Fires event on <code>object</code>.</p>
<h3>Usage:</h3>
<p>Similiar to jQuery's <code>trigger</code> method.</p>
<pre><code class='javascript'>object.listen('custom', function(e){
  console.log(e);
})

object.emit('custom', 'value');

// -> value

object.emit({
  type: 'custom',
  value: 'value'
});

// -> {type: 'custom',  value: 'value' }
</code></pre>    

<hr>
<h2 id="stream">stream</h2>
<p class='d-synopsis'>Synopsis: <code>object.stream(eventType, [context])</code></p>
<p class='d-description'>Description: Creates a stream of events by given type.</p>

<hr class='bhr'>
<h2 id="listen">Warden.Stream</h2>
<p class='d-synopsis'>Synopsis: <code>object.emit(eventType, eventData)</code> or <code>object.emit(event)</code></p>
<p class='d-description'>Description: Removes from <code>object</code> handler of events with type of <code>eventType</code> with name <code>callback</code>.</p>
    </div>
  </div>
</div>