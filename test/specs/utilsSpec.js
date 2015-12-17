const Warden = require('../../dist/warden.min.js');

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
	describe('Logical Chekings', function(){
			var _let = Utils.$let;
	
			it('Existance', function(){
				expect(is.exist(false)).toBe(true);
				expect(is.exist()).toBe(false);
				expect(is.exist(array[1])).toBe(false);
				expect(is.exist(null)).toBe(false);
				expect(is.exist(1)).toBe(true);
			});
	
			it('.not()', function(){
				var nexist = Utils.not(is.exist);
				expect(nexist(false)).toBe(false);
				expect(nexist()).toBe(true);
				expect(nexist(1)).toBe(false);
				expect(nexist(null)).toBe(true);
			});
		});

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

	describe('$hash', function(){
		it('$hash', function(){
			var hash = Utils.$hash, o = 20;

			expect(hash.set('chu')).toBe('1');
			expect(hash.set('chu')).toBe('2');
			expect(hash.set('chu')).toBe('3');
			expect(hash.get('chu')).toBe('3');

			while(o--){
				hash.set('goo')
			}

			expect(hash.get('goo')).toBe('14');

		});
	});

});

