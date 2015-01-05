describe('Logical Chekings', function(){
		var _let = Utils.$let;

		it('Existance', function(){
			expect(is.exist(false)).toBe(true);
			expect(is.exist()).toBe(false);
			expect(is.exist(array[1])).toBe(false);
			expect(is.exist(null)).toBe(false);
			expect(is.exist(1)).toBe(true);
		});

		it('Truthiness', function(){
			expect(is.truthy(false)).toBe(false);
			expect(is.truthy()).toBe(false);
			expect(is.truthy(array[1])).toBe(false);
			expect(is.truthy(null)).toBe(false);
			expect(is.truthy(0)).toBe(false);
			expect(is.truthy(1)).toBe(true);
		});

		it('.not()', function(){
			var nexist = Utils.not(is.exist);
			expect(nexist(false)).toBe(false);
			expect(nexist()).toBe(true);
			expect(nexist(1)).toBe(false);
			expect(nexist(null)).toBe(true);
		});
	});