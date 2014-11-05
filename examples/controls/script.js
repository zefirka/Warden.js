$(function(){
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
            x : obj.position().left >> 0,
            y : obj.position().top >> 0
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

  function PipNope(cnt){
    var messageStreams = (function(){
      var col = [];

      cnt.find(".user[uid]").each(function(){
        var res = {
          selectbox : $(this).find('.selectbox'),
          messages : [],
          showMsg : true,
          isShowing : false,
          count : 0,
          counter : $(this).find('.counter'),
          elem : $(this).find('.about'),
          tooltip : $(this).find('.tooltip'),
          name : $(this).find('.about').text().split(',')[0],
          bus : Warden.makeStream(function(trigger){
            var self = this;

            self.start = function(time){
              setTimeout(function(){
                trigger({
                  msg: 'Ахалай махалай!',
                  date : new Date()
                });
                var t = Math.random()*12000 >> 0;
                self.start(t < 2000 ? 2000 : t);
              }, time);
            }

            var t = Math.random()*12000 >> 0;
            self.start(t < 2000 ? 2000 : t);

          }).get(),
          uid : $(this).attr('uid')
        };

        res.counts = Warden.extend(res.messages).stream('push');

        col.push(res);

      });

      return col;
    })();

    messageStreams.forEach(function(item){
      
      item.elem.find('.open').listen('click', function(){
        $(".selectbox").hide();
        item.selectbox[item.selectbox.css('display')=='none' ? 'show' : 'hide']();
      });

      item.elem.click(function(){
        item.count=0;
        item.counter.html(item.count);
      });

      var counting = item.counts.listen(function(e){
        item.count++;
        item.counter.html(item.count);
      });

      var arriving = item.bus.listen(function(data){

        item.messages.push(data);

        var timeout = null;

        item.tooltip.text(data.msg);
        if(item.isShowing){
          
          clearTimeout(timeout);

          setTimeout(function(){
            item.tooltip.fadeOut(200, function(){
              item.isShowing = false;
            });
          }, 1500);

        }else{

          item.tooltip.fadeIn(200, function(){
            item.isShowing = true;

            setTimeout(function(){
              item.tooltip.fadeOut(200, function(){
                item.isShowing = false;
              });
            }, 1500);
          });
        }

      });

      item.selectbox.find('input[name="h"]').change(function(){
        if(item.showMsg){
          arriving.lock();
        }else{
          arriving.unlock();
        } 

        item.showMsg= !item.showMsg;
      });

      item.selectbox.find('input[name="c"]').change(function(){
        item.counter[item.counter.css('display')=='none' ? 'show' : 'hide']();
      });


    });

  }
  
  window.pnp = PipNope($('.users'));
  window.dnd = DragDrop("dragndrop");
  window.slider = Slider($(".slider"));

});