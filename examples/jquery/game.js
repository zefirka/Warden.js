var LEVELS = [
  {
    width: 12,
    height: 16,
    player: {x:1, y:1},
    enemy: {x:10, y:10},
    elephants : [
      {x: 1, y:3},
      {x:10, y:8},
      {x:0, y:12}
    ],
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
  
  Block.prototype.remove = function(type){
    this.getCell().removeClass(type);
  }

  Block.prototype.isTypeOf = function(type){
    return function(pos){
      return $($('.cell', $($(".row")[pos.y]))[pos.x]).hasClass(type);
    }
  };
  
  Block.prototype.isNotNext = function(type){    
    return function(pos){
      if(typeof type === 'string'){
        return !($($('.cell', $($(".row")[pos.y+pos.dir.y]))[pos.x+pos.dir.x]).hasClass(type));
      }else{
        return type.every(function(t){
            return !($($('.cell', $($(".row")[pos.y+pos.dir.y]))[pos.x+pos.dir.x]).hasClass(t));
        });
      }
    }
  };

  Block.prototype.isNotTypeOf = function(type) {
    return function(pos){
      if(typeof type === 'string'){
        return !($($('.cell', $($(".row")[pos.y]))[pos.x]).hasClass(type));
      }else{
        return type.every(function(t){
            return !($($('.cell', $($(".row")[pos.y]))[pos.x]).hasClass(t));
        });
      }
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
      this.config[type] && this.config[type](object);
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
            type: 'moved',
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
            var dir_new = object.getSurroundingCells();
            var divx = pPos.x - ePos.x;
            var divy = pPos.y - ePos.y;
            var dir = {
              x : dir_new.x,
              y : dir_new.y
            }
            object.emit({
              type : "moved",
                x : dir_new.x,
                y : dir_new.y
            });

          },500)

          object.clear = function(){
            clearInterval(interval);
          }
        
          return object;
        }       
         object.checkedCells = [];
        object.cell = function(x,y){
              return $($('.cell', $($(".row")[y]))[x]);
        };
        object.foundYou = 0;
        object.needSteps = 0;
        object.getSurroundingCells = function(obj,cellsToCheck) {
            var start = 0;
            if(!cellsToCheck) {
               object.checkedCells = [];
               var cellsToCheck = [];
               cellsToCheck.push({x: object.x, y: object.y});
               var c_temp = $($('.cell', $($(".row"))));
               c_temp.removeClass('path');
               object.foundYou = 0;
               object.needSteps = 0;
            }
            if(object.foundYou == 1) return;
            object.needSteps++;
            for(var i = 0; i < object.checkedCells.length; i++)
            {
                if(object.cell(object.checkedCells[i].x, object.checkedCells[i].y).hasClass('player'))    
                {
                    return object.drawPaths(object.checkedCells[i]);
                    object.foundYou = 1;
                    return;
                }
            }
              var toCheck = [];
            for(var i = 0; i < cellsToCheck.length; i++)
            {
            var pos = {
              x: cellsToCheck[i].x,
              y: cellsToCheck[i].y
            };
           // debugger;
               var cells = [
                   {cell : object.cell(pos.x+1, pos.y), position: {x: pos.x+1, y: pos.y}},
                   {cell : object.cell(pos.x+1, pos.y+1), position: {x: pos.x+1, y: pos.y+1}},
                   {cell : object.cell(pos.x, pos.y+1), position: {x: pos.x, y: pos.y+1}},
                   {cell : object.cell(pos.x-1, pos.y), position: {x: pos.x-1, y: pos.y}},
                   {cell : object.cell(pos.x-1, pos.y-1), position: {x: pos.x-1, y: pos.y-1}},
                   {cell : object.cell(pos.x, pos.y-1), position: {x: pos.x, y: pos.y-1}},
                   {cell : object.cell(pos.x+1, pos.y-1), position: {x: pos.x+1, y: pos.y-1}},
                   {cell : object.cell(pos.x-1, pos.y+1), position: {x: pos.x-1, y: pos.y+1}},
            ];
            cells = cells.filter(function(arg) {
                   if(arg.cell.length == 0 || arg.cell.hasClass('box') || arg.cell.hasClass('enemy') ) return false;
                   for(var m = 0; m < object.checkedCells.length; m++)
                   {
                    if(object.checkedCells[m].x == arg.position.x && object.checkedCells[m].y == arg.position.y)
                    {
                        return false;
                    }
                   }
                   return true;
                   });
          
            for(var k in cells)
                   {
                      toCheck.push({x: 
                                    cells[k].position.x, 
                                    y: cells[k].position.y, 
                                    parentCell: 
                                     cellsToCheck[i]
                                        });
                      object.checkedCells.push({x: cells[k].position.x, 
                                                y:  cells[k].position.y,
                                                parentCell: 
                                                    cellsToCheck[i]
                                                    });
                   }
            // object.checkedCells.push({x: cellsToCheck[i].x, y: cellsToCheck[i].y});
            }
            return object.getSurroundingCells(this,toCheck);
                
                  
     

        }
        object.drawPaths = function(endPoint) {
            var cells = []
            var nextCell;
            while(endPoint.parentCell)
            {
                    if(endPoint.parentCell.x == object.x && endPoint.parentCell.y == object.y)
                    {
                        return({x: endPoint.x, y: endPoint.y});
                    }
                   cells.push(object.cell(endPoint.x,endPoint.y));
                    endPoint = endPoint.parentCell;
            }
                
            cells.forEach(function(i)  {
                   i.addClass('path');
            });
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
              object.cell(pos.x+1, pos.y),
              object.cell(pos.x+1, pos.y+1),
              object.cell(pos.x, pos.y+1),
              object.cell(pos.x-1, pos.y),
              object.cell(pos.x-1, pos.y-1),
              object.cell(pos.x, pos.y-1),
              object.cell(pos.x+1, pos.y-1),
              object.cell(pos.x-1, pos.y+1),
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
      elephant: function(object){
        object.start = function(){
          var interval = setInterval(function(){
            var xAxis = (Math.random()*3 >> 0) - 1;
            var dir = {
              y: xAxis,
              x: xAxis ? 0 : (Math.random()*3 >> 0) - 1
            }
            object.emit({
              type : "moved",
              x : object.x + dir.x,
              y : object.y + dir.y,
              dir: dir
            });

          },500)

          object.clear = function(){
            clearInterval(interval);
          }
        
          return object;
        }       
        
        object.destroy = function(){
          this.clear();
          this.remove('elephant');
          delete this.x;
          delete this.y;
        };          
              
        return object;
      }
    }
  }
})();
   
              
$(function(){
  var h1 = $("h1");
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
              
  function pushBox(pos){
    var filtered = boxes.filter(function(box){
      return box.x == pos.x && box.y == pos.y;
    });
    var gbox = filtered[0];
    gbox.emit({
      type: "moved",
      x: gbox.x + pos.dir.x,
      y: gbox.y + pos.dir.y,
      dir: pos.dir 
    });
  }
          
  function killElephant(pos){
    console.log("Elepahnt killed");
    elephants.filter(function(box){
      return box.x == pos.x && box.y == pos.y;
    })[0].destroy()
  };
              
  var lvl = LEVELS[0];
  draw(lvl);
  
  var player = BlockFactory.create(lvl.player.x, lvl.player.y, 'player');
  var enemy =  BlockFactory.create(lvl.enemy.x, lvl.enemy.y, 'enemy').conjuncte(player).start();

  var playerMoves = player.stream('moved');
  var enemyMoves = enemy.stream("moved");
  
  var boxes = lvl.boxes.map(function(box){
    var box = BlockFactory.create(box.x, box.y, 'box');
    var boxMoves = box.stream("moved")
    boxMoves
      .filter(isNotBorder)
      .filter(box.isNotTypeOf(['box','enemy','elephant']))
      .listen(box.redraw);
    return box;
  });
  
  var elephants = lvl.elephants.map(function(el){
    var el = BlockFactory.create(el.x, el.y, 'elephant');
    var elMoves = el.stream("moved");
    elMoves
      .filter(isNotBorder)
      .filter(el.isNotTypeOf(['player', 'enemy']))
      .listen(el.redraw);                
    
    var pushes = elMoves
      .filter(el.isTypeOf('box'))
      .filter(el.isNotNext('box'))
      .listen(pushBox);
    
    
    el.start();
    return el;
  });
            
  
  var redraws = [ 
    playerMoves
      .filter(isNotBorder)
      .filter(player.isNotTypeOf(['box','elephant']))
      .listen(player.redraw),
    playerMoves
      .filter(player.isTypeOf('box'))
      .filter(player.isNotNext(['box','enemy','elephant']))
      .filter(isNotNextBorder)
      .listen(player.redraw)
  ];
  
  enemyMoves
    .filter(enemy.isTypeOf('elephant'))
    .listen(killElephant);
          
  enemyMoves
    .filter(isNotBorder)
    .filter(enemy.isNotTypeOf('box'))
    .listen(enemy.redraw);

  var pushes = playerMoves.filter(player.isTypeOf('box')).listen(pushBox);
  
  var loses = playerMoves.filter(player.isTypeOf('enemy')).merge(enemyMoves.filter(enemy.isTypeOf('player'))).listen(function(){
      alert('You loose');
      playerMoves.lock();
      redraws.forEach(function(r){
        r.lock();
      })
      enemy.clear();
  });
  

  playerMoves.filter(enemy.isLockedBy('box')).listen(function(){
    alert("You win! Hooray!")
    enemy.clear();
  });

});