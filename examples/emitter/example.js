var Clicker = Warden.extend(function(e){ 
	var self = this;
	this.btn = e; 
	this.btn.addEventListener("click", function(e){
		self.emit(e);
	});
});

var Presser = Warden.extend(function(e){ 
	var self = this;
	this.input = e; 
	this.input.addEventListener("keyup", function(e){
		self.emit(e);
	});
});

var left = document.getElementById("left");
var c = new Clicker(left);

var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");

c
.on("click", function(e, adj) {
	c1.innerHTML += "ADJ: " + adj + " | Coord = [x:" + e.x + ",y:" + e.y + "]\n";
},{
	adj : ['additional']
})

var input = document.getElementById("input");
var k = new Presser(input);

k.
on("keyup", function(e){
	c2.innerHTML += "Keycode: " + e.which + "\n"
})