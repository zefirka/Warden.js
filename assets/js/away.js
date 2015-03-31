$(function(){

var userActions = $(document).stream('mousemove, mousedown, keydown, scroll');

var awayModule = {
  box: $('.box .overlay'),
  show: function(){
    this.box.show().fadeIn();
  },
  hide: function(){
    this.box.fadeOut(function(){
      this.box.hide();
    }.bind(this));
  }
};

awayModule.aways = Warden.Stream(function(trigger) {
      var timeout,
          self = this;
      
      this.start = function(){
        timeout = setTimeout(trigger, 5000);
      }

      this.restart = function(){
        self.clear();
        self.start();
      }
      
      this.clear = function(){
        clearTimeout(timeout);
      }

      this.start(5000);
    }, awayModule);



userActions
  .listen(awayModule.restart.bind(awayModule))

userActions.after(awayModule.aways)
  .listen(awayModule.hide.bind(awayModule));

awayModule.aways
  .listen(awayModule.show.bind(awayModule));

});