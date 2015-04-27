<div class='row'>
	<div class="col-md-12 col-sm-12 col-xs-12 col-lg-12">
		<h2>Introduction</h2>
		<p>Today we see how web applications grow up from traditional multi-page sites (where all business logic was implemented on the server side) to single-page or ajax-driven apps. If you have ever read <a href="www.reactivemanifesto.org">Reactive Manifesto</a> you should understand the reasons why nowadays web-development goes asynchronious and event-driven way. We spen a lot of time to provide responsive, fast and usable design. But as developers we want resilient, scalable, declarative software.</p>

		<h2>Event-driven programming</h2>
		<p>Event-driven architecture allows us to reach scalability, resiliency and responsivness. But events are not declarative. They're not clean, unpredictive, action's result depends on app's state...</p>
		<p>It's hard to combine and compose events, cause of these asynchronious nature. But it's all we have. From the start of all, the only way to act with DOM was events, and that's the problem we presume. Most of nowadays frameworks provide solutions for every level of deep troubles of events. jQuery made them crossbrowser, some frameworks tried kick them out by two-side data-binging, some frameworks tried to wrap events into declarative components.</p>
		
		<h3>State and events</h3>
		<p>One of the main probles of asynchronious programming is accidental complexity. Simple apps turns to the tangled web of states, when we try to compose events wich change state.</p>
		<p>It goes harder when we realize that asynchronious shows itself not only on events tier. Offline, non-blocking multithreadness (web-workers), client-server replication - them all partially cases of asynchronious. With ECMA6 we will recieve object observations which async too. Complexity of state grows with async data sources. When handlers change state - we create a new segment of variants in states tree.</p>
		<div class='g-img-container'>
			<img src="assets/images/comp.png">
		</div>
		<p>We used to ignore states that doesn't mean anything in out application at current time. But it's not scalable model. When we will want to add some concurent event, we can face to situation when we need to debug all probable states. It makes life of developer pretty hard.</p>
		<p>Different languages and enviroments provides different solutions of common problems. In functional languages like Clojure or Scala you will find immutable data structures and software transaction memory (STM). It's good way, but we have not it on JavaScript. Sure we can use ClojureScript, or just Mori or Immutable.js and use persistent-data types. It will partially solve some troubles with state. React provides Virtual DOM and components hieracrchy. It's really goood solution, but despite that React says that it;s not a framework - it's framework. It requires definitively background, so you can't take ready tangled spagetthi-code jQuery app and say "hey, guys! Let's add some React.js into our app" and it will work.</p>

		<!-- <h2>Functional Reactive Programming</h2>
		<p>Одним из довольно распространенных решений для JavaScript - является реализация идей Functional Reactive Programming. ФРП предлагает решение проблемы через функциональный подход. Ключевой составляющей является события - как источники данных, чистые функции - как обработчики, распространение изменений - как механизм обновления состояния. Если вы пользовались React, это может вам показаться знакомым. Это не удивительно т.к. действительно функциональный подход вынудит вас ограничить список побочных действий, до обновления </p>
		<p>Наиболее успешным примером может служить стек React + ClojureScript + Javelin</p>
		<div class='g-img-container'>
			<img src="assets/images/frpstreams.png">
		</div>
		<h2>Trade-off</h2>
		<p>К сожалению, у нас не всегда есть возможность использовать FRP в том виде, в котором он реализован на JavaScript. Чаще всего у нас просто нет возможности внести те структурные изменения, которые необходимы для большинства библиотек. Warden.js же не требует никакого бекграунда, никакой особой архитектуры. Warden достаточно гибок, чтобы с легкостью внедрить его в уже существующее приложение.</p>
		<p>Другая ситуация, с FRP - это относительная сложность проектирования приложения так. Функицональный подход требует определенного уровня проектирования, чтобы в дальнейшем оставаться функциональным. Имеется ввиду, что неудачно спроектировав прилоежение, можно прийти к ситуации, когда функциональное решение проблемы будет слишком дорогим (долгим, или не производительным), - это не свйоство функционального программирования, сколько свойство тех средств ФП, которые у нас есть для JavaScript на сегодняшний день.</p>
		<p>В этом контексте, Warden.js - это удачный компромисс. С одной стороны позволяющий добиться декларативности функционального подхода, с другой стороны не требующий глубоко продуманной архитектуры с самого начала. Это не значит, что Warden поощрает писать грязный код, напротив - Warden позволяет сгладить углы в процессе эволюции приложения.</p> -->
	</div>
</div>
<!-- <div class='row'>
	<div class='g-img-container col-md-6 col-lg-6 col-xs-12 col-sm-12'>
		<img src="assets/images/component.png">
	</div>
	<div class='g-img-container col-md-6 col-lg-6 col-xs-12 col-sm-12'>
		<p>В Warden.js можно создавать модули, которые инкапсулируют внутри себя изменяемое состояние. Единственным условием, что внутренние функции компонента не должны изменять состояния других компонентов или внешнего состояния. Выходным же результатом такого компонента опять же являеться поток значений, которые в данном случае зависят от его состояния. Если рассматривать компонентку - как значение изменяющееся во времени, то становиться проще моделировать поведение всей системы.</p> 
		<p>Это дает возможность проектировать модули, которые легко встраиваются в приложение, даже если оно изначально не проектировалось в духе FRP.</p>
	</div>
</div>
<div class='row'>
	<div class='com-md-12 col-lg-12 col-sm-12 col-xs-12'>
		<p>Представляя компоненты как потоки данных, можно компоновать их в более сложные компоненты, притом сохранив явное глобально состояние. Это возможность сохранить очевидное поведение системы, даже если некоторые ее части разработанны не лучшим образом. Необоходимое и достаточное условие для того, чтобы сохранить состояние явным - это изоляция отдельных модулей.</p>
		<div class='g-img-container'>
			<img src="assets/images/component_streams.png">
		</div>
		<p>Таким образом сохраняется глобальное явное состояние. Но мы не обязанны с самого начала проектировать наше приложение так, будто-бы у нас имеется некий контейнер состояния, связанный с источниками новых данных какими-то цепочками зависимостей. Сделать это конечно возможно в контексте любой FRP библиотеки, но это не всегда простая задача.</p>
		<p></p>
	</div>
</div>
<div class='row'>
	<div class='com-md-12 col-lg-12 col-sm-12 col-xs-12'>
		<div class='g-img-container'>
			<img src="assets/images/dom.png">
		</div>
	</div>
</div> -->