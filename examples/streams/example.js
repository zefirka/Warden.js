//var left = Warden.extend(document.getElementById("left"));
//
//var str = left.stream("click");
//var str2 = left.stream('click');

//str.listen("Stream 1 bus");

//str2.map('x').filter(function(x){ return x > 300; }).log();
//str2.listen("Stream 2 bus 2");

var doc = Warden.extend(document);

var clicks = doc.stream('click');
clicks.map('timestamp').getCollected(2000).log();
//
//var keydowns = doc.stream('keydown', {x: 20});
//keydowns.log();
//keydowns.listen(function(x){
//  x.preventDefault();
//  console.log(this.x + x.keyCode);
//});
//
