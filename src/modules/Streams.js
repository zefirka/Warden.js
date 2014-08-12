/*
  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = function(x, context){
  var stream;  
  if(is.str(x)){
    stream = new Stream(x, context);
  }else
  if(is.fn(x)){
      for(var i = 0, type = x.name; i<2; i++){
        type += (Math.random() * 100000 >> 0) + "-";
      }

      stream = new Stream(type.slice(0,-1), context);
      x(function(expectedData){
        stream.eval(expectedData);
      });  
  }else{
    throw "Unexpected data type at stream\n";
  }
  return stream;
};

function Stream(dataType, context, toolkit){
  var drive = [],
      bus = new DataBus();
  
  bus.host(this);

  this.eval = function(data){
    drive.forEach(function(bus){
      bus.fire(data, context);
    });
  };

  this.push = function(bus){
    drive.push(bus);
  };
  
  this.pop = function(bus){
    forEach(drive, function(b, d){
      if(bus == b){
        console.log("Removed DataBus:"+bus.id);
        drive = drive.slice(0,d).concat(drive.slice(d+1,drive.length))
      }
    });
  };

  this.get = function(){
    return bus;
  };

  return this;
}