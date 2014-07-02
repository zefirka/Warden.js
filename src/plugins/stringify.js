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
    // object to string function
    Warden.stringify = function(json, delim, maxdepth, short, n){
      var i, key, offset, res, val;
      
      var res = "", // result
          offset = ""; //padding

      res = "{" + (delim ? "\n" : " ");
      
      // Setting up recursion depth
      n = !n ? 0 : n;
      
      // If recursion depth more than 2
      if(n > 2){
        res = "[object]";
        return res;
      }

      var i = 0;
      while(i++ <= n && delim){
        offset += "\t";
      }

      for (key in json) {
        val = json[key];
        res += "" + offset + key + ":";

        if (typeof val === 'object') {
          res += Warden.stringify(val, delim, maxdepth, short, n + 1) + (delim ? ",\n" : ", ");
        }else{
          if(val != null){
            if(typeof val === 'string'){
              res += "'" + (val.toString()) + "'" + (delim ? ",\n" : ", ");
            } else {
              res += val.toString() + (delim ? ",\n" : ", ");
            }
          } else {
            res += "'undefined'" + (delim ? ",\n" : ", ");
          }
        }
      }
      res = res.slice(0, -2);
      res +=  (n>0) ? " }" : (delim ? "\n}" : " }");    

      return res;
    };
  });

}).call(this);


