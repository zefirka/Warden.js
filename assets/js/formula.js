$(function function_name (argument) {
    	  		var a = Warden.From("#a", parseInt),
		b = Warden.From("#b", parseInt),
		c = Warden.From("#c", parseInt),
		d = Warden.From("#d", parseInt);
		
	var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
		return (a + b + c) * d;
	});

	res.bindTo($("#result"), 'val');
});