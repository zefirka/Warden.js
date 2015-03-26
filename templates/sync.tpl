<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Synchronization</h2>
      <div class='example'>
        <table>
          <thead>
            <tr>
              <td>Source</td>
              <td>Status</td>
              <td>Result</td>
            </tr>
            <tr>
              <td><a href='javascript: void 0' class='btn btn-primary a'>Alpha</a></td>
              <td rowspan="3"><span id='status'></span></td>
              <td rowspan="3"><span id='result'></span></td>
            </tr>
            <tr>
              <td><a href='javascript: void 0' class='btn btn-primary b'>Betta</a></td>
            </tr>
            <tr>
              <td><a href='javascript: void 0' class='btn btn-primary c'>Gamma</a></td>              
            </tr>
          </thead>
        </table>
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