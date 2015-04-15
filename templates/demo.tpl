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
					<h2>Event composing</h2>
				</td></tr>	
				<tr>
     			</td>
     			<td width="50%">
<pre><code class='javascript'>var timer;
button.addEventListener('click', function(){
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
     		</tbody>
     	</table>
      	
      	
     
    </div>
  </div>
</div>