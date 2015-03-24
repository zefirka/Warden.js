<header>
  <section id='logo'>
    <div class="container">
      <h1>Warden.js</h1>
      <h2>Declarative event-driven development</h2>
    </div>
  </section>


  <nav>
    <div class="container">
      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="docs.html">Documentation</a></li>
        <li><a href="demo.html">Demo</a></li>
        <li><a href="download.html">Download</a></li>
      </ul>
    </div>
  </nav>
</header>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h3>Concept</h3>
      
      <p>Warden.js provides a functionality for the development of reactive event-driven applications in functional style. It requires no dependencies.</p>

      <p>General idea of Warden.js that to make composing, combining and resolving concurrent events simpler. In mathematical sense, idea that to change your app's representation from tree of states to the partially ordered set of events in time (or other) priority relation.</p>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
      <h3>Why Warden?</h3>
      <ul>
        <li>There are no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js. You can use it on the front and on the back. With jQuery or with Node's Event Emiter or without anything.</li>
        <li>Simple combine, conjuncte and resolve concpetually connected events. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining events in time and resolving problems - that Warden.js is for you.</li>
        <li>Pretty flexible API. There are no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.</li>
        <li>It's lighweight. Current version (0.1.4): 15.7 KB. And it's with datatype checking, utilities package and internal plugin system with configuration.</li>
        <li>Low-level functional abstraction. You can write a bunch of cool things. An events sampler (for example).</li>
      </ul>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
      <h3>Why not Warden?</h3>
      <ul>
        <li>Too early to use it in really large and demandig applications. Currently library is too raw. No community, no experience. If you are orienting to the secure, verified, popular library or framework don't use Warden.js. But you can help us make it better!</li>
        <li>It's just a weaky realization of FRP with too flexible API. If you are looking at ready solutions check out Bacon, kefir</li>
        <li>Low-level functional abstraction. You should write a bunch of code to develop an events sampler (for example).</li>
      </ul>
    </div>
  </div>
</div>
