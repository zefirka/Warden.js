/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.2.1

  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = (function(){
  /* Stream class */

  function Stream(context){
    var drive = [];
    return  {
      id : Math.random() * 1000 >> 0,
      eval : function(data){
        forEach(drive, function(bus){
          bus.fire(data, context);
        });
      },
      push : function(bus){
        drive.push(bus);
      },
      pop : function(bus){
        forEach(drive, function(b, i){
          /* Здесь надо проверить наследование прототипов, и если это сходные объекты, то это одно и то же */
          if(bus == b){
            drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
          }
        });
      },
      get : function(){
        var bus = new DataBus();
        bus.host(this);
        return bus;
      }
    }
  }

  return function(x, context, strong){
    var stream, xstr, reserved = [];

    Analyze("makeStream", x);
    
    context = context || {};  
    stream = Stream(context);

    if(is.fn(x)){
      xstr = x.toString();

      for(var i in context){
        if(context.hasOwnPropery(i)){
          reserved.push(i);
        }
      }

      forEach(reserved, function(i){
        if(xstr.indexOf("this."+i)>=0){
          console.warn("You have used reserved word '" + i + "' in stream");
        }
      });    
      
      x.apply(context, [function(expectedData){
        stream.eval(expectedData);
      }]);  
    }    
    return stream;
  };
})();