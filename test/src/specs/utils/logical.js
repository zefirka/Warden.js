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

		
		it('$let: simple', function(){
			var cond = _let(function(x){
				return "abcedf".indexOf(x) >= 0;
			});

			expect(cond('a')).toBe(true);
			expect(cond('z')).toBe(false);

		});	

		it('$let: or', function(){
			var allowed = _let(is.str).or(is.num).or(is.bool);

			expect(allowed(num)).toBe(true);
			expect(allowed(str)).toBe(true);
			expect(allowed(bool)).toBe(true);
			expect(allowed(array)).toBe(false);
			expect(allowed(obj)).toBe(false);
		});


		it('$let: butNot', function(){
			var allowed = _let(is.truthy).butNot(is.str);

			expect(allowed(num)).toBe(true);
			expect(allowed(str)).toBe(false);
			expect(allowed(0)).toBe(false);
			expect(allowed(array)).toBe(true);
		});


		it('$let: and', function(){		
			var gt = function(a){
				return function(b){
					return a<b;
				}
			}

			var lt = function(a){
				return function(b){
					return a>b;
				}
			}

			var diapasone = function(a,b) {
				return _let(gt(a)).and(lt(b));
			}

			var range2to5 = diapasone(2,5);

			expect(range2to5(3)).toBe(true);
			expect(range2to5(2)).toBe(false);
			expect(range2to5(6)).toBe(false);
		});

	});