<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Combintaions of streams</h2>
      
      <div class='box'>
        <div class='f2' id='letters'>
          <span class='btn btn-primary'>Alpha</span>
          <span class='btn btn-primary'>Betta</span>
          <span class='btn btn-primary'>Gamma</span>
          <span class='btn btn-primary'>Delta</span>
        </div>

        <div class='f2' id='codes'>
          <span class='btn btn-primary'>-331</span>
          <span class='btn btn-primary'>-64d</span>
          <span class='btn btn-primary'>-7-17</span>
          <span class='btn btn-primary'>-a-93</span>
        </div>

        <div>
          Result: <span id='res'></span>
        </div>
      </div>
      <h3>Usage:</h3>
      <pre><code class='javascript'>var Letters = Warden.Stream(function(fire){
  $('#letters').find('.btn').click(function(event){
    var cnt = $(this);
    fire(cnt.text(), cnt);
  });
});

var Codes = Warden.Stream(function(fire){
  $('#codes').find('.btn').click(function(event){
    var cnt = $(this);
    fire(cnt.text(), cnt);
  });
});

var current = Letters.combine(Codes, function(letter, code){
  return letter ? letter + (code || "") : "Select letter at first";
});

  current.bindTo($('#res'), 'html');

</code></pre>

      </section>
      </div>
    </div>
  </div>
</div>