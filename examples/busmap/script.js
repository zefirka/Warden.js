$(function(){
  Warden.extend($);

  var root = $(document).stream('click');
  var second = root.map('clientY');

  var bussmap = [
    root, 
    second,
    root.map('one more'),
    root.filter(function(x){return x.clientX > 300}),
    second.map('third')
  ]

  bussmap.forEach(function(bus){
    var id = bus.$$id;
    if(!bus.parent){
      
    }
  });

});