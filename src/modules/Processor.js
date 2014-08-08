/*
  Processor module:
  In all processing functions: this variable is EventBus object;
*/

function Processor(proc, host){
  var processes = [] || proc, 
      i = 0, 
      self = this;
  this.result = null;

  var fns = [
  function $continue(data, context){
     return self.tick(data, context);
  },
  function $break(preventValue){
    return preventValue || false;
  },
  function $host(){
    return self.hoster;
  }];

  this.push = function(process){
    processes.push(process)
  }

  this.getLength = function(){
    return processes.length;
  };
  
  this.flush = function(){
    i = 0;
  };

  this.hoster = host;

  this.start = function(event, context, fin){
    var i = 0;
    self.fin = fin;
    // если процессоров нет
    if(i>=processes.length){
      return event;
    } 

    // подготавливаем контекст
    forEach(fns, function(x){
      context[x.name] = x;
    });

    //запустили процессор
    this.tick(event, context);
  }

  this.tick = function(event, context){    
    if(i==processes.length){
      // очищаем контекст от барахла
      forEach(fns, function(x){
        delete  context[x.name]
      });
      return fin(event);
    }
    i++;
    processes[i].apply(context, [event]);
  };  
}

