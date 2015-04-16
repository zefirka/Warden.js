$(function function_name (argument) {
   	var from = function(id, type, f){
   		return $("#" + a).stream(type);
   	}
   	var value = function(src, typeMap){
   		if(typeMap){
   			return from(src, 'keyup').map('@val()').map(typeMap);
   		}else{
   			return from(src, 'keyup').map('@val()');
   		}
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
		return "Figure now is " + size + (shape.length ? " " : " and ") + color  + " " + shape;
	});

	figure.bindTo($("#res"), 'html');
});