var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");
var c3 = document.getElementById("console3");

var t1 = document.getElementById("text1");
var t2 = document.getElementById("text2");
var t3 = document.getElementById("text3");

var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");


function dr(from, to, expanded, depth){
	try{
		var res = JSON.parse(from.value);
		debugger;
		to.innerHTML = Warden.stringify(res, expanded, depth);

	}catch (e){
		alert("Error in JSON parsing");
	}
}

dr(t1, c1, 0, 3);
dr(t2, c2, 1, 3);
dr(t3, c3, 1, 1);

btn1.addEventListener("click", function(e){
	e.preventDefault();
	dr(t1, c1, 0, 3);
});
btn2.addEventListener("click", function(e){
	e.preventDefault();
	dr(t2, c2, 1, 3);
});
btn3.addEventListener("click", function(e){
	e.preventDefault();
	dr(t3, c3, 1, 1);
});