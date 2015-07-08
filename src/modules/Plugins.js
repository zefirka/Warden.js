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


Warden.From = function(el, e){
  var val = el.value || ( el.val && el.val() );

  var s = Warden.Stream().watch();

  s.value = val;

  return s
}