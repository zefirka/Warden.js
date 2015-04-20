Warden.Stream = (function(){
  /* Host constructor */
  function Host(context){
    var drive = [], interval;

    return {
      $$context : context, // saving context
      /* 
        Evaluating the stream with @data 
      */
      eval : function(data, ctx){
        each(drive, function(bus){
          bus.fire(data, ctx || context);
        });
      },

      /* 
        Push into executable drive @bus.
        Bus is Stream object.
      */
      push : function(stream){
        drive.push(stream);
        return stream;
      },

      pop : function(stream){
        return Utils.forWhile(drive, function(s, i){
          if(s.$$id = stream.$$id){
            drive.splice(i,1);
            return false
          }
        }, false, stream);
      },

      /*
        Creates empty Stream object and hoist it to the current stream
      */
      newStream : function(){
        var bus = new Stream();
        bus.host = this;
        return bus;
      }
    };
  }

  Warden.Host = Host;

  /* 
    Creates stream of @x on context @context;
    If @strict argument is truly, than it warns about the coincidence 
    in the context to prevent overwriting;
  */
  return function(x, context, strict){
    var stream, xstr, reserved = [], i, bus;    
    context = context || {};  
    stream = Host(context);

    if(is.fn(x)){

      /* If we strict in context */
      if(strict===true){
        xstr = x.toString();

        for(i in context){
          if(context.hasOwnProperty(i))
            reserved.push(i);
        }

        each(reserved, function(prop){
          if(xstr.indexOf("this."+prop)>=0){
            /* If there is a coincidence, we warn about it */
            console.error("Coincidence: property: '" + prop + "' is already defined in stream context!", context);
          }
        });    
      }

      x.call(context, function(expectedData, ctx){
        stream.eval(expectedData, ctx);
      });  
    }

    bus = new Stream();
    bus.host = stream;
    return bus;
  };
})();

/* Deprecated */
Warden.makeStream = Warden.Stream