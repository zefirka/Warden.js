var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");

/* Left */
var left = Warden.extend(document.getElementById("left"));

left.listen('click', function(e){
    c1.innerHTML += 'x: ' + e.x + " y: " + e.y + '\n';
});


/* Rigth */

var Module = Warden.extend(function(input){
  var self = this;
  this.console = c2;
  
  this.input = Warden.extend(input);
  this.input.listen("keydown", function(e){
    self.console.innerHTML += ('You Pressed: ' + String.fromCharCode(e.keyCode) + '\n');  
  });
});

var test = new Module(document.getElementById("input"));