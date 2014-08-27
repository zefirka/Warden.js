/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.2.2

  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = (function(){
  
  /* Stream constructor */
  function Stream(context){
    var drive = [];
    var self = new (function Stream(){});
    return  extend(self, {
      /*
        For debugging:
      */
      $$id : $Warden.set('s'),

      /* 
        Evaluating the stream with @data 
      */
      eval : function(data){
        forEach(drive, function(bus){
          bus.fire(data, context);
        });
      },
      
      /* 
        Push into executable drive @bus.
        Bus is DataBus object.
      */
      push : function(bus){
        drive.push(bus);
      },

      /* 
        Removes from executable drive @bus.
        Bus must be DataBus object.
      */
      pop : function(bus){
        var match;
        forEach(drive, function(b, i){
          if(bus.$$id == b.$$id){
            drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
            match = b;
          }
        });
        return match;
      },

      /* 
        Removes from executable drive @bus and all @bus children;
        @bus must be DataBus object.
      */
      popAllDown : function(bus){
        var match = this.pop(bus);
        forEach(match.children, this.pop);
      },

      /* 
        Removes from executable drive @bus, @bus.parent and @bus.parent.parent etc
        @bus must be DataBus object
      */
      popAllUp : function(bus){
        var match = this.pop(bus);
        if(is.exists(match.parent)){
          this.popAllUp(match.parent);
        }
      },

      /*
        Creates empty DataBus object and hoist it to the current stream
      */
      get : function(){
        var bus = new DataBus();
        bus.host(this);
        return bus;
      },
    });
  }


  /* 
    Creates stream of @x on context @context;
    If @strict argument is truly, than it warns about the coincidence 
    in the context to prevent overwriting;
  */
  return function(x, context, strict){
    var stream, xstr, reserved = [];

    Analyze("makeStream", x);
    
    context = context || {};  
    stream = Stream(context);

    if(is.fn(x)){

      /* If we strict in context */
      if(is.exist(strict)){
        xstr = x.toString();

        for(var i in context){
          if(context.hasOwnPropery(i)){
            reserved.push(i);
          }
        }

        forEach(reserved, function(prop){
          if(xstr.indexOf("this."+prop)>=0){
            /* If there is a coincidence, we warn about it */
            Analyze.MAP.warn(prop, context);
          }
        });    
      }

      x.apply(context, [function(expectedData){
        stream.eval(expectedData);
      }]);  
    }    
    return stream;
  };
})();