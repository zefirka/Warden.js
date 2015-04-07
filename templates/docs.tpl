<div class="container">
  <div class="row">
    <div class="col-md-3 col-sm-3 hidden-xs col-lg-3">
      <div class="sticky">
        <h2>Methods</h2>
        <ul class='methods'>
          
          <h4>Pub/Sub</h4>
        	<li><a href="#extend">Warden.extend</a></li>
        	<li><a href="#listen">listen</a></li>
        	<li><a href="#unlisten">unlisten</a></li>
          <li><a href="#emit">emit</a></li>
        	<li><a href="#stream">stream</a></li>

          <h4>FRP</h4>
          <h5>Side effects</h5>
        	<li><a href="#stream_cr">Warden.Stream</a></li>
        	<li><a href="#listen_s">listen</a></li>
          <li><a href="#mute">mute</a></li>
          <li><a href="#clear">clear</a></li>
          <li><a href="#log">log</a></li>
        	<li><a href="#toggle">toggle</a></li>
        	<li><a href="#bindto">bindTo</a></li>

          <h5>Calculus</h5>
        	<li><a href="#map">map</a></li>
          <li><a href="#get">get</a></li>
          <li><a href="#nth">nth</a></li>
        	<li><a href="#filter">filter</a></li>
        	<li><a href="#reduce">reduce</a></li>
        	<li><a href="#take">take</a></li>
        	<li><a href="#skip">skip</a></li>
          <li><a href="#diff">diff</a></li>
          <li><a href="#interpolate">interpolate</a></li>
          <li><a href="#mask">mask</a></li>
          
          <h5>Time</h5>
          <li><a href="#debounce">debounce</a></li>
          <li><a href="#collect">collect</a></li>
          <li><a href="#delay">delay</a></li>
          <li><a href="#repeat">repeat</a></li>

          <h5>Combining</h5>
          <li><a href="#merge">merge</a></li>
          <li><a href="#combine">combine</a></li>
          <li><a href="#resolve">resolve</a></li>

          <h5>Composing</h5>
          <li><a href="#collectfor">collectFor</a></li>
          <li><a href="#filterfor">filterFor</a></li>
          <li><a href="#wait">waitFor</a></li>
          <li><a href="#after">after</a></li>
          <li><a href="#alternately">alternately</a></li>
          <li><a href="#sync">sync</a></li>

          <h5>Blocking</h5>
          <li><a href="#swap">swap</a></li>
          <li><a href="#toggleon">toggleOn</a></li>
          <li><a href="#lock">lock</a></li>
          <li><a href="#lockt">lockThis</a></li>
          <li><a href="#ulock">unlock</a></li>
          <li><a href="#ulockt">unockThis</a></li>
          <li><a href="#after">watch</a></li>

          <h5>Arrays</h5>
          <li><a href="#extarr">Extend Arrays</a></li>
          <li><a href="#sequentially">sequentially</a></li>
          <li><a href="#repeatedly">repeatedly</a></li>

          <h5>Configure</h5>
          <li><a href="#wait">comparsion</a></li>
          <li><a href="#collectfor">extend DataBus</a></li>
          <li><a href="#datastr">stream memory</a></li>        

          <h4>Plugins</h4>
          <li><a href="#sync">Warden.Host</a></li>
          <li><a href="#flatMap">Warden.Worker</a></li>
          <li><a href="#after">Warden.Observe</a></li>
          <li><a href="#sync">Warden.Pipeline</a></li>
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
<p><code>isStrict</code> parameter configures would context creating strong. To avoid context overwriting use <code>true</code> in third parameter.</p>
<pre><code class='javascript'>var context = { some_value : ''};
Warden.Stream(function(){
  this.some_value = 12;
}, context, true);
// -> ERROR!
// Coincidence: property: 'some_value' is already defined in stream context! Object {some_value: ""}
</code></pre>

<hr>
<h2 id="fire">.fire</h2>
<p class='d-synopsis'>Synopsis: <code>stream.fire(value, [context])</code>.</p>
<p class='d-description'>Description: Pushes value to the stream.</p>

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



<hr>
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
stream.listen(callback);

// Next examples are totaly equaivalent.
stream.mute('callback');
stream.mute(callback);
stream.mute(function callback(){});
</pre></code>

<hr>
<h2 id="clear">.clear</h2>
<p class='d-synopsis'>Synopsis: <code>stream.clear()</code>.</p>
<p class='d-description'>Description: Unsubsribes all handlers from stream.</p>

<hr>
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

<hr>
<h2 id="toggle">.toggle</h2>
<p class='d-synopsis'>Synopsis: <code>stream.toggle(fn1, fn2)</code>.</p>
<p class='d-description'>Description: Unsubsribes to stream two handlers which calls after each other.</p>
<h3>Usage:</h3>
<p></p>
<pre><code class='javascript'>var stream = Warden.Stream();

stream.toggle(
  function(){
    console.log('Fired ODD times');
  },
  function(){
    console.log('Fired EVEN times');
  });

stream.fire()
// -> Fired ODD times
stream.fire()
// -> Fired EVEN times
stream.fire()
// -> Fired ODD times</code></pre>

<hr>

<h2 id="bindto">.bindTo</h2>
<p class='d-synopsis'>Synopsis: <code>stream.bindTo(object, [property])</code>.</p>
<p class='d-description'>Description: Binds stream's value to the object with a given signature.</p>
<h3>Usage:</h3>
<p>This method provides syntax sugar for binding side-effects to the stream evaluation on recieving value. Every <code>bindTo</code> signature can be replaced with <code>listen</code>.</p>
<p>With <code>bindTo</code> you can create and use side-effect fast and efficient. Behavior of handler depends of binding method's arguments signature.</p>
<h3>Signatures:</h3>
<h4> Stream -> Function</h4>
<p>Same as <code>stream.listen(callback)</code></p>
<pre><code class='javascript'>stream.bindTo(alert); // making side-effect alerting dialog</pre></code>
<h4>Object -> Method Name</h4>
<pre><code class='javascript'>stream.bindTo(console, 'log'); 
// calling console['log'] with recieved

stream.bindTo(window, 'alert');
//calls window.alert with recived data

stream.bindTo($('body'), 'html'); 
// calls $('body').html with recieved data
</pre></code>
<h4>Object -> Route to property</h4>
<pre><code class='javascript'>var parent = {child: {anotherChild: null }};

stream.bindTo(parent, 'child/anotherChild');
stream.fire('LOL');

console.log(parent.child);
// -> Object: { anotherChild : 'LOL' }

</pre></code>
<h4>Object -> Property Name</h4>
<pre><code class='javascript'>var o = {a: 1, b : {c: 2 }};

stream.bindTo(o, a);
stream.fire('LOL');
console.log(o);

// -> Object : { a: 'LOL', b : Object : { c : 2} }

stream.bindTo(o, b);
stream.fire('WUT');
console.log(o);
// -> Object : { a: 'WUT', b : 'WUT' }
</pre></code>

<hr class='bhr'>
<h2 id="map">.map</h2>
<p class='d-synopsis'>Synopsis: <code>stream.map(mapper)</code>.</p>
<p class='d-description'>Description: Returns new stream mapped by <code>mapper</code> signature.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>// creates stream from integers stream where all values mapped with given function
var stringIntegers = integers.map(function(integer){
  return integer.toString();
}); 
</pre></code>
<p>Warden gives a lot of syntax sugar for <code>map</code> function. So common task to take a property, or call method of given data, or call contex's method can be solved pretty fast:</p>
<pre><code class='javascript'>//take a property 
var values = stream.map(function(data){
  return data.value;
});

//equals to
var values = stream.map('.value');


// Call a method:
var namesArray = namesStream.map(function(names){
  return names.toArray();
}); 

var namesArray = namesStream.map('.toArray()');

// @-notation
// @-refers to the context variable

stream.map('@') //same to
stream.map(function(){
  return this;
})

// so

var scrolls = $(window).stream('scroll');
var scrollTops = scrolls.map('@scrollTop()');

// also Warden can use alias object for map

stream.map({
  newName : '.oldName',
  justName : 'justValue',
  newResult : '.method()',
  thisVar : '@',
  thisMethodResult : '@value()'
})

// same as :

stream.map(function(data){
  return {
    newName : data.oldName,
    justName : 'justValue',
    newResult : data.method(),
    thisVar : this,
    thisMethodResult : this.value(),
  }
});

// also you can call map with array of parameters

stream.map(['.name', 'justValue', '.method()', '@', '@value()'])

// same as :

stream.map(function(data){
  return [ data.name, 'justValue', data.method(), this, this.value()]
});

</pre></code>

<hr>
<h2 id="get">.get</h2>
<p class='d-synopsis'>Synopsis: <code>stream.get(route)</code>.</p>
<p class='d-description'>Description: Returns stream mapped with function which get's recieved data's property with access route equals to <code>route</code></p>
<h3>Usage:</h3>
<p>In this function <code>route</code> is a string which represents place of property (or array's item) in given object. For example:</p>
<pre><code class='javascript'>stream.get("foo/bar/[0]/baz"); // is same to

stream.map(function(object){
  return object.foo.bar[0].baz;
});
</code></pre>
<p><strong>Note: arrays should derive with object properties also with <code>/</code> symbol</strong></p>

<hr>
<h2 id="nth">.nth</h2>
<p class='d-synopsis'>Synopsis: <code>stream.nth(integer)</code>.</p>
<p class='d-description'>Description: Alias for <code>strem.map</code> with function which takes recived objects (which must be iterable) n-th element.</p>
<pre><code class='javascript'>stream.nth(0); // is same to

stream.map(function(object){
  return object[0];
});
</code></pre>

<h2 id="filter">.filter</h2>
<p class='d-synopsis'>Synopsis: <code>stream.filter([filterFn])</code> or <code>stream.filter([value])</code>.</p>
<p class='d-description'>Description: Returns new filtered stream.</p>
<h3>Usage:</h3>
<p>With functions.</p>
<p>Filtering function should return only boolean type. If function returns <code>0</code> or <code>""</code> it mean false.</p>
<pre><code class='javascript'>var odds = integers.filter(function(number){
  return number % 2 == 1;
});

var readFile;


// stream of read tries
var reads = Warden.Stream(function(fire){
  readFile = function(url){
    fs.readFile(url, function(err, data){
      var success = err ? false : true;
      fire({
        file: data,
        success : success
      });
    });
  }
});

//stream of readed files
var files = reads.filter(function(response){
  return respomse.success;
});
</pre></code>
<p>With values</p>
<p>If you use simple value then Warden creates filter function that compares recieved value with given. Comparing implemented with <code>Warden.configure.cmp</code> function, which just compares given values with <code>===</code> operator.</p>
<pre><code class='javascript'>stream.filter(true); // same to

stream.filter(function(e){
  return Warden.configure.cmp(e, true);
});

// same to

stream.filter(function(e){
  return e == true;
});
</pre></code>

<h2 id="reduce">.reduce</h2>
<p class='d-synopsis'>Synopsis: <code>stream.reduce([init], fn)</code>.</p>
<p class='d-description'>Description: Scan stream and calls <code>fn</code> with arguments of reduced value and current value.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var stream = Warden([1,2,3,4,5,6,7,8,9]).sequantiallty(1000);

stream.reduce(function(a, b){
  return a + b;
}).log();

// -> 1
// -> 3
// -> 6
// -> 10 ... etc

// creepy way to check out retweets

var retweeters = retweets.reduce('', function(authors, author){
  if(authors.length){
    if(authors.split(',').length >= 3){
      if(authors.indexOf('...')>=0){
        return authors.replace(/and (\d+) more$/, function(str){
          return str.replace(/\d+/, function(num){
            return parseInt(num) + 1;
          });
        })
      }else{
        return authors + " ... and 1 more";
      }
    }else{
      return authors + ", @" + author;
    }
  }else{
    return "@" + author;
  }
});</code></pre>

<hr>
<h2 id="take">.take</h2>
<p class='d-synopsis'>Synopsis: <code>stream.take(integer)</code>.</p>
<p class='d-description'>Description: Takes only <code>integer</code> values on stream (after last once unsubscribe all handlers).</p>

<hr>
<h2 id="skip">.skip</h2>
<p class='d-synopsis'>Synopsis: <code>stream.skip(integer)</code>.</p>
<p class='d-description'>Description: Skips first <code>integer</code>  values on stream.</p>

<hr>
<h2 id="diff">.diff</h2>
<p class='d-synopsis'>Synopsis: <code>stream.diff([compareFn])</code>.</p>
<p class='d-description'>Description: Takes only different values. Values compares with <code>Warden.configure.cmp</code> if <code>compareFn</code> don't set.</p>
<pre><code class='javascript'>var diffed = stream.diff(function(a, b){
  return a.value - b.value &gt; 100;
}).log();
// comparing values with given function;

diffed.fire(100);

// -> 100

diffed.fire(250);

// -> 250

diffed.fire(280);

// nothing happens</pre></code>

<hr>
<h2 id="interpolate">.interpolate</h2>
<p class='d-synopsis'>Synopsis: <code>stream.interpolate(string)</code>.</p>
<p class='d-description'>Description: Takes given string and interpolate to it recived value. Interpolations are simple atom data in mustache-style.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var str = "Hello, my name is {{user_name}}, I'm from {{user_city}}";

stream.interpolate(str).log();

stream.fire({
  user_name: "Trdat",
  user_city: "Moscow"
});

// -> Hello, my name is Trdat, I'm from Moscow
</pre></code>

<hr>
<h2 id="mask">.mask</h2>
<p class='d-synopsis'>Synopsis: <code>stream.mask(data)</code>.</p>
<p class='d-description'>Description: Takes data and interpolate it to the string recieved from stream.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var data = {
  user_name: "Trdat",
  user_city: "Moscow"
}

stream.mask(data).log();

stream.fire("Hello, my name is {{user_name}}, I'm from {{user_city}}");

// -> Hello, my name is Trdat, I'm from Moscow
</pre></code>

<hr class='bhr'>
<h2 id="debounce">.debounce</h2>
<p class='d-synopsis'>Synopsis: <code>stream.debounce(ms)</code>.</p>
<p class='d-description'>Description: Debouncing stream propagation in given <code>ms</code> miliseconds.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var stream = Warden.Stream().debounce(100).log();

// synchronoius running stream
stream.fire(1)
stream.fire(2)
stream.fire(3)

// after 100 ms:
// -> 3
</code></pre>

<hr>
<h2 id="collect">.collect</h2>
<p class='d-synopsis'>Synopsis: <code>stream.collect(ms)</code>.</p>
<p class='d-description'>Description: Collecting all values of stream for given <code>ms</code> miliseconds to array.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var stream = Warden.Stream().collect(100).log();

// synchronoius running stream
stream.fire(1)
stream.fire(2)
stream.fire(3)

// after 100 ms:
// -> [1, 2, 3]

// synchronoius running stream
stream.fire(1)
stream.fire(2)
stream.fire(3)

setTimeout(function(){
  stream.fire(4)
}, 85);

// after 100 ms:
// -> [1, 2, 3, 4]
</code></pre>

<hr>
<h2 id="delay">.delay</h2>
<p class='d-synopsis'>Synopsis: <code>stream.delay(ms)</code>.</p>
<p class='d-description'>Description: Delay's stream propagation for given <code>ms</code> miliseconds to array.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var stream = Warden.Stream().delay(100).log();

strea.fire('Hi!');

// after 100 ms:
// -> Hi!
</code></pre>

<hr>
<h2 id="repeat">.repeat</h2>
<p class='d-synopsis'>Synopsis: <code>stream.repeat(times, [delay])</code>.</p>
<p class='d-description'>Description: Repeats stream evaluation with every value given times with <code>delay</code>. Note: repeats are async, even if you set delay to zero.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var stream = Warden.Stream().repeat(5, 100).log();

strea.fire('Hi!');

// every 100 ms:
// -> Hi!
// -> Hi!
// -> Hi!
// -> Hi!
// -> Hi!
</code></pre>

<hr class='bhr'>
<h2 id="merge">.merge</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.merge(stream2, [stream3, stream4, ...])</code>.</p>
<p class='d-description'>Description: Merges two or more streams to one. Return new stream.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var clicks = $(document).stream('click'),
    keydowns = $(document).stream('keydown');

var clicksOrKeydowns = clicks.merge(keydowns);

</code></pre>

<hr>
<h2 id="combine">.combine</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.combine(stream2, combinerFn)</code>.</p>
<p class='d-description'>Description: Combines two streams with givetn function <code>combineFn</code>.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>function randomizer(max){
  return (Math.random() * (max + 1)) >> 0;
}

var maxStream =  stream1.combine(stream2, function (first, second){
  return first > second ? first : second;
});
</code></pre>

<hr>
<h2 id="resolve">.resolve</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.combine(stream2, resolver, [seed])</code>.</p>
<p class='d-description'>Description: Takes two streams and resolver function. Returns stream which gives value as a result of resolver function applyied to values of given streams.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>function first(a, b){
  return a > b ? a : b;
}

var maxStream =  stream1.combine(stream2, function (first, second){
  return first > second ? first : second;
});
</code></pre>

<hr class='bhr'>
<h2 id="collectfor">.collectFor</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.collectFor(stream2)</code>.</p>
<p class='d-description'>Description: Returns streams which collects all recieved values and transmit all of them as array when <code>stream2</code> evaluetes. </p>
<h3>Usage:</h3>
<pre><code class='javascript'>var keydowns = $(document).stream('keydown'),
    clicks = $(document).stream('click');

keydowns.collectFor(clicks).log(); // will log array of keydowns after every click
</code></pre>

<hr>
<h2 id="filterfor">.filterFor</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.filterFor(fn)</code>.</p>
<p class='d-description'>Description: Takes function which takes CGE Signature to filtrate values of stream.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var uniqueIntegers = stream.filterFor(function(e, p){
  var taken = p.get();

  if(taken && taken.indexOf(e)>=0){
    p.stop();
  }else{
    p.next(e, function(data, val){
      if(typeof data == 'object') { 
          data.push(val); 
          return data; 
        } else {
          return [val]
        } 
      });
   }
});
</code></pre>

<hr>
<h2 id="alternately">.alternately</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.alternately(stream2)</code>.</p>
<p class='d-description'>Description: Takes two streams and returns stream which evaluates when evaluetes first stream alternately second.</p>
<h3>Usage:</h3>
<pre><code class='javascript'>var toggles = ons.alternately(offs);
// this stream quaranties that evaluation of ons will be strongly after offs and offs after ons
</code></pre>

<hr>
<h2 id="wait">.waitFor</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.waitFor(stream2)</code>.</p>
<p class='d-description'>Description: Return stream which will evaluate only if <code>stream2</code> has been already evaluated strongly before <code>stream1</code>.</p>

<hr>
<h2 id="after">.after</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.after(stream2)</code>.</p>
<p class='d-description'>Description: Return stream which evaluates only after <code>stream2</code> (if it has been evaluated at least once).</p>

<hr>
<h2 id="sync">.sync</h2>
<p class='d-synopsis'>Synopsis: <code>stream1.sync(stream2, [stream3, stream4, ... streamN])</code>.</p>
<p class='d-description'>Description: synchronizes streams. Returns stream which will be evalueted only if all <code>stream1, strem2, ... stremN</code> have been evaluated.</p>

    </div>
  </div>
</div>

