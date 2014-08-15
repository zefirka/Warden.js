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
  socket.emit('greet', { 
    type: 'greet',
    hello: 'world' 
  });

  socket.on('response', function (data) {
    console.log(data);
  });

  setInterval(function(){
    socket.emit('transfer', {
      type: 'transfer',
      data : Math.random() * 1000
    });
  }, 1000);
  
});