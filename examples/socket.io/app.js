var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1991);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}



io.on('connection', function (socket) {
  socket.on('response', function (data) {
    console.log(data);
  });

  socket.on('step', function(data){
     sins = (function(){
        var step = data.value, bef = 0;
        var s = 400, r = [];
        while(s--){
          r.push(Math.sin(bef+=step));
        }
        return r;
      })();
  });  

  var step = 0,
      sins = (function(){
        var step = 0.05, bef = 0;
        var s = 400, r = [];
        while(s--){
          r.push(Math.sin(bef+=step));
        }
        return r;
      })();
  
  var timer = setInterval(function(){
    socket.emit('sink', {
      type: 'sink',
      velocity : sins[step],
      id : step
    });
    step++;
    if(step==400){
      step = 0;
    }
  }, 30);
  
});