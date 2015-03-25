<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
      <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
        <section class='b-doc-section'>
          <h2>HTTP Ajax Module</h2>
          <div class='box http'>
          </div>
          <div class="btn-cnt">
            <a href="#" class='btn btn-primary exist'>Load existing file</a>
            <a href="#" class='btn btn-primary nexist'>Try load not existing file</a>
            <a href="#" class='btn btn-primary wrd'>Load index page</a>
          </div>
          <h3>Implementation</h3>
          <p>Module</p>
          <pre><code class="javascript">var http = {}; //module
//bus
http.gets = Warden.Stream(function(trigger){
  this.get = function(url){
    $.get(url, trigger)
      .fail(function(err){
        trigger(err);
      });
  }
}, http);</code></pre>
        <p>Helper functions and const data</p>
        <pre><code class="javascript">var errorMessage = "<p class='error'> Error: {{status}}: {{statusText}}</p>";

function isString(res){
  return typeof res == 'string';
}

function not(predicate){
  return function(x){
    return !predicate(x);
  }
}
        </code></pre>
        <p>Streams</p>
        <pre><code class="javascript">var successes = gets.filter(isString);
var errors = gets.filter(not(isString)).interpolate(errorMessage);
var responses = successes.merge(errors);</code></pre>
        <p>Side effects</p>
        <pre><code class="javascript">$(document).ready(function(){
  responses.bindTo($(".box"), 'html');
});</code></pre>
        </section>
      </div>
    </div>
    </div>
  </div>
</div>
