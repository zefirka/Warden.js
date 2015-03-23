Warden.Stream = (function(){
  /* Stream constructor */
  function Stream(context){
    var drive = [], interval;

    return {
      $$context : context, // saving context
      /* 
        Evaluating the stream with @data 
      */
      eval : function(data){
        each(drive, function(bus){
          bus.fire(data, context);
        });
      },

      /* 
        Push into executable drive @bus.
        Bus is DataBus object.
      */
      push : function(bus){
        drive.push(bus);
        return bus;
      },

      /*
        Creates empty DataBus object and hoist it to the current stream
      */
      newBus : function(){
        var bus = new DataBus();
        bus.host = this;
        return bus;
      }
    };
  }

  Warden.Host = Stream;

  /* 
    Creates stream of @x on context @context;
    If @strict argument is truly, than it warns about the coincidence 
    in the context to prevent overwriting;
  */
  return function(x, context, strict){
    var stream, xstr, reserved = [], i, bus;    
    context = context || {};  
    stream = Stream(context);

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

      x.call(context, function(expectedData){
        stream.eval(expectedData);
      });  
    }

    bus = new DataBus();
    bus.host = stream;
    return bus;
  };
})();

Warden.makeStream = Warden.Stream