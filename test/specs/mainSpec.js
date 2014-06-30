describe('Warden initializaion', function () {  
    it('Warden is loaded', function () {      
        expect(Warden).not.toBe(undefined);  
    });  

    it('Warden versioning is ready', function () {      
        expect(typeof Warden.version).toBe("string");  
    });  

    it('Warden.module is ready', function () {      
        expect(Warden.module).not.toBe(undefined);  
        expect(typeof Warden.module).toBe('function');
    });  
});  

describe("Warden.stringify() method", function() {
	var mocks = {
		mock1 : {
			x: 10,
			y: 20
		},
		mock2 : {
			x: 'tarantaika',
			u: 'fl',
			y: undefined
		},
		mock3 : {
			x: {
				tampla : '123',
				fofa : 12
			},
			y: 124
		},
		mock4 : {
			a : { b: { c: { d : {f : {g : {h : 20}}}}}}
		}
	};

	it("Simple 1 level JSON", function(){
		expect(Warden.stringify(mocks.mock1)).toBe("{ x:10, y:20 }");
	});
	it("Simple 1 level JSON (with delimeter)", function(){
		expect(Warden.stringify(mocks.mock1, true)).toBe("{\n\tx:10,\n\ty:20\n}");
	});
	it("Simple 1 level JSON (with string)", function(){
		expect(Warden.stringify(mocks.mock2)).toBe("{ x:'tarantaika', u:'fl', y:'undefined' }");
	});
	it("Simple 1 level JSON (with string and delimeter)", function(){
		expect(Warden.stringify(mocks.mock2, true)).toBe("{\n\tx:'tarantaika',\n\tu:'fl',\n\ty:'undefined'\n}");
	});
	it("Simple 2-level JSON", function(){
		expect(Warden.stringify(mocks.mock3)).toBe("{ x:{ tampla:'123', fofa:12 }, y:124 }");
	});
	it("Simple 2-level JSON (with delimeter)", function(){
		expect(Warden.stringify(mocks.mock3, true)).toBe("{\n\tx:{\n\t\ttampla:'123',\n\t\tfofa:12 },\n\ty:124\n}");
	});
	it("Simple deep JSON", function(){
		expect(Warden.stringify(mocks.mock4)).toBe("{ a:{ b:{ c:[object] } } }");
	});
});