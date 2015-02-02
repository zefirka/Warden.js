/*
  Pipe module:
  Implements interface to processing all databus methods.
  Version: v1.0.0;
*/
function Pipeline(proc, host){
  var processes = proc || [], locked = 0, i = 0,

      /* Functional methods to manipulate DataBus processing workflow */
      fns = {
        /* Continue processing with @data */
        next: function(data){
           return self.tick(data);
        },
        /* Break processing */
        stop: function(){
          return self.tick({}, 1);
        },
        /* Locks DataBus evaluation */
        pause: function(){
          return locked = 1;
        },
        /* Unlocks DataBus evaluation */
        play: function(){
          return locked = 0;
        },
        /* Returns current DataBus */
        bus: function(){
          return host;
        }
      };

  var self = {
    /* Add process if @p exists or return all processes of this Processor */
    pipe : function(p){
      if(p){
        processes.push(p)
        return self;
      } 
      return processes;
    },

    /* Start processing */
    start : function(event, context, fin){
      self.ctx = context;
      self.fin = fin;

      i = locked ? 0 : i;

      if(i==processes.length){
        i = 0;
        return fin(event);
      }

      this.tick(event);
    },

    /* Ticking processor to the next process */
    tick : function(event, breaked){
      if(breaked){
        return i = 0;
      }

      if(i==processes.length){
        i = 0;
        return self.fin(event);
      }

      i++;
      processes[i-1].apply(self.ctx, [event, fns]);

    }
  }
  return self;
}

Warden.pipeline = Pipeline