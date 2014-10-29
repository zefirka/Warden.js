Utils
=========

Module at: 
 - <code>./src/modules/Utils.js<code> : Utilities module

###Description###
 Warden.js provides utilities module which contains helping methods, cross-browser wrappers over array's prototype methods from ECMAScript5 ( forEach,  map, filter, some, any), functional programming logical methods (not, is, let) and other utilities you can use.

###List###
<ul>
	<li>
		<code>Utils.is</code> [Object] 
		<ul>
			<li><code>str</code> is string</li>
			<li><code>num</code> is number</li>
			<li><code>bool</code> is boolean</li>
			<li><code>array</code> is array</li>
			<li><code>fun</code> is function</li>
			<li><code>obj</code> is object</li>
			<li><code>exist</code> is argument not equals to null and it's type is not undefined</li>
			<li><code>truthy</code> result from constrction <code>argument ? true : false<code></li>
			<li><code>falsee</code> is not truthy</li>
			<li><code>equals</code> return predicate of equality with argument</li>
		</ul>
	</li>
	<li>
		<code>Utils.is.not</code> [Object] (similiar to <code>Utils.is</code> but negate all results)
	</li>
	<li>
		<p><code>Utils.$let</code> : function </p>
		<p>Description: it uses predicates to create predicate chain which return a function extented with methods: <code>.and</code>, <code>.or</code> and <code>.butNot</code> when each take predicate as argument and puts into chain with condition (respectively "predicate1 and predicate2", "predicate1 or predicate2" and "predicate1 butNot predicate2"). 
		</p>
		<p>You can concatenate more than 2 predicates, but you can't group them like <code>((a and b) or c) and d</code></p>
	</li>
	<li>
		Array methods which implements ECMAScript5 methods as:
			<ul>
				<li><code>.each</code> or <code>.forEach</code></li>
				<li><code>.map</code></li>
				<li><code>.filter</code></li>
				<li><code>.forWhile</code> (similiar to forEach, but takes last argument as value to prevent loop if applied function returns that value </li>
				<li><code>.any</code></li>
				<li><code>.some</code></li>

			</ul>
	</li>
	<li> 
		<code>Utils.profile</code> profiling method
	</li>
</ul>
