$(function () {
	Warden.extend($);

	function Line(obj){
		this.box = $('.box', obj);
		this.box.append("<a href='#' class='mute'>Mute</a>");
		this.muteBtn = $("a", this.box);
		this.title = $(".title", obj).html();
		this.id = obj.attr('id');		
	}
	Line.prototype.create = function(event){
		var i; 
		var width = this.box.parent().width() - 6;
		if(event.constructor.name === "Array"){
			event = "["+event.join(", ")+"]";
		}
		this.box.append("<i>"+event+"</i>");
		i = $("i", this.box);
		i = $(i[i.length-1]);
		i.animate({
			right: width
		}, {
			easing: "linear",
			duration : 5000, 
			complete: function(){
				i.fadeOut(100, function(){
					i.remove();
				});
			}
		});
	}

	var lc = $('.field.l').stream('click'), rc = $('.field.r').stream('click');

	var lines = {},
		buses = {
			originall : lc,
			originalr : rc,
			mapx : lc.map('clientX'),
			mapxfilter : lc.map('clientX').filter(function(x){
				return x > this.width()/2				
			;}).map('blue'),
			mapy : rc.map('y'),
			mapvalue : lc.map('Value'),
			skiptake : lc.skip(3).take(3).map('blue'),
			reducesum : lc.map('clientX').reduce(0, function(prev, cur){ return prev + cur}),
			debounce : rc.map('red').debounce(1000),
			getcollected : rc.map('clientY').getCollected(2000),
			unique : rc.map('clientY').unique(),
			mask : rc.mask("X:{{clientX}}, Y:{{clientY}}"),
			merge : rc.merge(lc),
			sync : lc.map(0).sync(rc.map(1)),
			wait : rc.map(0).waitFor(lc),
			combine : lc.map('timeStamp').combine(rc.map('timeStamp'), function(blue, red){
				return "B:" + blue + "\nR:" + red;
			})
		};

	$('.line').each(function(){
		var line = new Line($(this));
		var linet = lines[line.id] = line;
		var bus = buses[line.id].listen(function(event){
			line.create(event);
		});
		bus.locked = false;
		linet.muteBtn.click(function(e){
			e.preventDefault();
			linet.muteBtn.text(bus.locked ? 'Mute' : 'Unmute');
			bus[bus.locked ? 'unlock' : 'lock']();
			bus.locked = !bus.locked;
		});
	});

});