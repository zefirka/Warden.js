var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");
var c3 = document.getElementById("console3");

var Clicker = Warden.create(function Clicker(e){ 
	var self = this;
	this.btn = e; 
	this.btn.addEventListener("click", function(e){
		self.emit(e);
	});
});

var Presser = Warden.create(function Presser(e){ 
	var self = this;
	this.input = e; 
	this.input.addEventListener("keyup", function(e){
		self.emit(e);
	});
},{
	max : 2
});

function Over(e){ 
	var self = this;
	this.box = e;
};

var left = document.getElementById("left");
var input = document.getElementById("input");
var box = document.getElementById("middle");

var c = new Clicker(left);
var k = new Presser(input);
var o = new Over(box);

var clicks = c.stream('click');

clicks.map('y').listen(function(e){
	c1.innerHTML += e + "\n";
});

var keyups = k.stream("keyup");

keyups.include('length').map('length').take(4,8).listen(function(e){
	c2.innerHTML += "Taken count: " + e + "\n";
});

Warden.create(o.box);
var overs = o.box.stream("mousemove");
var outs = o.box.stream("mouseleave");

var total = 0;

overs.map(function(e){
	return {
		x: e.x,
		y: e.y,
		amount : e.amount || 0
	};
}).reduce('first', function(prev, next){
	var r = Math.sqrt(Math.pow(Math.abs(prev.x - next.x),2) + Math.pow(Math.abs(prev.y - next.y), 2));
	total += r;
	return {
		x: next.x,
		y: next.y
	};
}).listen(function(e){
	c3.innerHTML = 'Total pixels elpased: \n' + (total >>0 );
});
