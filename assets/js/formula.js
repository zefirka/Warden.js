$(function function_name (argument) {
   	var from = function(src, type, f){
   		return src.stream(type);
   	}
   	var value = function(id, typeMap){
   		var str, src = $("#" + id);
   		if(typeMap){
   			str = from(src, 'keyup').map('@val()').map(typeMap);
   		}else{
   			str = from(src, 'keyup').map('@val()');
   		}
   		str.value = src.val();
   		return str;
   	}

   	var a = value('a', parseInt),
		b = value('b', parseInt),
		c = value('c', parseInt),
		d = value('d', parseInt);
		
	var res = Warden.Formula([a,b,c,d], function(a,b,c,d){
		return (a + b + c) * d;
	});

	res.bindTo($("#result"), 'val');



	var color = value("color"),
    	shape = value("shape"),
    	size = value("size");

	var figure = Warden.Formula([color,size,shape], function(color,size,shape){
		return "Figure now is " + size + (shape ? " " : " and ") + color  + " " + shape;
	});

	figure.bindTo($("#res"), 'html');
});