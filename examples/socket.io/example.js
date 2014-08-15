var socket = Warden.extend(io('http://localhost:1991'), {
	listener : 'on',
	emitter : 'emit'
});


socket.listen('greet', function(greet){
	console.log(greet);	
	socket.emit('response', {header: 'OK'})
});

var transferrd = socket.stream('transfer').map('data').listen(function(data){
	console.log("I've get:" + data);
	socket.emit('response', {mapped: data >> 0});
});