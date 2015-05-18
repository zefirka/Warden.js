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
  var formulaStream = Warden.Stream(formula.toString(), ctx || {});

  each(deps, function(stream){
    stream.listen(function(data){
      var formulaValue = formula.apply(ctx || this, deps);

      formulaStream.fire(formulaValue);
    });
  });
  
  formulaStream.watch();

  formulaStream.value = formula.apply(ctx, deps);
  
  return formulaStream
}

