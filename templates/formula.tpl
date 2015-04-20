<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Formula</h2>
      <p>Formulas are the simplets way to describe dependency of one streams from others. Conjunctive operation in time could be simply implemented via streams formulas.</p>
      <div class='box'>
       	 ( <input class='gr' type='text' id='a' value="0"> + <input  class='gr' type='text' id='b' value="0"> + <input class='gr' type='text' id='c' value="0"> ) * <input class='gr' type='text' id='d' value="0"> = <input type='text' class='gr' id='result'>
      </div>
      <h3>Usage:</h3>
      <p>We have an markup:</p>
      <pre><code class='html'>&lt;input type='text' id='a' value="0"&gt; + &lt;input  type='text' id='b' value="0"&gt; + &lt;input type='text' id='c' value="0"&gt; ) * &lt;input type='text' id='d' value="0"&gt; = &lt;input type='text' id='result'&gt;
      </code></pre>
      <p>This markup represents simple algebraic expression <code>(a + b + c ) * d = X</code>, but all values changes over the time. We don't want to append to each input handler and observe changes of value and count final result. So we use <code>Warden.Formula</code></p>
      <pre><code class='javascript'>// returns stream of given type from element #id
function from(id, type){
  return $("#" + id).stream(type);
}

//return stream which contain integer type value from stream of given source
function value(src){
  return from(src, 'keyup').map('@val()').map(parseInt);
}

//values of inputs
var a = value('a'), 
    b = value('b'),
    c = value('c'),
    d = value('d');
</pre></code>
  <p>We prepared all streams, so let combine them with formula</p>
  <pre><code class='javascript'>var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
  // in this function a,b,c,d is a simple values of adequate streams 
  return (a + b + c) * d;
});

// now res is a stream which updates with given formula
// so we can bind res's value to the input with ID equals 'result'
res.bindTo($("#result"), 'val');   </code></pre>

      <div class='box'>
         <form class="form-horizontal" id='form'>
      <fieldset>
        
        <div class="control-group">
          <label class="control-label" for="selectbasic-0">Color</label>
          <div class="controls">
            <select id="color" class="input-xlarge">
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label" for="selectbasic-0">Shape</label>
          <div class="controls">
            <select id="shape" class="input-xlarge">
              <option value='square'>Square</option>
              <option value='circle'>Circle</option>
              <option value='triangle'>Triangle</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label" for="selectbasic-0">Size</label>
          <div class="controls">
            <select id="size" class="input-xlarge" points='3'>
              <option value='small'>Small</option>
              <option value='large'>Large</option>
            </select>
          </div>
        </div>

      </fieldset>
      </form>
      <div id='res'></div>
      </div>
      <pre><code class='javascript'>var color = value("color"),
    shape = value("shape"),
    size = value("size");

var figure = Warden.Formula([color,size,shape], function(color,size,shape){
  return "Figure now is " + size + (shape.length ? " " : " and ") + color  + " " + shape;
});

figure.bindTo($("#res"), 'html');
      </code></pre>
      </section>
      </div>
    </div>
  </div>
</div>