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

Warden.Formula = function(deps, formula, context){
  var toCheck = false;
  var res = Warden.Stream(function(update){
    var self = this;
    each(deps, function(stream){
      stream.listen(function(value){
        update(formula.apply(self, deps));
      });

      if(toCheck || stream.valueOf()){
        toCheck = true;
      }

    });
  }, context).watch();

  if(toCheck){
    setTimeout(function(){
      res.fire(formula.apply(context, deps));
    });
  }

  return res;
}

Warden.From = function(source){
  var checkObject;

  var run;

  var str = Warden.Stream(function(fire){
    run = fire;
  }).map('@value').watch();

  function sp(i){
    if("INPUT TEXTAREA".indexOf(i.tagName) >=0){
      i.addEventListener("keyup", function(data){
        run(data, this);
      });
    }
    if("SELECT".indexOf(i.tagName) >=0){
      i.addEventListener("change", function(data){
        run(data, this);
      }); 
    }
    run(i.value, i);
  }

  if(typeof source == 'string'){
    if(jQueryInited){
      source = $(source);
    }else{
      source = document.querySelectorAll(source);
    }
  }

  if(source.length){
      each(source, sp);
  }else{
    if(jQueryInited && source instanceof jQuery){
      sp(source[0])
    }else{
      sp(source);
    }
  }
  

  var argv = toArray(arguments).slice(1);

  each(argv, function(fun){
    str = str.map(fun);
  });

  return str;
}