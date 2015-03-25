var http = {};

var gets = Warden.Stream(function(trigger){
  this.get = function(url){
    $.get(url, trigger)
      .fail(function(err){
        trigger(err);
      });
  }
}, http);

http.get('templates/test/file.html'); //this file exist

function isString(res){
  return typeof res == 'string';
}

var successes = gets.filter(isString),
    errors = gets.filter(Warden.Utils.not(isString));

var errorMessage = "<p class='error'> Error: {{status}}: {{statusText}}</p>";

errors
  .inerpolate(errorMessage)
  .merger(successes)
  .bindTo($(".box"), 'html');