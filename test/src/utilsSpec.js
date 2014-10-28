describe('Utilities', function(){
	var Utils = Warden.Utils,
		is = Utils.is,
		Queue = Utils.Queue;

	var str = 'string',
		num = 10,
		obj = {x:20},
		array = [20],
		fn = function name(){},
		bool = true,
		nil = null,
		undef;

	include "utils/datatypes.js"
	include "utils/logical.js"	

	describe('Queue', function(){
		it('Queue', function(){
			var n = new Queue(),
				n3 = new Queue(3);

			expect(n.length).toBe(0);
			expect(n3.length).toBe(0);

			for(var i = 0; i<16; i++){
				n.push(i);
				n3.push(i);
			}
			
			expect(n.length).toBe(16);
			expect(n3.length).toBe(3);

			expect(n[15]).toBe(15);
			expect(n3[2]).toBe(15);

			n.push('zoo');
			n3.push('zoo');

			expect(n.length).toBe(16);
			expect(n3.length).toBe(3);

			expect(n.last()).toBe('zoo');
			expect(n3.last()).toBe('zoo');
	
		});
	});

});

