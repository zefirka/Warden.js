var kd = Warden(document).stream('keydown');

var chars = kd.map('.keyCode').map(String.fromCharCode);
var letters = chars.filter(function(ch){
  return "0123456789".indexOf(ch) == -1;
});
var inputs = chars.reduce('', function(res, ch){
  return res.concat(ch);
});

$(function(){
  kd.bindTo($("#clead"), 'html');
  chars.bindTo($("#mapped"), 'html');
  letters.bindTo($("#filtered"), 'html');
  inputs.bindTo($("#reduced"), 'html');
});
