var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");

var Clicker = Warden.module(function(e){ 
	var self = this;
	this.btn = e; 
	this.btn.addEventListener("click", function(e){
		self.emit(e);
	});
});

var Presser = Warden.module(function(e){ 
	var self = this;
	this.input = e; 
	this.input.addEventListener("keyup", function(e){
		self.emit(e);
	});
});

var left = document.getElementById("left");
var input = document.getElementById("input");


var c = new Clicker(left);
var k = new Presser(input);



var clicks = c.stream('click', 'Clicks');
var keyups = k.stream('keyup', 'Keyups');

clicks.on(function(e){
	debugger;	
});

