$(function(){
  Warden.extend($);

  function Slider(container){

    var btn = container.find(".btn"),
        cont = container.find(".cont"),
        min = cont.position().left,
        max = min + cont.width(),
        tmpl = container.find('.template'),
        curval = btn.position().left,

        redraw = function(x){
          this.css('left', x - min);
        },

        //streams
        clicks = cont.stream('click', btn).map('clientX'),
        downs = btn.stream('mousedown'),
        moves = $(document).stream('mousemove', btn).map('clientX').filter(function(x){
          return x >= min && x <= max;
        }),
        ups = $(document).stream('mouseup', btn);


        //logic
        downs.listen(function(){
          moves.unlockChildren();
        });

        ups.listen(function(){
          moves.lockChildren();
        });

        clicks.listen(redraw);

        moves.listen(redraw);

        moves.merge(clicks).map(function(x){
          return {
            value : x
          }
        }).interpolate(tmpl.html()).bindTo(tmpl, 'html');

        // initialization
        tmpl.html('');
        moves.lockChildren();
  } 

  function DragDrop(className){
    var self = {},
        tmpl = $(".data-info").html(),
        //helping function
        position = {
          x: 'clientX',
          y: 'clientY'
        },

        //object and constants
        obj = $("." + className),
        w = obj.width()/2,
        h = obj.height()/2,

        //streams
        downs = obj.stream('mousedown').map(position),
        ups = $(document).stream('mouseup').map(position),
        moves = $(document).stream('mousemove', $(".box")).map(position),

        //logic
        binding = moves.map(function(pos){
          var left = this.position().left,
              top = this.position().top,
              wo = this.width(),
              ho = this.height();
            
          pos.x = pos.x - w < left ? left + w : pos.x;
          pos.x = pos.x + w > left + wo ? left + wo - w : pos.x;
          pos.y = pos.y - h < top ? top + h : pos.y;
          pos.y = pos.y + h > top + ho ? top + ho - h: pos.y;
          return pos;
        }).
        listen(function(pos){
          self.onDragStep && self.onDragStep(pos.x, pos.y);
          if(!self.condition || self.condition(pos.x, pos.y)){
            obj.css({
              "top" : pos.y - h - this.position().top,
              "left" : pos.x - w - this.position().left
            });  
          }          
        }),

        distance = moves.map(function(pos){
          return {
            distance : Math.sqrt(Math.pow((self.position.start.x - self.position.current.x), 2) + Math.pow((self.position.start.y - self.position.current.y), 2)) >> 0,
            x : pos.x,
            y : pos.y
          }  
        });

    self.position = {
      current : {},
      start : {},
      end : {}
    }    



    $(".data-info *").remove();

    
    self.bindings = {
      _downs : downs.bindTo(self, 'position/start'),
      _ups: ups.bindTo(self, "position/end"),
      _moves: moves.bindTo(self, "position/current"),
     _distances: distance.interpolate(tmpl).bindTo($('.data-info'), "html")
    }

    downs.listen(function(pos){
      self.onDragStart && self.onDragStart(pos.x, pos.y);
      moves.unlockChildren();
    });

    ups.listen(function(pos){
      self.onDragEnd && self.onDragEnd(pos.x, pos.y);
      moves.lockChildren();
    });

    moves.lockChildren();

    self.$element = obj;

    return self;
  }

  window.dnd = DragDrop("dragndrop");
  window.slider = Slider($(".slider"));

});