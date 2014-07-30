/*
  Processor module:
  In all processing functions: this variable is EventBus object;
*/

function Processor(){
  var processes = [], i = 0;
  this.result = null;

  this.tick = function(event, context, preventValue) {
    if(i>=processes.length){
      return false;
    }
    
    var res = processes[i].apply(context, [event]);    
    
    if(preventValue !== undefined && res === preventValue){
      res = false;
    }
    i++;
    this.result = res;
    return res;
  };

  this.push = function(process){
    processes.push(process)
  }

  this.getLength = function(){
    return processes.length;
  };
  
  this.flush = function(){
    i = 0;
  };

}
