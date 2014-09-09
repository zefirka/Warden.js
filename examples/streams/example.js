var left = Warden.extend(document.getElementById("left")),
    str = left.stream("click"),
    str2 = left.stream('click'),
    console1 = document.getElementById('console1');

str.map('x').listen(function(e){
  console.log('Emitted')
  console1.innerHTML += "X = " + e + "\n";
});

str2.map('y').listen(function(e){
    console1.innerHTML += "Y = " + e + "\n\n";
});

///////////////////////////////////////////


var i1 = Warden.extend(document.getElementById("input1"))
    ,i2 = Warden.extend(document.getElementById("input2"));

var ic1 = document.getElementById('cni1'),
    ic2 = document.getElementById('cni2'),
    ic1 = document.getElementById('cni3');

var i1kd = i1.stream('keypress').map('keyCode').map(String.fromCharCode),
    i2kd = i2.stream('keypress').map('keyCode').map(String.fromCharCode);

i1kd.listen(function(e){
  cni1.innerHTML += e;
});

i2kd.listen(function(e){
  cni2.innerHTML += e;
});

i1kd.merge(i2kd).listen(function(e){
  cni3.innerHTML += e;
});


//////////////////////////////////////////

var mid = Warden.extend(document.getElementById('middle')),
    c3 = document.getElementById('console3');

var mouseMoves = mid.stream('mousemove');

mouseMoves.interpolate("Mouse now on x:{{x}}, y:{{y}}").listen(function(e){
  c3.innerHTML = e;
});

