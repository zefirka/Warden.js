<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <h2>Streams visual</h2>
      <p>Desc</p>
      <div id='box'>
      	<div class='left-col col'>
	      	<div class='field l'>$blue</div>

		    <div id='originall' class='line'>
		      <div class='title'>blue = $blue.stream('click')</div>
		      <div class='box'></div>
		    </div>

		    <div id='mapx' class='line'>
		      <div class='title'>blue.map('clientX')</div>
		      <div class='box'></div>
		    </div>
		 
		     <div id='mapxfilter' class='line'>
		      <div class='title'>blue.map('clientX').filter(x > 50%).map('blue')</div>
		      <div class='box'></div>
		    </div>

		    <div id='skiptake' class='line'>
		      <div class='title'>b.skip(3).take(3).map('blue')</div>
		      <div class='box'></div>
		    </div>

		    <div id='reducesum' class='line'>
		      <div class='title'>blue.map('.clientX').reduce(prevX + curX)</div>
		      <div class='box'></div>
		    </div>

		    <div id='repeat' class='line'>
		      <div class='title'>blue.map('Hey!').repeat(5, 200)</div>
		      <div class='box'></div>
		    </div>

		</div>

		<div class='right-col col'>
		    <div class='field r'>$red</div>
	    
		    <div id='originalr' class='line'>
		      <div class='title'>red = $red.stream('click')</div>
		      <div class='box'></div>
		    </div>

		    <div id='getcollected' class='line'>
		      <div class='title'>red.map('clientY').getCollected(2000)</div>
		      <div class='box'></div>
		    </div> 

		    <div id='unique' class='line'>
		      <div class='title'>red.map('clientX').unique()</div>
		      <div class='box'></div>
		    </div>

		    <div id='debounce' class='line'>
		      <div class='title'>red.map('red').debounce(1000)</div>
		      <div class='box'></div>
		    </div>

		    <div id='delay' class='line'>
		      <div class='title'>red.map('red').delay(750)</div>
		      <div class='box'></div>
		    </div>

		    <div id='interpolate' class='line'>
		      <div class='title'>red.interpolate("X:{{clientX}}, Y:{{clientY}}")</div>
		      <div class='box'></div>
		    </div>  
		</div>
      </div>
    </div>
  </div>
</div>