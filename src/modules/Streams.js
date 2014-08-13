/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.1.0

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

/* Stream class */
function Stream(config, context){
  var drive = [];

  this.eval = function(data){
    drive.forEach(function(bus){
      bus.fire(data, context);
    });
  };

  this.push = function(bus){
    drive.push(bus);
  };
  
  this.pop = function(bus){
    forEach(drive, function(b, i){
      if(bus == b){
        drive = drive.slice(0,i).concat(drive.slice(i+1,drive.length));
      }
    });
  };
  
  this.get = function(){
    var bus = new DataBus();
    bus.host(this);
    return bus;
  };

  return this;
}