var socket = Warden.extend(io('http://localhost:1991'), {
	listener : 'on',
	emitter : 'emit'
});


$(function(){
	(function(){
		var x = $(".ng"), i =0;
		while(i++<1000){
			x.after(x[0].outerHTML);
		}
		$(".ng span").hide();
	})();
	var ngs = $(".ng");


	function draw(data){
		$('span', $(ngs[data.id])).css('top', 50 + (50 * data.velocity) )   .show();
	}

	var stream = socket.stream('sink')
	
	stream.listen(draw);


	$(".mapper").click(function(){
		var value = $("#dist").val()
		stream.lock();
		stream = stream.map(function(data){
			if(50 + (50 * data.velocity)  <= value){
				data.velocity = (value - 50) / 50;
			}
			return data;
		}).listen(draw)
	});

	$(".stepper").click(function(){
		var value = $("#step").val();
		socket.emit('step', {
			value : parseFloat(value)
		});
	})
	
});