<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      
        <section class='b-doc-section'>
          <h2>Drag & Drop</h2>
          <p>Simple drag'n'drop with coordinate observing</p>
          <div class='box'>
            <div class='data-info'>Current position: (X:{{x}}, Y:{{y}})</div>
            <span class='dragndrop'></span>
          </div>
          <h3>Implementation</h3>
          <p>Streams</p>
          <pre><code class="javascript">var downs = circle.stream('mousedown'),
  ups = document.stream('mouseup'),
  moves = document.stream('mousemove', circle);

var position = {
  x: '.clientX',
  y: '.clientY'
}

var drags = moves
  .after(downs)
  .map(position)
  .map(function(coors){
  /* Math logic to find absolute position of object */
  })</code></pre>
        <p>Logic</p>
        <pre><code class="javascript">drags.toggleOn(ups, false);
drags.toggleOn(downs, true);
        </code></pre>
        <p>Side effects</p>
        <pre><code class="javascript">drags.interpolate("Current position: (X:{{x}}, Y:{{y}})").bindTo(DOMelement, 'innerHTML');

drags.listen(function(coors){
  this.style.top = coors.y + "px";
  this.style.left = coors.x + "px";
});          </code></pre>
        </section>
      </div>
    </div>
  </div>
</div>
