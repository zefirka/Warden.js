<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Creating streams in Warden</h2>
      <div class='msgs'>
        <div class='msg'>Pure events: <span id='clear'></span></div>
        <div class='msg'>Chars (mapped): <span id='mapped'></span></div>
        <div class='msg'>Letters (filtered): <span id='filtered'></span></div>
        <div class='msg'>Inputs (reduced): <span id='reduced'></span></div>
      </div>
      <h3>Streams</h3>
      <p><strong>From DOM elements</strong></p>
      <pre><code  class="javascript">Warden(document);
var keydowns = document.stream('keydown');</code></pre>
      <p><strong>From custom callback</strong></p>
      <pre><code  class="javascript">var keydowns = Warden.Stream(function(emit){
  document.addEventListener('keydown', emit);
});</code></pre>
      <h3>Processing</h3>
      <p><strong>Map</strong></p>
      <pre><code  class="javascript">var chars = keydowns
  .map('.keyCode')
  .map(String.fromCharCode)
      </code></pre>
      <p><strong>Filter</strong></p>
      <pre><code  class="javascript">var letters = chars
  .filter(function(ch){
    return "0123456789".indexOf(ch) == -1;
  });</code></pre>
      <p><strong>Reduce</strong></p>
          <pre><code  class="javascript">var inputs = chars
      .reduce('', function(res, ch){
        return res.concat(ch);
      });</code></pre>
      <p><strong>Bindings</strong></p>
      <p><strong>Reduce</strong></p>
          <pre><code  class="javascript">document.onreadystatechange = function(){
  kd.bindTo(pureDOMElement, 'innerHTML');
  chars.bindTo(mappedDOMElement, 'innerHTML');
  letters.bindTo(filteredDOMElement, 'innerHTML');
  inputs.bindTo(reducedDOMElement, 'innerHTML');
};
</code></pre>
      </section>
      </div>
    </div>
  </div>
</div>