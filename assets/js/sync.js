$(function(){
  var alpha = $(".a").stream('click').map('alpha');
  var betta = $(".b").stream('click').map('betta');
  var gamma = $(".c").stream('click').map('gamma');

  var result = alpha.sync(betta, gamma).listen(function(arr){
    $("#result").text(arr.join(', '));
  });

  alpha.take(1).merge(betta.take(1), gamma.take(1)).reduce('Already clicked: ', function(a, b){
    return a.concat(b);
  }).bindTo($("#status"), "html");
});