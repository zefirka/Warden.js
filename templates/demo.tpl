<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <h1>Tutorials and examples</h1>
     	<table id='demo-tab'>
     		<thead>
     			<tr>
     				<th width="50%">Vanilla</th>
     				<th width="50%">Warden</th>
     			</tr>
     		</thead>
     		<tbody>
     			<tr><td colspan='2'>
     				<h2>Streaming events</h2>
     			</td></tr>
     			<tr>
     			<td width="50%">
<pre><code class='javascript'>eventSource.on('eventType', function(eventData){
  if(valied(eventData)){
    rootObject.result = processData(eventData);		
  }
});
</code></pre>
     			</td>
     			<td width="50%">
<pre><code class='javascript'>eventSource
  .stream('eventType')
  .filter(valid)
  .map(processData)
  .bindTo(rootObject, 'result');
</code></pre>
				</tr>

        <tr><td colspan='2'>
          <h2>Event processing</h2>
        </td></tr>  
        <tr>
          </td>
          <td width="50%">
<pre><code class='javascript'>var cachedTime;
button.addEventListener('click', function(e){
  var self = this;
  clearTimeout(timer);
  timer = setTimeout(function(){
    send(self.value);
  }, 500)
});
</code></pre>
          </td>
          <td width="50%">
<pre><code class='javascript'>Warden(button)
  .stream('click')
  .debounce(500)
  .map('@value')
  .listen(send);
</code></pre>
          </td></tr>

          <tr><td colspan='2'>
          <h2>Event composing</h2>
        </td></tr>  
        <tr>
          </td>
          <td width="50%">
<pre><code class='javascript'>var cachedTime, cachedFrom;
function log(data){
  console.log('Data from socket ' + data.socket_name + ' was recived first');
}

/* Actually i dunno does this implements neccesary logic or not. It's too hard */

function callback(e){
  if(!cachedFrom){
    cachedFrom = e.socket_name;
    cachedTime = e.timeStamp;
  }else{
    if(cachedFrom != e.socket_name){
      if(cachedTime > e.timeStamp){
          log(e)
      }else{
        cachedTime = e.timeStamp
      }
    }else{
      cached_time = e.timeStamp;
    }
  }
}

socket.on('a', callback);
socket.on('b', callback);
</code></pre>
          </td>
          <td width="50%">
<pre><code class='javascript'>socket.stream('a').resolve(socket.stream('b'), function(a, b){
  return a.timeStamp > b.timeStamp ? a : b;
}).listen(function(data){
  console.log('Data from socket ' + data.socket_name + ' was recived first');
})
</code></pre>
          </td></tr>

				<tr><td colspan='2'>
					<h2>Reactive Calculations</h2>
				</td></tr>	
     			<tr>
     			<td width="50%">
<pre><code class='javascript'>var a = 10;
var b = 20;
var c = a + b;
console.log(c); 

// -> 30;

a = 20;
console.log(c);

// -> 30
// To update you need:
c = a + b;
console.log(c)
// -> 40
</code></pre>
     			</td>
     			<td width="50%">
<pre><code class='javascript'>var a = Warden(10);
var b = Warden(20);
var c = Warden.Formula([a,b], function(x,y){
  return x + y;
});

console.log(c.value); 
// -> 30

a.value = 20;
console.log(c.value); 
// -> 40  
// It updates itself
</code></pre>
				</tr>

				<tr><td colspan='2'>
					<h2>Values in time</h2>
				</td></tr>	
     			<tr>
     			<td width="50%">
<pre><code class='javascript'>var a = 0;
var b = 0;
function bigger(x, y){
	return x > y ? x : y;
}

var c = bigger(a, b);

a = 20;
b = 10;
// c = 0;
c = bigger(a, b);
// c = 20
b = 30;
c = bigger(a, b)
// c = 30
// need to update c every time
</code></pre>
     			</td>
     			<td width="50%">
<pre><code class='javascript'>var a = Warden(0);
var b = Warden(0);
var c = a.combine(b, bigger).watch();

a.value = 20;
// c.value  = 20

b.value = 30;
// c.value = 30;

a.value = 40;
// c.value = 40;
</code></pre>
				</tr>
     		</tbody>
     	</table>
      	
      	
     
    </div>
  </div>
</div>