var left = Warden.extend(document.getElementById("left"));

var str = left.stream("click");
var str2 = left.stream('click');

str.listen("Stream 1 bus");

str2.map('test').log();
str2.listen("Stream 2 bus 2");

var doc = Warden.extend(document);

//doc.listen('click', function(e){ 
//    console.log(e, this); 
//});

var kd = doc.stream('keydown', {x:10});

kd.listen(function(e){
  console.log(e.keyCode);
});


/*
var input = document.getElementById("input");
var box = document.getElementById("middle");

var k = new Presser(input);
var o = new Over(box);
var clicks = left.stream('click');

clicks.map('y')
.reduce(0, function(prev, cur){
  return prev + cur;
}).include('taken').listen(function(e){
	c1.innerHTML += e + "\n";
});

var keyups = k.streamOf(k.input, "keyup");

keyups.take(4,8).include(['taken']).map('taken').listen(function(e){
	c2.innerHTML += "Taken count: " + e + "\n";
});

Warden.extend(o.box);
var overs = o.box.stream("mousemove");
var outs = o.box.stream("mouseleave");

var coords = overs.map(function(e){
	return "{ x: "+e.x+", y: "+e.y+" }";
}).log();


var connector = outs.map('Mouse Leave Target').connect(c3, "innerHTML");
*/