<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Creating streams in Warden</h2>
      <div class='msgs'>
        <div class='msg'>Pure events: <span id='clear'></span></div>
        <div class='msg'>Chars (mapped): <span id='mapped'></span></div>
        <div class='msg'>Digits (filtered): <span id='filtered'></span></div>
        <div class='msg'>Inputs (reduced): <span id='reduced'></span></div>
      </div>
      <h3>Streams</h3>
      <p><strong>From DOM elements</strong></p>
      <p>Streams may be created from DOM elements (or every other objects which implements <code>addEventListener</code> method) by extending hosting object (e.g. <code>document</code>). You can extend jQuery objects to use <code>stream</code> with depending on jQuery's <code>on</code> method.</p>
      <p>Actually Warden.js automatically extends jQuery (as constructor) if finds it. So you shouldn't write <code>Warden($('.some-class'))</code> every time.</p>
      <p><a href="docs.html#streams">Look here to find out more about stream declaring.</a></p>
      <pre><code  class="javascript">Warden(document);
var keydowns = document.stream('keydown');
var clicks = $(document).stream('click');
</code></pre>
      <p><strong>From custom callback</strong></p>
      <pre><code  class="javascript">var keydowns = Warden.Stream(function(emit){
  document.addEventListener('keydown', emit);
});</code></pre>
      <p><strong>Context</strong></p>
      <p>Every stream has context of evaluation. Default context is object itself (e.g. <code>document</code> for stream made by <code>document.stream("click")</code>. But you can set context by second argument at method <code>stream</code> and <code>Warden.Stream</code></p>
      <h3>Processing</h3>
      <p><strong>Map</strong></p>
      <pre><code  class="javascript">var chars = keydowns
  .map('.keyCode')
  .map(String.fromCharCode)
      </code></pre>
      <p><strong>Filter</strong></p>
      <pre><code  class="javascript">var digits = chars
  .filter(function(ch){
    return "0123456789".indexOf(ch) != -1;
  });</code></pre>
      <p><strong>Reduce</strong></p>
          <pre><code  class="javascript">var inputs = chars
      .reduce('', function(res, ch){
        return res.concat(ch);
      });</code></pre>
      <h3>Bindings</h3>
      <p>By method <code>bindTo</code> we set side effects. It means that each time stream gets a value we overwrite some element's <code>innerHTML</code> property.</p>
      <pre><code  class="javascript">document.onreadystatechange = function(){
  kd.bindTo(pureDOMElement, 'innerHTML');
  chars.bindTo(mappedDOMElement, 'innerHTML');
  digits.bindTo(filteredDOMElement, 'innerHTML');
  inputs.bindTo(reducedDOMElement, 'innerHTML');
};

//bindTo can be replaced with functions like:
kd.listen(function(value){
  pureDOMElement.innerHTML = value;
})
</code></pre>
      </section>
      </div>
    </div>
  </div>
</div>