/*
  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = function(x, context){
  var stream, ctype = typeof x;

  switch(ctype){
    case 'function':
      for(var i = 0, type = ""; i<2; i++){
        type += (Math.random() * 100000 >> 0) + "-";
      }

      stream = new Stream(type.slice(0,-1), context);
      x(function(expectedData){
        stream.eval(expectedData);
      });
    break;
    case 'string':  
      stream = new Stream(x, context);
    break;
    default:
      throw "Unexpected data type at stream\n";
      break;
  }
  
  return stream;
}

function Stream(dataType, context, toolkit){
  var listeningBuses = [];
  this.drive = []; 
  this.id = Math.random() * 10000 >> 0;

  var bus = new DataBus();
  bus.setHost(this);

  this.eval = function(data){
    listeningBuses.forEach(function(bus){
      bus.fire(data, context);
    });
  };

  this.push = function(bus){
    listeningBuses.push(bus);
  };

  this.get = function(){
    return bus;
  };

  return this;
}