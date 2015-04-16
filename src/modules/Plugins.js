Warden.Worker = function(adr){
  adr = adr.slice(-3) == '.js' ? adr : adr + '.js';
  var worker = new Worker(adr); 
  var host = Warden.Host();
  worker.onmessage = function(){
    stream.eval(arguments)
  }
  var stream = host.newStream();
  stream.post = worker.postMessage;
  stream.onmessage = worker.onmessage
  return stream;
}

Warden.Observe = function(obj){
  if(Object.observe){
    var stream = Warden.Host(obj);
    Object.observe(obj, function(){
      stream.eval.apply(obj, arguments);
    })
    return stream.newStream();
  }else{
    throw "This browser doesn't implement Object.observe"
  }
}

Warden.Formula = function(deps, formula, ctx){
  var stream =  Warden.Stream(function(fire){
    each(deps, function(stream){
      stream.listen(function(data){
        fire.call(this, formula.apply(this, map(deps, function(s){ return s.value; }), this));
      });
    });
  });
  stream.value = formula.apply(this, map(deps, function(s){ return s.value; }), this);
  return stream.watch();
}