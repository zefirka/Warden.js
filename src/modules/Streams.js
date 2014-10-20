/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.3.3
    
  -- v0.3.3 -- 
    - Added $context in object. Removed class name.
  
  -- v0.3.2 --
    - Fixed mistakes in pop and push down and up

  -- v0.3.0 --
    - Stream strict checking argument now must be only boolean true
    
  -- v0.2.0 -- 
    Added @popAllDown and @popAllUp methods;

  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = (function(){
  var each = Utils.each, 
      is = Utils.is,
      map = Utils.map;

  /* Stream constructor */
  function Stream(context){
    var drive = [];

    return {
      $$id : Utils.$hash.set('s'), // stream id
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
        each(drive, function(b, i){
          if(bus.$$id == b.$$id){
            drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
          }
        });
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
      get : function(){
        var bus = new DataBus();
        bus.host(this);
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
    // }else
    // if(is.array(x)){
    //   x = Warden.extend(x);

    //   var arrayMethods = ['pop', 'push', 'indexOf', 'lastIndexOf', 
    //     'slice', 'splice',  'reverse', 'map', 
    //     'forEach', 'reduce', 'reduceRight', 'join', 
    //     'filter', 'concat', 'shift', 'sort', 'unshift'],

    //     functionalObjects = map(arrayMethods, function(fn){
    //       return {
    //         name: fn,
    //         fun: Array.prototype[fn] }
    //     });


    //   /* Extending methods of a current array with stream evaluation */
    //   each(functionalObjects, function(item){
    //     x[item.name] = function(){
    //       item.fun.apply(x, arguments);
    //       x.emit(item.name, arguments);
    //     }
    //   });      
    // }

    return stream;
  };
})();