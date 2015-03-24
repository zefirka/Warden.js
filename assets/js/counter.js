$(function(){
  $('.plus').stream('click').map(1).merge($('.minus').stream('click').map(-1)).reduce(0, function(a,b){
    return a+b
  }).bindTo($(".result"), 'html');

  $("#submenu-cont")
});