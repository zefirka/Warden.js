/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.0.3

  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = function(x, context){
  var stream;

  /* If @x is string then @x is datatype for stream */
  if(is.str(x)){
    stream = new Stream(x, context);
  }else
  if(is.fn(x)){
      /* 
        Genereting pseudo-random data-type for custom data stream.
        Need to change it to more efficiently method.
        May be we should research ability to remove required data-type. 
        I think it possible cuz i don't find any reqirements at first look on streams realization.
      
        I've commented this code:
        
        for(var i = 0, type = x.name; i<2; i++){
          type += (Math.random() * 100000 >> 0) + "-";
        }

        It weird but it's working.
      */

      stream = new Stream(0, context);
      stream.context = {}; //maybe we should use just stream as a context object?
      x.apply(stream.context, [function(expectedData){
        stream.eval(expectedData);
      }]);  
  }else{
    throw "Unexpected data type at stream";
  }
  return stream;
};

/* Why did i add dataType? */
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
        drive = drive.slice(0,d).concat(drive.slice(d+1,drive.length))
      }
    });
  };

  this.get = function(){
    return bus;
  };

  /* Need to research: 
  this.get = function(){
    var bus = new DataBus();
    bus.host(this);
    return bus;
  }

  and delete old bus
  */

  return this;
}