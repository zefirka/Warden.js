describe('Context saving', function () {
    var Context = {
      test : 'non-exists'
    }
  
    var module = Warden.extend({
      test : 'exists'
    });  
    
	it('-- Stream execution Context', function(done){
      var busMod = module.stream('sync');
      var busBinded = module.stream('sync', Context); 
      
      var executed = {};
      
      busMod.listen(function(){
        executed.mod = this.test;
      });
      
      busBinded.listen(function(){
        executed.bind = this.test;
      });
      
      module.emit('sync');
      
      expect(executed.mod).toBe('exists');
      expect(executed.bind).toBe('non-exists');
      
      done();
    });
  
  	it('-- Stream methods context', function(done){
      var bus = module.stream('sync', Context); 
      
      var executed = {};

      //console.log(bus.$$context.test);
      
      function sil(){
        executed[Math.random()] = this.test;
        return true;
      }
      
      bus.map(sil).listen(sil);
      bus.filter(sil).listen(sil);
      bus.reduce(0, sil).listen(sil);

      
      module.emit('sync');
      
      for(var i in executed){
        expect(executed[i]).toBe('non-exists');
      }
      
      done();
    });
  
    it('-- Stream Context', function (done) { 
	  var context = {x:10};
      var stream = Warden.Stream(function(trigger){
        this.y = 10;
        this.sync = function(x){
          trigger()
        };
      }, context);
      
      expect(context.y).toBe(10);
      
      done();
	});
});