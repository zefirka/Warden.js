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