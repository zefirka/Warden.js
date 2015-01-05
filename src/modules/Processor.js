/*
  Processor module:
  Implements interface to processing all databus methods.
  Version: v1.0.0;
*/

function Processor(proc, host){
  var processes = proc || [], locked = 0, i = 0,

      /* Functional methods to manipulate DataBus processing workflow */
      fns = {
        /* Continue processing with @data */
        $continue: function(data){
           return self.tick(data);
        },
        /* Break processing */
        $break: function(){
          return self.tick({}, 1);
        },
        /* Locks DataBus evaluation */
        $lock: function(){
          return locked = 1;
        },
        /* Unlocks DataBus evaluation */
        $unlock: function(){
          return locked = 0;
        },
        $update: function(){
          host.update();
        },
        /* Returns current DataBus */
        $host: function(){
          return host;
        }
      };

  var self = {
    /* Add process if @p exists or return all processes of this Processor */
    process : function(p){
      return p ? processes.push(p) : processes;
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
