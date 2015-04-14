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
              <option value='1'>Square</option>
              <option value='2'>Circle</option>
              <option value='3'>Triangle</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label" for="selectbasic-0">Size</label>
          <div class="controls">
            <select id="size" class="input-xlarge" points='3'>
              <option>Small</option>
              <option>Large</option>
            </select>
          </div>
        </div>

      </fieldset>
      </form>
      <div id='res'></div>
      </div>
      <pre><code class='javascript'>var color = Warden.From("#color"),
    shape = Warden.From("#shape"),
    size = Warden.From("#size");

var figure = Warden.Formula([color,size,shape], function(color,size,shape){
  return {
    color: color.value,
    size: size.value,
    shape: shape.value
  }
});

figure.bindTo($("#res"), 'html');
      </code></pre>
      </section>
      </div>
    </div>
  </div>
</div>