$(function(){
  Warden.extend($);

  var item = $(".item"),
      cont = $(".cont"),
      res = $(".value");

  var minY = cont.position().top,
      maxY = minY + cont.height();

  function redraw(e){
    this.css('bottom', cont.height() - e);
  }

  function mapY(e){
    return e<=minY ? minY : (e>= maxY ? maxY : e);  
  }

  var mousedowns = cont.stream('mousedown'),
      mouseups = $(document).stream('mouseup'),
      mousemoves = $(document).stream('mousemove', item);

  cont.listen('click', function(e){
    [mousedowns, mousemoves, mouseups].forEach(function(i){ i.host().eval(e); });
  });

  var moves = mousemoves.map('clientY').map(mapY);

  moves.listen(redraw);
  debugger;
  moves.bindTo(res, res.html);

  mousedowns.listen(function(){
    moves.unlock();
  });

  mouseups.listen(function(){
    moves.lock();
  });

  res.html(0);
  moves.lock();

});