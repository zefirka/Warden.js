describe('Utilities', function(){
	var Utils = Warden.Utils,
		is = Utils.is;

	var str = 'string',
		num = 10,
		obj = {x:20},
		array = [20],
		fn = function name(){},
		bool = true,
		nil = null,
		undef;

	describe('Datatype Checkings', function(){
			it('::string', function(){
				expect(is.str(str)).toBe(true);
				expect(is.num(str)).toBe(false);
				expect(is.bool(str)).toBe(false);
				expect(is.fn(str)).toBe(false);
				expect(is.array(str)).toBe(false);
				expect(is.obj(str)).toBe(false);
			});

			it('::number', function(){
				expect(is.str(num)).toBe(false);
				expect(is.num(num)).toBe(true);
				expect(is.bool(num)).toBe(false);
				expect(is.fn(num)).toBe(false);
				expect(is.array(num)).toBe(false);
				expect(is.obj(num)).toBe(false);
			});

			it('::boolean', function(){
				expect(is.str(bool)).toBe(false);
				expect(is.num(bool)).toBe(false);
				expect(is.bool(bool)).toBe(true);
				expect(is.fn(bool)).toBe(false);
				expect(is.array(bool)).toBe(false);
				expect(is.obj(bool)).toBe(false);
			});

			it('::function', function(){
				expect(is.str(fn)).toBe(false);
				expect(is.num(fn)).toBe(false);
				expect(is.bool(fn)).toBe(false);
				expect(is.fn(fn)).toBe(true);
				expect(is.array(fn)).toBe(false);
				expect(is.obj(fn)).toBe(false);
			});

			it('::array', function(){
				expect(is.str(array)).toBe(false);
				expect(is.num(array)).toBe(false);
				expect(is.bool(array)).toBe(false);
				expect(is.fn(array)).toBe(false);
				expect(is.array(array)).toBe(true);
				expect(is.obj(array)).toBe(false);
			});

			it('::object', function(){
				expect(is.str(obj)).toBe(false);
				expect(is.num(obj)).toBe(false);
				expect(is.bool(obj)).toBe(false);
				expect(is.fn(obj)).toBe(false);
				expect(is.array(obj)).toBe(false);
				expect(is.obj(obj)).toBe(true);
			});
		});

		describe('Datatype Checkings (NOT)', function(){
			it('::not.string', function(){
				expect(is.not.str(str)).toBe(false);
				expect(is.not.num(str)).toBe(true);
				expect(is.not.bool(str)).toBe(true);
				expect(is.not.fn(str)).toBe(true);
				expect(is.not.array(str)).toBe(true);
				expect(is.not.obj(str)).toBe(true);
			});

			it('::not.number', function(){
				expect(is.not.str(num)).toBe(true);
				expect(is.not.num(num)).toBe(false);
				expect(is.not.bool(num)).toBe(true);
				expect(is.not.fn(num)).toBe(true);
				expect(is.not.array(num)).toBe(true);
				expect(is.not.obj(num)).toBe(true);
			});

			it('::not.boolean', function(){
				expect(is.not.str(bool)).toBe(true);
				expect(is.not.num(bool)).toBe(true);
				expect(is.not.bool(bool)).toBe(false);
				expect(is.not.fn(bool)).toBe(true);
				expect(is.not.array(bool)).toBe(true);
				expect(is.not.obj(bool)).toBe(true);
			});

			it('::not.function', function(){
				expect(is.not.str(fn)).toBe(true);
				expect(is.not.num(fn)).toBe(true);
				expect(is.not.bool(fn)).toBe(true);
				expect(is.not.fn(fn)).toBe(false);
				expect(is.not.array(fn)).toBe(true);
				expect(is.not.obj(fn)).toBe(true);
			});

			it('::not.array', function(){
				expect(is.not.str(array)).toBe(true);
				expect(is.not.num(array)).toBe(true);
				expect(is.not.bool(array)).toBe(true);
				expect(is.not.fn(array)).toBe(true);
				expect(is.not.array(array)).toBe(false);
				expect(is.not.obj(array)).toBe(true);
			});

			it('::not.object', function(){
				expect(is.not.str(obj)).toBe(true);
				expect(is.not.num(obj)).toBe(true);
				expect(is.not.bool(obj)).toBe(true);
				expect(is.not.fn(obj)).toBe(true);
				expect(is.not.array(obj)).toBe(true);
				expect(is.not.obj(obj)).toBe(false);
			});
		});


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

});