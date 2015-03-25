var http = {};

var gets = Warden.Stream(function(trigger){
  this.get = function(url){
    $.get(url, trigger)
  }
}, http);

http.get('templates/test/file.html'); //this file exist