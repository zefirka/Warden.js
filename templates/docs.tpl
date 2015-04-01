<div class="container">
  <div class="row">
    <div class="col-md-3 col-sm-3 hidden-xs col-lg-3">
      <div class="sticky">
        <h2>Methods</h2>
        <ul>
          
          <h4>Pub/Sub</h4>
        	<li><a href="#extend">Warden.extend</a></li>
        	<li><a href="#listen">listen</a></li>
        	<li><a href="#unlisten">unlisten</a></li>
          <li><a href="#emit">emit</a></li>
        	<li><a href="#stream">stream</a></li>

          <h4>FRP</h4>
          <h5>Streams and side effects</h5>
        	<li><a href="#stream_cr">Warden.Stream</a></li>
        	<li><a href="#listen_s">listen</a></li>
          <li><a href="#mute">mute</a></li>
          <li><a href="#clear">clear</a></li>
          <li><a href="#log">log</a></li>
        	<li><a href="#toggle">toggle</a></li>
        	<li><a href="#bindTo">bindTo</a></li>

          <h5>Calculus</h5>
        	<li><a href="#map">map</a></li>
        	<li><a href="#filter">filter</a></li>
        	<li><a href="#reduce">reduce</a></li>
        	<li><a href="#take">take</a></li>
        	<li><a href="#skip">skip</a></li>
          
          <h4>EDD</h4>
          <li><a href="#wait">waitFor</a></li>
          <li><a href="#after">after</a></li>
          <li><a href="#sync">sync</a></li>
          <li><a href="#resolveWith">resolveWith</a></li>
        </ul>
      </div>
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
<h2 id="listen">.listen</h2>
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
<h2 id="unlisten">.unlisten</h2>
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
<h2 id="emit">.emit</h2>
<p class='d-synopsis'>Synopsis: <code>object.emit(eventType, eventData)</code> or <code>object.emit(event)</code></p>
<p class='d-description'>Description: Fires event on <code>object</code>.</p>
<h3>Usage:</h3>
<p>Similiar to jQuery's <code>trigger</code> method. If you use map as single argument then event type is on <code>type</code> property and it's required! Note that <code>emit</code> - is method of object that emits event which you will should listen on <strong>same</strong> object.</p>
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

<!-- ================================================================== -->

<hr>
<h2 id="stream">.stream</h2>
<p class='d-synopsis'>Synopsis: <code>object.stream(eventType, [context])</code></p>
<p class='d-description'>Description: Creates a stream of events by given type.</p>
<h3>Usage:</h3>
<p>This method listens all events of given type and evaluates all streams conjuncted with adequate object (look <a href='#databus'><code>DataBuses</code></a>). This method returns first DataBus associated with stream.</p>
<pre><code class='javascript'>var clicks = $(document).stream('click');
clicks.listen(function(event){
  console.log('Clicket at: X=' + event.clientX +  ' Y=' + event.clientY);
})
</pre></code>
<p>By default context of evaluation is object self. Bus you can set context as second argument. Also you can use RegEx notation to set the types of stream.</p>


<hr class='bhr'>
<h2 id="stream_cr">Warden.Stream</h2>
<p class='d-synopsis'>Synopsis: <code>Warden.Stream([creator], [context], [isStrict])</code>.</p>
<p class='d-description'>Description: Creates stream of data.</p>
<h3>Usage:</h3>
<p><code>Warden.Stream</code> gives simple interface to create streams from any data source. Streams can contain data of any type.</p>
<pre><code class='javascript'>var clicks = $(document).stream('click');</pre></code>
<p>Can be rewrited as:</p>
<pre><code class='javascript'>var clicks = Warden.Stream(function(fire){
  $(document).on('click', fire);
}, $(document))</pre></code>
<p>Obsious that nobody will do that, but this example shows how to use <code>Warden.Stream</code></p>
<p>More common example:</p>
<pre><code class='javascript'>var seconds = Warden.Stream(function(fire){
  setInterval(fire, 1000);
})

var response = Warden.Stream(function(fire){
  $.get('url', fire);
})</pre></code>

<h3>Context:</h3>
<p>This method allows you to wrap all changes in system's state as data transmissions (synchronious or not), so you can manipulate your system easy with pure function without any side effects in while processing data.</p>
<p>Althrough, it's not required to use functional thinking while developing big applications with Warden. Warden gives a way to develop simple modules where you can incapsulate simple and predictive state. These modules can use dirty-functions, mutable state and not-protected data-sharing, and after, you can combine such simple components with each others with pure functions. It's a trade-off between true functional reactive programming and traditional event-driven style in imperative languages.</p>
<p>So context in Warden allows to implement these modules. In <code>Warden.Stream</code>, second argumens is context in <code>creator</code> function</p>
<pre><code class='javascript'>var http = {};
var gets = Warden.Stream(function(fire){
  this.get = function(url){
    $.get(url).always(fire);
  }
}, http);

gets.log();
http.get(location.href); //will logs curent document's markup to console
</pre></code>
<p>Or more idiomatic example, where we creating realy module with mutable state:</p>
<p><a href="away.html">(Look at Away example in tutorials)</a></p>
<pre><code class='javascript'>var pulsar = {};
var pulses = Warden.Stream(function(fire){
  var timer;

  this.start = function(interval){
    timer = setInterval(fire, interval)
  }

  this.clear = function(){
    clearInterval(timer);
  }

  this.start(1000);
}, pulsar);

pulses.map('PULSE').log();
pulsar.clear(); // stops pulses
pulsar.start(100); // runs pulses again with interval 100ms
</pre></code>


<hr>
<h2 id="listen_s">.listen</h2>
<p class='d-synopsis'>Synopsis: <code>stream.listen(callback)</code>.</p>
<p class='d-description'>Description: Subsribes callback to the stream.</p>
<h3>Usage:</h3>
<p>This methods creates listener of the given stream. Remember that in <code>callback</code> context variable (<code>this</code>) refered to the stream's evaluation context.</p>

<pre><code class='javascript'>var context = {x: 100};
var object = Warden();
var ticks = object.stream('tick', context);

ticks.listen(function(data){
  console.log('Transmitted data is:', data)
  console.log('Context is:', this)
});

object.emit('tick', {value : '*_*'})

// -> Transmitted data is: Object { value: '*_*' }
// -> Context is: Object { x: 100 }
</pre></code>

<h2 id="mute">.mute</h2>
<p class='d-synopsis'>Synopsis: <code>stream.mute([callback])</code>.</p>
<p class='d-description'>Description: Unsubsribes callback to the stream. <code>callback</code> can be string or function.</p>
<h3>Usage:</h3>
<p>This method removes from stream handlers given callback.</p>
<pre><code class='javascript'>function log(e){
  console.log(e);
}

// subsribing
stream.listen(log);

stream.mute('log');

//or

stream.mute(log);

</pre></code>
<p>Note that callback finds by <code>name</code> property, so you can remove wrong function if you use callbacks with same name.</p>
<pre><code class='javascript'>function callback(data){
  // do something with data
}
stream.mute(callback);

// Next examples are totaly equaivalent.
stream.mute('callback');
stream.mute(callback);
stream.mute(function callback(){});
</pre></code>

<h2 id="clear">.clear</h2>
<p class='d-synopsis'>Synopsis: <code>stream.clear()</code>.</p>
<p class='d-description'>Description: Unsubsribes all handlers from stream.</p>

<h2 id="log">.log</h2>
<p class='d-synopsis'>Synopsis: <code>stream.log([string])</code>.</p>
<p class='d-description'>Description: Alias for logging function with <code>.listen</code>. Logs to console transmitted data or <code>string</code>(if it given).</p>
<pre><code class='javascript'>//.log equals to
stream.log(); //same to
stream.listen(function log(e){
  console.log(e);
});

stream.log('hey'); // same to
stream.listen(function log(){
  console.log('hey');
});
</pre></code>
<p>You can "unlog" with <code>stream.mute('log')</code>.</p>
    </div>
  </div>
</div>