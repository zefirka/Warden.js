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

describe("Warden helper functions", function() {
	var mocks = {
		mock1 : {
			x: 10,
			y: 20
		},
		mock2 : {
			x: 'tarantaika',
			u: 'fl',
			y: undefined
		}
	};

	it("Warden.stringify simple mock", function(){
		expect(Warden.stringify(mocks.mock1)).toBe("{ x:10, y:20 }");
	});
	it("Warden.stringify simple mock (with delimeter)", function(){
		expect(Warden.stringify(mocks.mock1, true)).toBe("{\n\tx:10,\n\ty:20\n}");
	});
	it("Warden.stringify simple mock (with string)", function(){
		expect(Warden.stringify(mocks.mock2)).toBe("{ x:'tarantaika', u:'fl', y:'undefined' }");
	});
	it("Warden.stringify simple mock (with string and delimeter)", function(){
		expect(Warden.stringify(mocks.mock2, true)).toBe("{\n\tx:'tarantaika',\n\tu:'fl',\n\ty:'undefined'\n}");
	});
});