describe('Security', function(){
		it('Overwriting', function(done){
			var obj = {listen: function foo(){}}
			function Constr(){}
			Constr.prototype.emit = function emit(){};

			var err = "", cerr = "";
			
			try{
				Warden.extend(obj);
			}catch(e){
				err = e;
			}

			try{
				Warden.extend(Constr);
			}catch(e){
				cerr = e;
			}


			expect(err).toEqual(new Error("Can't overwrite: foo of object"));
			expect(cerr).toEqual(new Error("Can't overwrite: emit of object"));			
			done();
		});

		it('Resolving conflict', function(done){
			var obj = {listen: function foo(){}}
			function Constr(){}
			Constr.prototype.emit = function emit(){};


			Warden.extend(obj, {names: {listen: 'lusten'}});
			Warden.extend(Constr, {names: {emit: 'emot'}});
			
			var f = new Constr();

			expect(typeof obj.lusten).toBe('function');
			expect(typeof f.emot).toBe('function');

			done();
		})
	});