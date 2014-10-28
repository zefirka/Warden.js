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
		<code>Utils.is.not</code> [Object] (similiar to <code>Utils.is<code> but negate all results)
	</li>
	<li>
		<code>Utils.let<code>
	</li>
</ul>
