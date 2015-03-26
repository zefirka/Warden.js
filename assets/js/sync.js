$(function(){
  var alpha = $(".a").stream('click').map('alpha');
  var betta = $(".b").stream('click').map('betta');
  var gamma = $(".c").stream('click').map('gamma');

  var result = alpha.sync(betta, gamma).map(function(arr){
    return arr.join(', ');
  });

  var status = alpha.take(1).merge(betta.take(1), gamma.take(1)).reduce('Already clicked: ', function(a, b){
    return a + " ," + b;
  });

  result.bindTo($("#result"), "html");
  status.bindTo($("#status"), "html");
});