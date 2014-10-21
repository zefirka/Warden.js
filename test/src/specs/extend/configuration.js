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

	it('Change defaults', function(done){
		Warden.configure.changeDefault({
			names: {
				emit: 'evat',
				unlisten: 'munlisten'
			},
			max: 2
		});

		var t = Warden.extend({

		});

		expect(typeof t.evat).toBe('function');
		expect(typeof t.munlisten).toBe('function');

		try{
			t.listen('foo', function(){});
			t.listen('foo', function(){});
			t.listen('foo', function(){});
		}catch(e){
			t.errmsg = e;
		}

		done();
	})

});