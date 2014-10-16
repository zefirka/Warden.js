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
    var MAX_ARR_SHOW_LENGTH = 5;

    function isArray(x){
      if( Object.prototype.toString.call(x) === '[object Array]' ) {
        return true
      }
      return false
    }

    function toStringFunction(val){
      var tmp = val.toString();
      return  tmp.slice(0, tmp.indexOf(")")+1) + "{...}";
    }

    function toStringArr(arr, delim, max) {
      var m = max || MAX_ARR_SHOW_LENGTH;
      if(arr.length > m){
        return "[array]";
      }else{
        var mapped = arr.map(function(item){
          return Warden.stringify(item, delim, max);
          debugger;
        });
        return "[" + mapped.join("," + (delim ? "\n" : " ")) + "]";
      }      
    }

    function toStringJson(arg, delim, maxdepth, short, n){
      var i, key, offset, res, val;
      
      var res = "", // result
          offset = ""; //padding

      res = "{" + (delim ? "\n" : " "); 
      n = !n ? 0 : n;
      maxdepth = maxdepth || 2;
      if(n > maxdepth){
        res = "[object]";
        return res;
      }

      var i = 0;
      while(i++ <= n && delim){
        offset += "\t";
      }

      for (key in arg) {
        val = arg[key];
        res += "" + offset + key + ":" + (delim ? " " : "");

        if(isArray(val)){
          res += toStringArr(val);
          res += (delim ? ",\n" : ", ");
        }else
        if(typeof val === 'object') {
          res += Warden.stringify(val, delim, maxdepth, short, n + 1) + (delim ? ",\n" : ", ");
        }else
        if(typeof val === 'function'){          
          res += toStringFunction(val) + (delim ? ",\n" : ", ");
        }else{
          if(val != null){
            if(typeof val === 'string'){
              res += "'" + (val.toString()) + "'" + (delim ? ",\n" : ", ");
            } else {
              res += val.toString() + (delim ? ",\n" : ", ");
            }
          } else {
            res +=  (delim ? "- " : " - ") + (delim ? ",\n" : ", ");
          }
        }
      }
      res = res.slice(0, -2);
      res +=  (n>0) ? " }" : (delim ? "\n" + "" + "}" : " }");    

      return res;
    }
    Warden.stringify = function(arg, delim, maxdepth, short, n){
      if(isArray(arg)){
        return toStringArr(arg, delim);
      }else
      if(typeof arg === 'function'){
        return toStringFunction(arg);
      }else
      if(typeof arg === 'object'){
        if(arg === null){
          return "null"
        }else{
          if(Object.keys(arg).length){
            return toStringJson(arg, delim, maxdepth, short, n);
          }else{
            return "{}";
          }
        }
      }else{
        if(typeof arg === 'string'){
          return "'"+arg+"'";
        }else{
          return arg !== undefined ? arg.toString() : (delim ? "- " : " - ");
        }
      }
    };
  });

}).call(this);


