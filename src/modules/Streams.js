/*
  Streams module:
    docs: ./docs/Streams.md
    version: 0.1.0

  Creates stream of data.
  If @x is string, that it interprets as datatype
  else if @x is function, than x's first arg is emitting data function
*/

Warden.makeStream = function(x, context, strong){
  var stream, xstr;
  
  Analyze("Warden", "makeStream", x)._string(function(){
    stream = new Stream(context);
  })._function(function(){
    stream = new Stream(context);
    xstr = x.toString();

    forEach(["eval", 'pop', 'push', 'get'], function(i){
      if(xstr.indexOf("this."+i)>=0){
        console.warn("You have used reserved word '" + i + "' in stream");
      }
    });    
    
    x.apply(stream, [function(expectedData){
      stream.eval(expectedData);
    }]);  
  });
  
  /* If @x is string then @x is datatype for stream */
  // if(is.str(x)){
  //  как было  
  // }else
  // if(is.fn(x)){
    
  // }
  return stream;
};

/* Stream class */
function Stream(context){
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
