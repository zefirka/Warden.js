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