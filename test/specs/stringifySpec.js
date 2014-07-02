describe("Warden.stringify() method", function() {
	var mocks = {
		empty : {},
		integer : 123,
		floatn : 123.23213,
		bool : true,
		nil : null,
		undef : undefined,
		str : 'string',
		lambda : function(){ somethin(); },
		lambdaArg : function(args){ something(); },
		fun : function name(){ something(); },
		funArg : function name(args){ something(); },
		earr : [],
		arroearr :[[],[],[]],
		arrocom : [undefined, null, NaN],
		arrostr : ['item1', 'item2'],
		arroint : [1,2,4,5],
		arrofun : [function(){d();}, function(a){d();}, function name(){d();}, function name(args){d();}],
		arroobj : [{x:10}, {y:20, z:30}],
	

		simple : {
			mock1 : {
				x: 10,
				y: 20
			},
			mock1Ans0 : "{ x:10, y:20 }",
			mock1Ans1 : "{\n\tx: 10,\n\ty: 20\n}",

			mock2 : {
				x: 'text',
				u: 'text2',
				r: 12,
				y: undefined
			},
			mock2Ans0 : "{ x:'text', u:'text2', r:12, y: -  }",
			mock2Ans1 : "{\n\tx: 'text',\n\tu: 'text2',\n\tr: 12,\n\ty: - \n}",

			mock3 : {
				num: 12,
				nan : NaN,
				notdef : undefined,
				str : "string",
				bool : true,
				zero : 0,
				neg : -23
			},
			mock3Ans0 : "{ num:12, nan:NaN, notdef: - , str:'string', bool:true, zero:0, neg:-23 }",
			mock3Ans1 : "{\n\tnum: 12,\n\tnan: NaN,\n\tnotdef: - ,\n\tstr: 'string',\n\tbool: true,\n\tzero: 0,\n\tneg: -23\n}"
		},		

		withObjects : {
			mock1 : {
				a : [0,1,2],
				b : function(){
					this.name = "test";
				}
			},
			mock1Ans0 : "{ a:[0, 1, 2], b:function (){...} }",
			mock1Ans1 : "{\n\ta: [0, 1, 2],\n\tb: function (){...}\n}",

			mock2 : {
				a : [6, 2, 23],
				b : [0,1,2,3,4,5,6,7,8,9,0],
				c : function (args){
					alert("test");
				}
			},
			mock2Ans0 : "{ a:[6, 2, 23], b:[array], c:function (args){...} }",
			mock2Ans1 : "{\n\ta: [6, 2, 23],\n\tb: [array],\n\tc: function (args){...}\n}",

			mock3 :{
				a : function name(){
					doSome();
				},
				b : function name(args){
					doSome();
				},
				c : function name(arg1, arg2){
					dosome(); 
					var x = {
						//local
					}
				}
			},
			mock3Ans0 : "{ a:function name(){...}, b:function name(args){...}, c:function name(arg1, arg2){...} }",
			mock3Ans1 : "{\n\ta: function name(){...},\n\tb: function name(args){...},\n\tc: function name(arg1, arg2){...}\n}",

			mock4 : {
				a : [null, [0,1,2], undefined],	
				b : [[],[],[]],
				c : [{x:10, y:20}, [NaN]],
				d : ['txt', '.pdf']
			},
			mock4Ans0 : "{ a:[null, [0, 1, 2],  - ], b:[[], [], []], c:[{ x:10, y:20 }, [NaN]], d:['txt', '.pdf'] }",
			mock4Ans1 : "{\n\ta: [null, [0, 1, 2],  - ],\n\tb: [[], [], []],\n\tc: [{ x:10, y:20 }, [NaN]],\n\td: ['txt', '.pdf']\n}",
		},

		inserted : {
			mock1 : {
				x: {
					a : '123',
					b : [1,2,3]
				},
				y: 124
			},
			mock1Ans0 : "{ x:{ a:'123', b:[1, 2, 3] }, y:124 }",
			mock1Ans1 : "{\n\tx : {\n\t\ta: '123',\n\t\tb: [1, 2, 3,]\n\t},\n\ty: 124\n}"
		}
	}



	describe("Simple types and objects", function() {
		var t = mocks;

		it("Empty object", function(){
			expect(Warden.stringify(t.empty)).toBe("{}");
		});

		it("Integer", function(){
			expect(Warden.stringify(t.integer)).toBe("123");
		});

		it("Float", function(){
			expect(Warden.stringify(t.floatn)).toBe("123.23213");
		});

		it("Boolean", function(){
			expect(Warden.stringify(t.bool)).toBe('true');
		});
		it("NULL", function(){
			expect(Warden.stringify(t.nil)).toBe('null');
		});
		it("undefined", function(){
			expect(Warden.stringify(t.undef)).toBe(' - ');
		});
		it("String", function(){
			expect(Warden.stringify(t.str)).toBe("'string'");
		});
		it("Functions", function(){
			expect(Warden.stringify(t.lambda)).toBe("function (){...}");
			expect(Warden.stringify(t.lambdaArg)).toBe("function (args){...}");
			expect(Warden.stringify(t.fun)).toBe("function name(){...}");
			expect(Warden.stringify(t.funArg)).toBe("function name(args){...}");
		});
		it("Arrays", function(){
			expect(Warden.stringify(t.earr)).toBe('[]');
			expect(Warden.stringify(t.arroearr)).toBe('[[], [], []]');
			expect(Warden.stringify(t.arrocom)).toBe('[ - , null, NaN]');
			expect(Warden.stringify(t.arroint)).toBe('[1, 2, 4, 5]');
			expect(Warden.stringify(t.arrofun)).toBe('[function (){...}, function (a){...}, function name(){...}, function name(args){...}]');
			expect(Warden.stringify(t.arrostr)).toBe("['item1', 'item2']");
			expect(Warden.stringify(t.arroobj)).toBe("[{ x:10 }, { y:20, z:30 }]");
			
		});
	});

	describe("First level simple objects (as keys)", function() {
		var s = mocks.simple;

		it("Only numbers", function(){
			expect(Warden.stringify(s.mock1)).toBe(s.mock1Ans0);
		});

		it("Only numbers (delimeter)", function(){
			expect(Warden.stringify(s.mock1, 1)).toBe(s.mock1Ans1);
		});

		it("Numbers, strings, undefined", function(){
			expect(Warden.stringify(s.mock2)).toBe(s.mock2Ans0);
		});

		it("Numbers, strings, undefined (delimeter)", function(){
			expect(Warden.stringify(s.mock2, 1)).toBe(s.mock2Ans1);
		});

		it("All simple types", function(){
			expect(Warden.stringify(s.mock3)).toBe(s.mock3Ans0);
		});

		it("All simple types (delimeter)", function(){
			expect(Warden.stringify(s.mock3, 1)).toBe(s.mock3Ans1);
		});
	});	


	describe("First level simple objects", function() {
		var s = mocks.withObjects;

		it("Arrays and functions", function(){
			expect(Warden.stringify(s.mock1)).toBe(s.mock1Ans0);
		});

		it("Arrays and functions (delimeter)", function(){
			expect(Warden.stringify(s.mock1, 1)).toBe(s.mock1Ans1);
		});

		it("Long array and function with 1 argument", function(){
			expect(Warden.stringify(s.mock2)).toBe(s.mock2Ans0);
		});

		it("Long array and function with 1 argument (delimeter)", function(){
			expect(Warden.stringify(s.mock2, 1)).toBe(s.mock2Ans1);
		});

		it("Named functions", function(){
			expect(Warden.stringify(s.mock3)).toBe(s.mock3Ans0);
		});

		it("Named functions (delimeter)", function(){
			expect(Warden.stringify(s.mock3, 1)).toBe(s.mock3Ans1);
		});
	});

	describe("First level complex objects", function() {
		var s = mocks.withObjects; 
		
		it("Complex objectts and types", function(){
			expect(Warden.stringify(s.mock4)).toBe(s.mock4Ans0);
		});

		it("Complex objectts and types (delimeter)", function(){
			expect(Warden.stringify(s.mock4, 1)).toBe(s.mock4Ans1);
		});
	});
	
	describe("Inserted objects", function() { 
		var s = mocks.inserted;
		
		it("Second level", function(){
			expect(Warden.stringify(s.mock1)).toBe(s.mock1Ans0);
		});

		it("Second level (delimeter)", function(){
			expect(Warden.stringify(s.mock1, 1)).toBe(s.mock1Ans1);
		});
	})
	
});