
  <div class="container">
    <div class="row">
      {{aside}}
      <div eqz class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
        <section class='b-doc-section'>
          <h2>Counter</h2>
          <p>Counter which merges two streams</p>
          <div class='box counter' >
            <a class="btn btn-primary plus">+ 1</a>
            <a class="btn btn-primary minus">- 1</a>
            <span class="result">0</a>
          </div>
          <h3>Implementation</h3>
          <p>Streams</p>
          <pre><code class="javascript">var add = plus.stream('click').map(1),
    sub = minus.stream('click').map(-1),
    results = add.merge(sub).reduce(0, function(a, b){
      return a+b;
    });
</code></pre>
          <p>Side effects</p>
          <pre><code class="javascript">results.bindTo(result, 'innerHTML');</code></pre>

        </section>
      </div>
    </div>
  </div>

  <script type="text/javascript">
    $(function(){
      $('.plus').stream('click').map(1).merge($('.minus').stream('click').map(-1)).reduce(0, function(a,b){
        return a+b
      }).bindTo($(".result"), 'html');
    });

    $(function(){
      $("#submenu-cont")
    })
  </script>
