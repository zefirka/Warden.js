<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Formula</h2>
      <div class='box'>
       	 ( <input class='gr' type='text' id='a' value="0"> + <input  class='gr' type='text' id='b' value="0"> + <input class='gr' type='text' id='c' value="0"> ) * <input class='gr' type='text' id='d' value="0"> = <input type='text' class='gr' id='result'>
      </div>
      <pre><code class='javascript'>var a = Warden.From("#a", parseInt),
    b = Warden.From("#b", parseInt),
    c = Warden.From("#c", parseInt),
    d = Warden.From("#d", parseInt);
    
  var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
    return (a + b + c) * d;
  });

  res.bindTo($("#result"), 'val');
      </code></pre>
      </section>
      </div>
    </div>
  </div>
</div>