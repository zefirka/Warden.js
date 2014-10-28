Utils
=========

Module at: 
 - `./src/modules/Utils.js` : Utilities module

 ###Description###
 Warden.js provides utilities module which contains helping methods, cross-browser wrappers over array's prototype methods from ECMAScript5 ( forEach,  map, filter, some, any), functional programming logical methods (not, is, let) and other utilities you can use.

###List###
<ul>
	<li>
		`Utils.is`: [Object] 
		<ul>
			<li>`str`: is string</li>
			<li>`num`: is number</li>
			<li>`bool`: is boolean</li>
			<li>`array`: is array</li>
			<li>`fun`: is function</li>
			<li>`obj`: is object</li>
			<li>`exist`: is argument not equals to null and it's type is not undefined</li>
			<li>`truthy`: result from constrction `argument ? true : false`</li>
			<li>`falsee`: is not truthy</li>
			<li>`equals`: return predicate of equality with argument</li>
		</ul>
	</li>
	<li>
		`Utils.is.not`: [Object] (similiar to `Utils.is` but negate all results)
	</li>
	<li>
		`Utils.let`
	</li>
</ul>
