$(function function_name (argument) {
   	var from = function(src, type, f){
   		return src.stream(type);
   	}
   	var value = function(id, type, typeMap,){
   		var str, src = $("#" + id);
   		if(typeMap){
   			str = from(src, type).map("@val()").map(typeMap);
   		}else{
   			str = from(src, type.map("@val()");
   		}
   		str.fire((typeMap ? typeMap(src.val()) : src.val()), src);
   		return str;
   	}

   	var a = value('a', 'keyup', parseInt),
		b = value('b', 'keyup', parseInt),
		c = value('c', 'keyup', parseInt),
		d = value('d', 'keyup', parseInt);
		
	var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
		return (a + b + c) * d;
	});

	res.bindTo($("#result"), 'val');



	var color = value("color", 'change'),
    	shape = value("shape", 'change'),
    	size = value("size", 'change');

	var figure = Warden.Formula([color,size,shape], function(color,size,shape){
		return "Figure now is " + size + (shape ? " " : " and ") + color  + " " + shape;
	});

	figure.bindTo($("#res"), 'html');
});