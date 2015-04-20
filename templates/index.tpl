<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h2>Concept</h2>
      <p>Warden.js is a library that makes event-driven programming clear, declarative and easy.</p>
      <p>General idea of Warden.js to make composing, combining and resolving concurrent events simpler. In terms of mathemathics, idea that to change your program's livecircle scheme from the tree of states to the partially ordered set of values in time (or other) priority relation. Values takes from streams which represent values changing over time themself. It means that in Warden.js events are source of data, not an actions which publish gives data to the handlers.</p>
    </div>
    <div class="col-md-12">
      <h2>Rationale</h2>
      <ul id='rationale'>
        <li>
          <h3>Event-driven applications</h3>
          <p>Event-driven applications are hard. Hard to understand, hard to debug, hard to maintain. It's hard to combine values which can change over the time. State is unpredictable.</p>
          <p>But EDD is good for scalable asynchronious applications, today event-driven patterns are foundation of browser programming and Node.js both. So we need more declarative way to manage out events.</p>
        </li>
        <li>
          <h3>Functioanl Reactive Programming</h3>
          <p>FRP is good solution. But there are troubles with it sometimes. It's hard to integrate FRP solutions in ready and big project on jQuery. To realize true FRP you need to go realy deep into JavaScript, cause of JS don't functional language. You will need immutable data structures, virtual DOM, value propagation logic etc. The closest to FRP on JavaScript is stack of ClojureScript + Javelin + React. It's really good, but it doesn't cover all neccessaries of developers. Sometimes we need something easy.</p>
        </li>
        <li>
          <h3>Trade-off</h3>
          <p>Warden.js - is a trade-off between true FRP and traditional EDP. You can choose which way to use. True functional immutable state, or you just need streams for syntax sugar, or something between. It remains ability to create dirty-state components which represents itselfs as a stream so you can easy manage your app's state.</p>
        </li>
      </ul>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
      <h3>Why Warden?</h3>
      <ul>
        <li>There are no dependencies with DOM, jQuery or other libraries or event emitting system in the Warden.js. You can use it on the front and on the back. With jQuery or with Node's Event Emiter or without anything.</li>
        <li>Simple declarative methods to combine, conjuncte and resolve concpetually connected events. Like sync or resolve. If your application turns to tangled web of simple events and you spoiling time to resolve synchronization, combining events in time and resolving problems - then Warden.js is for you.</li>
        <li>Pretty flexible API. There are no much of ready solutions, but there is way to add your own data stream processing method, combine methods and construct application in your way.</li>
        <li>It's not pure functional, but stay simple. In Warden you can create modules with dirty state, but if you're sure that these modules are simple and state is predictable. So after you can combine and reuse modules in more declarative way. It's not required to use pure functional programming technics from start to end while develop with Warden.</li>
        <li>It's lighweight. Current version ({{version}}): {{size_min}} KB ({{size_gz}} KB gzipped). And it comes with crossbrowser utilities package, modular package to create pipelines, dependency formulas from streams ...</li>
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
        <li>Too early to use it in really large and demandig applications. Currently library is pretty raw. No community, no experience. If you are orienting to the secure, high performance, popular library or framework don't use Warden.js. But you can help us make it better!</li>
        <li>Weaky realization of F from FRP. If you are looking at ready solutions for pure functional in reactive way - check out Bacon, kefir, ProAct</li>
        <li>Low performance. In optimal usage it's faset than Bacon.js, but if you want to stay pure functional you could find that Warden is much more slower than Kefir, RxJS (sometimes it's a bit of slower than Bacon.js).</li>
        <li>Low-level functional abstraction. You should write a bunch of code to develop an events sampler (for example).</li>
      </ul>
    </div>
  </div>
</div>
