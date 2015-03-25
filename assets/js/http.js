var http = {};

var gets = Warden.Stream(function(trigger){
  this.get = function(url){
    $.get(url, trigger)
      .fail(function(err){
        trigger(err);
      });
  }
}, http);

function isString(res){
  return typeof res == 'string';
}

var successes = gets.filter(isString),
    errors = gets.filter(Warden.Utils.not(isString));

var errorMessage = "<p class='error'> Error: {{status}}: {{statusText}}</p>";

errors
  .interpolate(errorMessage)
  .merge(successes)
  .bindTo($(".box"), 'html');

$('.exist').click(function(){
  http.get('templates/test/file.html'); //this file exist
});

$('.nexist').click(function(){
  http.get('thereisnofile.html'); //this file exist
});

$('.wrd').click(function(){
  http.get('/Warden.js'); //this file exist
});


