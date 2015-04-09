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
		<code>.not</code> returns predicate that negates given predicate
	</li>
	<li>
		Array methods which implements ECMAScript5 methods as:
			<ul>
				<li><code>.each</code> or <code>.forEach</code></li>
				<li><code>.map</code></li>
        <li><code>.reduce</code></li>
				<li><code>.filter</code></li>
				<li><code>.reduce</code></li>
				<li><code>.forWhile</code> (similiar to forEach, but takes last argument as value to prevent loop if applied function returns that value </li>
				<li><code>.every</code></li>
				<li><code>.some</code></li>

			</ul>
	</li>
	<li>
		<code>Utils.log(@string [str], @object [dict])</code> interpolate <code>dict</code>'s properties to the string in Mustache-templating style. Usage: <code>Utils.log('Hello, {{what}}', {what: 'World'})</code>. 
	</li>
</ul>
