/*
  Processor module:
  In all processing functions: this variable is EventBus object;
*/

function Processor(proc, host){
  var processes = proc || [], 
      locked = 0, 
      i = 0,
      self = this;
  
  this.getProcesses = function(){
    return processes;
  };

  var fns = [
    function $continue(data, context){
       return self.tick(data);
    },
    function $break(preventValue){
      return self.tick({}, 1); //break
    },
    function $lock(){
      return locked = 1;
    },
    function $unlock(){
      return locked = 0;
    },
    function $host(){
      return self.hoster;
    }];
  

  this.hoster = host;

  this.start = function(event, context, fin){
    self.ctx = context;
    self.fin = fin;    
    
    if(locked){
      i = 0;
    }
    
    if(i==processes.length){
      i = 0;
      return fin(event);
    } 

    forEach(fns, function(x){
      self.ctx[x.name] = x;
    });

    this.tick(event);
  }

  this.tick = function(event, br, async){        
    if(br){
      i = 0;
      return void 0;
    }
    
    if(i==processes.length){
      forEach(fns, function(x){
        delete self.ctx[x.name]
      });
      i = 0;
      return self.fin(event);
    }
    i++
    processes[i-1].apply(self.ctx, [event]);
  };  
}