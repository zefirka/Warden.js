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
      <pre><code  class="javascript">var alpha = $(".a").stream('click').map('alpha');
var betta = $(".b").stream('click').map('betta');
var gamma = $(".c").stream('click').map('gamma');

var result = alpha.sync(betta, gamma).map('Synced');

var status = alpha.take(1).merge(betta.take(1), gamma.take(1)).reduce('Already clicked: ', function(a, b){
  return a + " " + b;
});</code></pre>
      <h3>Side effects</h3>
      <pre><code  class="javascript">result.bindTo($("#result"), "html");
status.bindTo($("#status"), "html");</code></pre>
      </section>
      </div>
    </div>
  </div>
</div>