var WebServer = (function(){         
  var res = Warden.extend({
   get : function(url){
    var self = this;
      $.ajax({
        type: "GET",
        dataType: "text",
        url: url,
        success: function(e){
          self.emit({type:'get', data:e});
        },
        error: function(e){
          self.emit({type:'error', data:e});
        }
      });
    }
  });
  res.gets = res.stream('get').map('data');
  res.errors = res.stream('error').map('data');
  res.responses = res.gets.merge(res.errors);
  return res;
})();