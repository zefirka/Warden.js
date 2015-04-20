$(function(){
  var Letters = Warden.Stream(function(fire){
  $('#letters').find('.btn').click(function(event){
    var cnt = $(this);
    fire(cnt.text(), cnt);
  });
});

var Codes = Warden.Stream(function(fire){
  $('#codes').find('.btn').click(function(event){
    var cnt = $(this);
    fire(cnt.text(), cnt);
  });
});

  var current = Letters.combine(Codes, function(letter, code){
    return (letter || "") + (code || "");
  });

  current.bindTo($('#res'), 'html');
})