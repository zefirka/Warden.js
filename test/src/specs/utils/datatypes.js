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