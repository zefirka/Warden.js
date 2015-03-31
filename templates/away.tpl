<div class="container">
  <div class="row">
    {{aside}}
    <div class="col-md-9 col-sm-9 col-xs-12 col-lg-10">
        <section class='b-doc-section'>
          <h2>Away</h2>
          <p>Simple module which detecting when user gone away by listening useractions (mouse moves, key presses and scrolls).</p>
          <div class='box'>
            <div class='overlay'></div>
          </div>
          <h2>Implementation</h2>
          <h3>Module</h3>
          <p>At first, to decrease components concurency, we need module which can incapsulate simple state.</p>
          <pre><code class="javascript">var awayModule = {
  box: $('.box .overlay'),
  show: function(){
    this.box.show().fadeIn();
  },
  hide: function(){
    this.box.fadeOut();
  }
};</code></pre>
        <h3>Streams and state incapsulation</h3>
        <pre><code class="javascript">var userActions = $(document).stream('mousemove, mousedown, keydown, scroll');

// Here we hiding state of timeout into awayModule
// Here we can use not pure functions
awayModule.aways = Warden.Stream(function(trigger) {
  var timeout;

  function start(){
    timeout = setTimeout(trigger, 5000);
  }

  this.restart = function(){
    clearTimeout(timeout);
    start();
  }
  
  start(5000);
}, awayModule);</code></pre>
        <h3>Side effects</h3>
        <pre><code class="javascript">awayModule.aways
  .listen(awayModule.show.bind(awayModule));

// Naive implementation
userActions
  .listen(awayModule.restart.bind(awayModule))
  .listen(awayModule.hide.bind(awayModule));

// You can see that awayModule.hide will invoke every time when we will make user action
// Optimal way to prevent unneccesary invokations is use .after method

userActions.after(awayModule.aways)
  .listen(awayModule.hide.bind(awayModule));

//this stream will invoke awayModule.hide only when it neccessary
</code></pre>
        </section>
      </div>
    </div>
  </div>
</div>
