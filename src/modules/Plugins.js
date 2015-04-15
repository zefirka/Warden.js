Warden.Worker = function(adr){
  adr = adr.slice(-3) == '.js' ? adr : adr + '.js';
  var worker = new Worker(adr); 
  var stream = Warden.Host();
  worker.onmessage = function(){
    stream.eval(arguments)
  }
  stream.post = worker.postMessage;
  stream.onmessage = worker.onmessage
  return stream.newStreamt();
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
  return Warden.Stream(function(fire){
    each(deps, function(stream){
      stream.listen(function(data){
        fire.call(this, formula.apply(this, deps), this);
      });
    });
    setTimeout(function(){
      fire(formula.apply(ctx || null, deps));
    });
  }).watch();
}