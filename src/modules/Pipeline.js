function Pipeline(proc, host){
  var processes = proc || [], locked = 0, i = 0,

      /* Functional methods to manipulate DataBus processing workflow */
      fns = {
        /* Continue processing with @data */
        next: function(data){
           return tick(data);
        },
        /* Break processing */
        stop: function(){
          return i=0;
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
        host: function(){
          return host;
        }
      };

          /* Ticking processor to the next process */
  function tick(event, breaked){
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

      tick(event);
    }
  }
  return self;
}

Warden.Pipeline = Pipeline