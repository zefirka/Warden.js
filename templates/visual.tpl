<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <h2>Streams</h2>
      <p>Here you can see how streams works:</p>
      <div id='box'>
      	<div class='left-col col'>
	      	
	      	<div class='row' id="sticky">
	      		<div class='col-md-6 col-lg-6 col-sm-6 col-xs-6 field l'>$blue</div>
	      		<div class='col-md-6 col-lg-6 col-sm-6 col-xs-6 field r'>$red</div>
	      	</div>

		    <div id='originall' class='line blue'>
		      <div class='title'>Original event</div>
		      <div class='box'></div>
		    </div>

		    <pre><code class='javascript'>var blue = $blue.stream('click');</code></pre>

		    <div id='originalr' class='line red'>
		    	<div class='title'>Original event</div>
		      <div class='box'></div>
		    </div>

		    <pre><code class='javascript'>var red = $red.stream('click')</code></pre>

		    <div id='mapx' class='line'>
		    <div class='title'>Mapped event. Contains event's property clientX.</div>
		      <div class='box'></div>
		    </div>
			<pre><code class='javascript'>var clientXes = blue.map('.clientX')</code></pre>

		    <div id='mapxfilter' class='line'>
		    	<!-- <div class='title'>Filters only events which clientX position more than container's</div> -->
		      	<div class='box'></div>
		    </div>
		    <pre><code class='javascript'>function moreThan50Percents(x){
	return x > this.width()/2;
}

clientXes.filter(moreThan50Percents)</code></pre>

		    <div id='skiptake' class='line'>
		    	<div class='title'>Skips first 3 events and takes only 3 events</div>
		      	<div class='box'></div>
		    </div>
			<pre><code class='javascript'>var slice = blue.skip(3).take(3).map('blue')</code></pre>

		    <div id='reducesum' class='line'>
		      <div class='box'></div>
		    </div>
		    <pre><code class='javascript'>function sum(a, b){
	return a + b;
}

clientXes.reduce(sum)</code></pre>

		    <div id='repeat' class='line'>
		    	<div class='title'>Repeat events</div>
				<div class='box'></div>
		    </div>
			<pre><code class='javascript'>blue.map('Hey!').repeat(5, 200)</code></pre>

		</div>

		<div class='right-col col'>	    
		    <div id='getcollected' class='line'>
		      <div class='title'>Collecting all clientYs for 2 seconds</div>
		      <div class='box'></div>
		    </div> 
		    <pre><code class='javascript'>red.map('.clientY').getCollected(2000)</code></pre>

		    <div id='unique' class='line'>		      
		      <div class='title'>Takes only different events</div>
		      <div class='box'></div>
		    </div>

		    <pre><code class='javascript'>red.map('.clientY').diff()</code></pre>

		    <div id='debounce' class='line'>
		      <div class='title'>Debounce for 2 seconds</div>
		      <div class='box'></div>
		    </div>

		    <pre><code class='javascript'>red.map('red').debounce(1000)</code></pre>

		    <div id='delay' class='line'>
		      <div class='title'>Delays for 750 milliseconds</div>
		      <div class='box'></div>
		    </div>

		    <pre><code class='javascript'>red.map('red').delay(750)</code></pre>

		    <div id='interpolate' class='line'>
		      <div class='title'>Interpolate event's data</div>
		      <div class='box'></div>
		    </div>  

		    <pre><code class='javascript'>red.interpolate("X:{{clientX}}, Y:{{clientY}}")</code></pre>

		</div>
		<div class="full-col">
		    <div id='merge' class='line'>
		      <div class='title'>red.merge(blue)</div>
		      <div class='box'></div>
		    </div>
		    <div id='sync' class='line'>
		      <div class='title'>red.map(0).sync(blue.map(1))</div>
		      <div class='box'></div>
		    </div>
		    <div id='wait' class='line'>
		      <div class='title'>red.map(0).waitFor(blue)</div>
		      <div class='box'></div>
		    </div>
		    <div id='after' class='line'>
		      <div class='title'>red.map(0).after(blue)</div>
		      <div class='box'></div>
		    </div>
		    <div id='produce' class='line'>
		      <div class='title'>blue.map(random).resolve(blue.map(random), bigger)</div>
		      <div class='box'></div>
		    </div>
		    <div id='combine' class='line'>
		      <div class='title'>blue.map('.timeStamp').combine(blue.map('.timeStamp'), resolver</div>
		      <div class='box'></div>
		    </div>
		  </div>
      </div>
    </div>
  </div>
</div>