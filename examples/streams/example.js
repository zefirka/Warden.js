var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");

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

var left = document.getElementById("left");
var input = document.getElementById("input");


var c = new Clicker(left);
var k = new Presser(input);

var clicks = c.stream('click');

clicks.map('y').listen(function(e){
	c1.innerHTML += e + "\n";
});

var keyups = k.stream("keyup");

keyups.include('length').map('length').take(4,8).listen(function(e){
	c2.innerHTML += "Taken count: " + e + "\n";
});