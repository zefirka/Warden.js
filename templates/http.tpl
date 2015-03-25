<div class="container">
  <div class="row">
    {{aside}}
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
        <h3>Module</h3>
        <p>At first we need http module which we can use in our application.</p>
        <pre><code class="javascript">var http = {}; //module
//bus
http.gets = Warden.Stream(function(trigger){
  this.get = function(url){
    $.get(url).always(trigger);
  }
}, http);</code></pre>
      <h3>Helper functions and const data</h3>
      <p>These functions are commonly used, and Warden provides easy way to use them.</p>
      <pre><code class="javascript">var errorMessage = "&lt;p class='error'&gt; Error: {{status}}: {{statusText}}&lt;/p&gt;";
// or Warden.Utils.is.str
function isString(res){
  return typeof res == 'string';
}
// or Warden.Utils.not
function not(predicate){
  return function(x){
    return !predicate(x);
  }
}
      </code></pre>
      <h3>Streams</h3>
      <p>It's not the best way to filetr success response from failed, but currently we sure that if response is string than it's correct HTML markup, otherwise it's Error object</p>
      <pre><code class="javascript">var successes = http.gets.filter(isString);
var errors = http.gets.filter(not(isString)).interpolate(errorMessage);
var responses = successes.merge(errors);</code></pre>
      <h3>Side effects</h3>
      <pre><code class="javascript">$(document).ready(function(){
  responses.bindTo($(".box"), 'html');
});</code></pre>
      </section>

    </div>
    </div>
  </div>
</div>
