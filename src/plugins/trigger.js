(function() {
  (function(root, factory) {
    var Warden;
    if (typeof exports === 'object' && exports) {
      return factory(exports);
    } else {
      if (!root.Warden) {
        Warden = {};
      } else {
        Warden = root.Warden;
        factory(Warden);
      }
      if (typeof define === 'function' && define.amd) {
        return define(Warden);
      } else {
        return root.Warden = Warden;
      }
    }
  })(this, function(Warden) {
    
    Warden.trigger = function(element, ev){
      if(document.createEvent){
        event = document.createEvent("HTMLEvents");
        event.initEvent(ev.type, true, true);
      }else{
        event = document.createEventObject();
        event.eventType = ev.type
      }

      event.eventName = ev.type;
      for(var i in ev){
        event[i] = ev[i];
      }

      if(document.createEvent){
        element.dispatchEvent(event);
      }else{
        element.fireEvent("on" + event.eventType, event);
      }
      return element;
    };

  });

}).call(this);


