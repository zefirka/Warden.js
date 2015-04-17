var position = {
  x: '.clientX',
  y: '.clientY'
}

function DragnDrop(o){
  var self = this,
      rad = o.width()/2;
      
    //streams
  var downs = o.stream('mousedown').map(position),
      ups = $(document).stream('mouseup').map(position),
      moves = $(document).stream('mousemove', $('.box')).map(position);

  this.moves = moves.after(downs).map(function(pos){
    var minx = this.offset().left,
        miny = this.offset().top,
        wo = this.width(),
        ho = this.height();
    
    if(pos.x - rad <= minx){
      debugger;
    }  
    pos.x = pos.x - rad <= minx ? minx + rad : pos.x;
    pos.x = pos.x + rad > minx + wo ? minx + wo - rad : pos.x;
    pos.y = pos.y - rad <= miny ? miny + rad : pos.y;
    pos.y = pos.y + rad > miny + ho ? miny + ho - rad: pos.y;
    pos.offsetx = minx;
    pos.offsety = miny;
    pos.y = (pos.y - pos.offsety - rad) || 0;
    pos.x = (pos.x - pos.offsetx - rad) || 0;
    return pos;
  });
 
  var coors = this.moves.interpolate($(".data-info").html()).bindTo($(".data-info"), 'html');
  this.moves.listen(function(pos){
    o.css({
      top: pos.y,
      left: pos.x
    })
  })

  // this.moves.toggleOn(ups, true)
  // this.moves.toggleOn(downs, false);

  ups.listen(function(){
    self.moves.lockThis();
    coors.lockThis();
  })

  downs.listen(function(){
    coors.unlockThis();
    self.moves.unlockThis();
  })
}

$(function(){
  var dnd = new DragnDrop($(".dragndrop"));
  dnd.positions
});