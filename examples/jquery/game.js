var LEVELS = [
  {
    width: 12,
    height: 16,
    player: {x:1, y:1},
    enemy: {x:10, y:10},
    boxes:[
      {x: 3, y:5},
      {x: 3, y:6},
      {x: 3, y:7},
      {x: 6, y:2},
      {x: 5, y:2},
      {x: 4, y:3},
      {x: 4, y:4},
      {x: 2, y:7},
      {x: 2, y:8},
      {x: 10, y:13},
      {x: 11, y:11},
      {x: 11, y:12},
      {x: 9, y:3},
    ]
  }
];

var BlockFactory = (function(){
  var doc = Warden.extend($(document));
  var id = 0;
  var Block = Warden.extend(function Block(x,y){
    this.x = x;
    this.y = y;
  });

  Block.prototype.isTypeOf = function(type){
    return function(pos){
      return $($('.cell', $($(".row")[pos.y]))[pos.x]).hasClass(type);
    }
  };


  
  Block.prototype.isNotNext = function(type){
    return function(pos){
      return !($($('.cell', $($(".row")[pos.y+pos.dir.y]))[pos.x+pos.dir.x]).hasClass(type));
    }
  };

  Block.prototype.isNotTypeOf = function(type) {
    return function(pos){
      return !($($('.cell', $($(".row")[pos.y]))[pos.x]).hasClass(type))
    }
  };

  Block.prototype.conjuncte = function(item) {
    this.conjuncted = item;
    return this;
  };

  Block.prototype.redraw = function(position) {
    this.getCell().removeClass(this.type);
    this.x = position.x;
    this.y = position.y;    
    this.getCell().addClass(this.type);
  };

  Block.prototype.getCell = function() {
    return $($('.cell', $($(".row")[this.y]))[this.x]);
  };

  return {
    create : function(x,y,type){
      var object = new Block(x,y);
      object.type = type;
      object.id = id++;
      object.getCell().addClass(type);
      this.config[type](object);
      return object;
    },
    config : {
      player : function(object){
        function arrows(e){
          return e>=37 && e<=40
        }

        function direction(e){
          return {
            x : e % 2 ? e - 38 : 0, 
            y : !(e % 2) ? e - 39 : 0 
          } 
        }

        var playerKeydowns = doc.stream("keydown", {context: object});
        playerKeydowns.map('keyCode').filter(arrows).map(direction).listen(function(dir){
          object.emit({
            type: 'playerMoves',
            x: object.x + dir.x,
            y: object.y + dir.y,
            dir: dir
          });
        });
        return object;
      },
      enemy : function(object){
        object.start = function(){
          
          var interval = setInterval(function(){
            var p = object.conjuncted;
            var pPos = {x: p.x, y: p.y},
                ePos = {x: object.x, y: object.y};
            var divx = pPos.x - ePos.x;
            var divy = pPos.y - ePos.y;
            var dir = {
              y: divy > 0 ? 1 : (divy < 0 ? -1 : 0),
              x: divx > 0 ? 1 : (divx < 0 ? -1 : 0)
            }
            object.emit({
              type : "enemyMoves",
              x : object.x + dir.x,
              y : object.y + dir.y
            });

          },500)

          object.clear = function(){
            clearInterval(interval);
          }
        
          return object;
        }       

        object.isLockedBy = function(type) {
          return function(){
            var pos = {
              x: object.x,
              y: object.y
            };

            var cell = function(x,y){
              return $($('.cell', $($(".row")[y]))[x]);
            }
            var cells = [
              cell(pos.x+1, pos.y),
              cell(pos.x+1, pos.y+1),
              cell(pos.x, pos.y+1),
              cell(pos.x-1, pos.y),
              cell(pos.x-1, pos.y-1),
              cell(pos.x, pos.y-1),
              cell(pos.x+1, pos.y-1),
              cell(pos.x-1, pos.y+1),
            ];
            var res = true;
            cells.forEach(function(i){ 
              if(i.length){
                if(! i.hasClass(type)){
                  res = false;
                }
              }
            });
            return res;
          }
        };


        return object;
      },
      box: function(object){
        return object;
      }
    }
  }
})();

$(function(){
  var board = $("#game")

  function isNotBorder(pos){
    return pos.x >= 0 && pos.y >= 0 && pos.x < lvl.width && pos.y < lvl.height;
  }
  function isNotNextBorder(pos){
    return pos.x + pos.dir.x >= 0 && pos.y + pos.dir.y >= 0 && pos.x + pos.dir.x < lvl.width && pos.y + pos.dir.y < lvl.height; 
  }
  

  function draw(lvl){
    var rows = lvl.height,
        cols = lvl.width;
   for(var i = 0; i < rows; i++){
      board.append("<div class='row'></div>");
      var $row = $(".row:last", board);
      for(var j = 0; j < cols; j++){
        $row.append("<div class='cell'></div>");
        var $cell = $(".cell:last", $row);
      }
    }
  }
  var lvl = LEVELS[0];
  draw(lvl);
  
  var player = BlockFactory.create(lvl.player.x, lvl.player.y, 'player');
  var enemy =  BlockFactory.create(lvl.enemy.x, lvl.enemy.y, 'enemy').conjuncte(player).start();

  var playerMoves = player.stream('playerMoves');
  var enemyMoves = enemy.stream("enemyMoves");
  
  var boxes = lvl.boxes.map(function(box){
    var box = BlockFactory.create(box.x, box.y, 'box');
    var boxMoves = box.stream("boxMoves" + box.id).filter(isNotBorder).filter(box.isNotTypeOf('box')).filter(box.isNotTypeOf('enemy')).listen(box.redraw);
    return box;
  });

  playerMoves.filter(isNotBorder).filter(player.isNotTypeOf('box')).listen(player.redraw);
  playerMoves.filter(player.isTypeOf('box')).filter(player.isNotNext('box')).filter(player.isNotNext('enemy')).filter(isNotNextBorder).listen(player.redraw);

  enemyMoves.filter(isNotBorder).filter(enemy.isNotTypeOf('box')).listen(enemy.redraw);

  var pushes = playerMoves.filter(player.isTypeOf('box')).listen(function(pos){
    var filtered = boxes.filter(function(box){
      return box.x == pos.x && box.y == pos.y;
    });
    var gbox = filtered[0];
    gbox.emit({
      type: "boxMoves" + gbox.id,
      x: gbox.x + pos.dir.x,
      y: gbox.y + pos.dir.y,
      dir: pos.dir 
    });
  })

  playerMoves.filter(player.isTypeOf('enemy')).listen(function(){
    alert("You loose!");
  });

  enemyMoves.filter(enemy.isTypeOf('player')).listen(function(){
    alert("You loose!");
    this.clear();
  });

  playerMoves.filter(enemy.isLockedBy('box')).listen(function(){
    alert("You win! Hooray!")
    enemy.clear();
  });

  // var playerLoses = playerMoves.filter(isTypeOf('enemy'));
  // var enemyWins = enemyMoves.filter(isTypeOf('player'));
  // var loses = playerLoses.and(enemyWins);
  // loses.listen(function(){
  //   alert("You loose!");
  // })
  


});
