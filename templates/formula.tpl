<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <section class='b-doc-section'>
      <h2>Formula</h2>
      <div class='box'>
       	 ( <input class='gr' type='text' id='a' value="0"> + <input  class='gr' type='text' id='b' value="0"> + <input class='gr' type='text' id='c' value="0"> ) * <input class='gr' type='text' id='d' value="0"> = <input type='text' class='gr' id='result'>
      </div>
      <pre><code class='javascript'>function from(id, type, f){
  return $("#" + a).stream(type);
}
function value(src){
  return from(src, 'keyup').map('@val()').map(parseInt);
}

var a = value('a'),
    b = value('b'),
    c = value('c'),
    d = value('d');

var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
  return (a + b + c) * d;
});

res.bindTo($("#result"), 'val');
      </code></pre>

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