<div class='row'>
	<div class="col-md-12 col-sm-12 col-xs-12 col-lg-12">
		<h2>Event-driven programming</h2>
		<p>С каждым днем веб-приложения требуют от разработчков все больше усилий, чтобы удовлетворить требования современного рынка. Большая часть усилий сконцентророванна на том, чтобы дать пользователю отзывчивый дизайн, под которым мы понимаем немедленную реакцию приложения, удобный UI. Не менее важной частью является отказоустойчивость, - в идеале возможность работы в оффлайне, или хотя-бы гарантия безопасности на случай сбоев, как сетевых, так и технологических. Автономная работа. Коллаборативная работа. А ведь есть еще требования, которые необходимо удовлетворять, чтобы приложение вообще могло эволюционировать. Масштабируемость, модульность (слабая связность компонентов), декларативность и прочее... </p>
		<p>Реализовать это кажется сложной затеей, особенно учитывая те инструменты, что мы имеем.</p>
		<p>С самого начала, и до сих пор, единственный способ огранизовать взаимодействие пользователя с DOM были события. И это проблема. Большинство современных фремворков и библиотек имеют свое решение. Причем, каждая технология решает лишь часть проблемы. В лучшем случае, она не порождает новые проблемы (как например jQuery).</p>
		
		<h3>Сложность EDD</h3>
		<p>ИЗ event-driven программирования с необходимостью следует асинхронность. Одной из главных проблем асинхронного программирования является сложность координации действий, которые меняют состояние. Кроме событийной модели в понятие асинхронности может входить много, так как термин сильно перегружен. Работа в оффлайне, неблокирующая многопоточность - все это частные случаи асинхронности. </p>
		<p></p>
		<div class='g-img-container'>
			<img src="assets/images/comp.png">
		</div>
		<p>Разные среды и языки предоставляют разные подоходы к решению общих проблем. Например функциональные языки (Clojure, Scala) предлагают найти решение в иммутабельных структурах данных и программной транзакционной памяти (STM). </p>
		<p>Основной сложностью JavaScript для реализации скоординированной системы транзакций - является DOM. Даже при условии иммутабельных структур данных, не всегда очевидно в какой момент должно произойти изменние в DOM.</p>

		<h2>Functional Reactive Programming</h2>
		<p>Одним из довольно распространенных решений для JavaScript - является реализация идей Functional Reactive Programming. ФРП предлагает решение проблемы через функциональный подход. Ключевой составляющей является события - как источники данных, чистые функции - как обработчики, распространение изменений - как механизм обновления состояния. Если вы пользовались React, это может вам показаться знакомым. Это не удивительно т.к. действительно функциональный подход вынудит вас ограничить список побочных действий, до обновления </p>
		<p>Наиболее успешным примером может служить стек React + ClojureScript + Javelin</p>
		<div class='g-img-container'>
			<img src="assets/images/frpstreams.png">
		</div>
		<h2>Trade-off</h2>
		<p>К сожалению, у нас не всегда есть возможность использовать FRP в том виде, в котором он реализован на JavaScript. Чаще всего у нас просто нет возможности внести те структурные изменения, которые необходимы для большинства библиотек. Warden.js же не требует никакого бекграунда, никакой особой архитектуры. Warden достаточно гибок, чтобы с легкостью внедрить его в уже существующее приложение.</p>
		<p>Другая ситуация, с FRP - это относительная сложность проектирования приложения так, чтобы потом в него не вставлять костыли.</p>
	</div>
</div>
<div class='row'>
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
		<p></p>
		<div class='g-img-container'>
			<img src="assets/images/component_streams.png">
		</div>
		<p>Таким образом сохраняется глобальное явное состояние. Но мы не обязанны с самого начала проектировать наше приложение так, будто-бы у нас имеется некий контейнер состояния, связанный с источниками новых данных какими-то цепочками зависимостей. Сделать это конечно возможно в контексте любой FRP библиотеки, но это не всегда простая задача.</p>
	</div>
</div>
<div class='row'>
	<div class='com-md-12 col-lg-12 col-sm-12 col-xs-12'>
		<div class='g-img-container'>
			<img src="assets/images/dom.png">
		</div>
	</div>
</div>