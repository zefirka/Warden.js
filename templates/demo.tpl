<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <h1>Tutorials and examples</h1>
     	<table>
     		<thead>
     			<tr>
     				<th>Vanilla</th>
     				<th>Warden</th>
     			</tr>
     		</thead>
     		<tbody>
     			<td>
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
     			<td>
<pre><code class='javascript'>Warden(button)
	.stream('click')
	.debounce(500)
	.map('@value')
	.listen(send);
</code></pre>
     			</td>
     		</tbody>
     	</table>
      	
      	
     
    </div>
  </div>
</div>