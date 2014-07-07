var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");
var c3 = document.getElementById("console3");

var Presser = Warden.create(function Presser(e){ 
	var self = this;
	this.input = e; 
});

function Over(e){ 
	var self = this;
	this.box = e;
};

var left = Warden.create(document.getElementById("left")); //creating warden from object

var input = document.getElementById("input");
var box = document.getElementById("middle");

var k = new Presser(input);
var o = new Over(box);
var clicks = left.stream('click');

clicks.map('x')
.reduce(0, function(prev, cur){
  return prev + cur;
}).include('taken').listen(function(e){
	c1.innerHTML += e + "\n";
});

var keyups = k.streamOf(k.input, "keyup");

keyups.take(4,8).include('taken').map('taken').listen(function(e){
	c2.innerHTML += "Taken count: " + e + "\n";
});

Warden.create(o.box);
var overs = o.box.stream("mousemove");
var outs = o.box.stream("mouseleave");

overs.map(function(e){
	return "{ x: "+e.x+", y: "+e.y+" }";
}).log();

var connector = outs.map('Mouse Leave Target').connect(c3, "innerHTML");