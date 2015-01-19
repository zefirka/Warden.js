describe('Configuration', function(){
	function Pork(name){
		this.name = name;
	}

	Pork.prototype.greet = function(x){
		var self = this;
		return this.emit({
			type : 'greet',
			message : ['Hello!', x || 'My name is', self.name].join(' ') 
		});
	}
	
});