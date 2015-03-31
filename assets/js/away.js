$(function(){

var userActions = $(document).stream('mousemove, mousedown, keydown, scroll');

var awayModule = {
  box: $('.box .overlay'),
  show: function(){
    this.box.show().fadeIn();
  },
  hide: function(){
    this.box.fadeOut(function(){
      this.box.show();
    }.bind(this));
  }
};

awayModule.aways = Warden.Stream(function(trigger) {
      var timeout; 
      
      this.start = function(){
        timeout = setTimeout(trigger, 5000);
      }

      this.restart = function(){
        this.clear();
        this.start();
      }
      
      this.clear = function(){
        clearTimeout(timeout);
      }

      this.start(5000);
    }, awayModule);



userActions
  .listen(awayModule.restart)
  .listen(awayModule.hide);

awayModule.aways
  .listen(awayModule.show);

});