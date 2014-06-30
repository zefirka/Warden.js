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
});

var left = document.getElementById("left");
var input = document.getElementById("input");


var c = new Clicker(left);
var k = new Presser(input);

var clicks = c.stream('click');
clicks.listen(function(e){
	console.log("Handler on first bus")	
});

var clicks2 = clicks.map(20).listen(function(e){
	debugger;
});

var clicks3 = clicks.filter(function(e){
	return e.y > 200;
}).listen(function(e){
	debugger;
})



