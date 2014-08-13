(function() {
  (function(root, factory) {
    var Warden;
    if (typeof exports === 'object' && exports) {
      return factory(exports);
    } else {
      if (!root.Warden) {
        Warden = {};
      } else {
        Warden = root.Warden;
        factory(Warden);
      }
      if (typeof define === 'function' && define.amd) {
        return define(Warden);
      } else {
        return root.Warden = Warden;
      }
    }
  })(this, function(Warden) {


Warden.WebServer = (function(){         
  var server = Warden.extend({
   get : function(url){
    var self = this;
      $.ajax({
        type: "GET",
        dataType: "text",
        url: url,
        beforeSend : function(){
          var res = self.before && self.before();
          self.emit({type:'before', data: res});
        },
        success: function(e){
          self.emit({type:'get', data:e});
        },
        error: function(e){
          self.emit({type:'error', data:e});
        }
      });
    }
  });
  
  server.befores = server.stream('before');
  server.gets = server.stream('get').map('data');
  server.errors = server.stream('error').map('data');
  server.responses = server.gets.merge(server.errors);
  return server;
})();

}); 