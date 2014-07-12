/* Triggering function */

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
};