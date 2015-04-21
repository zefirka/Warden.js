<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <h2>Streams visual</h2>
      <p>Desc</p>
      <div id='box'>
      	<div class='left-col col'>
	      	
	      	<div class='row' id="sticky">
	      		<div class='col-md-6 col-lg-6 col-sm-6 col-xs-6 field l'>$blue</div>
	      		<div class='col-md-6 col-lg-6 col-sm-6 col-xs-6 field r'>$red</div>
	      	</div>

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
		      <div class='title'>blue.map(random).resolveWith(blue.map(random), bigger)</div>
		      <div class='box'></div>
		    </div>
		    <div id='combine' class='line'>
		      <div class='title'>blue.map('timeStamp').combine(blue.map('timeStamp'), resolver</div>
		      <div class='box'></div>
		    </div>
		  </div>
      </div>
    </div>
  </div>
</div>