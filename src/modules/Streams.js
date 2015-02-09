Warden.makeStream = (function(){
  var each = Utils.each, 
      is = Utils.is;

  /* Stream constructor */
  function Stream(context, type){
    var drive = [], interval;

    return {
      $$id : Utils.$hash.set('s'), // stream id
      $$context : context, // saving context
      $$type : type,
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

      pushAllUp : function(bus){
        var self = this;
        drive.push(bus);
        function pParent(x){
          if(is.exist(x.parent)){
            drive.push(x.parent);
            pParent(x.parent);
          }
        }
        pParent(bus);
      },

      pushAllDown : function(bus){
        var self = this;
        each(self.push(bus).children, function(b){
          self.pushAllDown(b);
        });
      },

      /* 
        Removes from executable drive @bus.
        Bus must be DataBus object.
      */
      pop : function(bus){
        Utils.forWhile(drive, function(b, i){
          if(bus.$$id == b.$$id){
            drive.splice(i, 1);
            return false;
          }
        }, false);
        return bus;
      },

      /* 
        Removes from executable drive @bus and all @bus children;
        @bus must be DataBus object.
      */
      popAllDown : function(bus){
        var self = this;
        each(self.pop(bus).children, function(e){
          self.popAllDown(e);
        });
      },

      /* 
        Removes from executable drive @bus, @bus.parent and @bus.parent.parent etc
        @bus must be DataBus object
      */
      popAllUp : function(bus){
        var match = this.pop(bus);
        if(is.exist(match.parent)){
          this.popAllUp(match.parent);
        }
      },

      /*
        Creates empty DataBus object and hoist it to the current stream
      */
      bus : function(){
        var bus = new DataBus();
        bus.host = this;
        return bus;
      }
    };
  }

  /* 
    Creates stream of @x on context @context;
    If @strict argument is truly, than it warns about the coincidence 
    in the context to prevent overwriting;
  */
  return function(x, context, strict){
    var stream, xstr, reserved = [], i;

    Analyze("makeStream", x);
    
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
    return stream;
  };
})();