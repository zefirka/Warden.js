describe("Warden.stringify() method", function() {
	var mocks = {
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
				a : ['str', 2, 23],
				b : [0,1,2,3,4,5,6,7,8,9,0],
				c : function (args){
					alert("test");
				}
			},
			mock2Ans0 : "{ a:[str, 2, 23], b:[array], c:function (args){...} }",
			mock2Ans1 : "{\n\ta: [str, 2, 23],\n\tb: [array],\n\tc: function (args){...}\n}",

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
		},

		mock3 : {
			d : [null, [0,1,2], undefined],
			x: {
				tampla : '123',
				fofa : '123'
			},
			y: 124
		},

		mock4 : {
			a : { b: { c: { d : {f : {g : {h : 20}}}}}}
		},
		mock5 : {
			a : 12,
			x : function(prop){
				console.log(prop)
			},
			y : function(){
				console.log("test")
			},
			d : "test"
		},
		mock6 : {
			c : function name(){
				something();
			},
			some : function name(args){
				something();
			},
			someer : function name(arg1, arg2){
				something();
			}
		},
		mock7 : {
			x : true,
			y : undefined,
			z : null,
			t : NaN,
			p : ['text', 0, 'text', undefined, null, NaN],
		},
		mock8 : {
			arr : [
				function(){ dosome(); }, 
				function(args){ dosome();}, 
				function(arg1, arg2) { dosome();},
				function name(){ dosome(); }, 
				function name (args){ dosome()},
				function name(arg1, arg2) { dosome();}
			]
		},
		mock9 : {
			arrexp : [
				function(){ 
					dosome(); 
				}, 
				function(args){ 
					dosome();
				}, 
				function(arg1, arg2) { 
					dosome();
				},
				function name(){ 
					dosome(); 
				}, 
				function name (args){ 
					dosome();
				},
				function name(arg1, arg2) { 
					dosome();
				}
			]
		}
	};

	describe("First level simple objects", function() {
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
	
	
	

	// it("Simple 2-level JSON", function(){
	// 	expect(Warden.stringify(mocks.mock3)).toBe("{ x:{ tampla:'123', fofa:12 }, y:124 }");
	// });
	// it("Simple 2-level JSON (with delimeter)", function(){
	// 	expect(Warden.stringify(mocks.mock3, true)).toBe("{\n\tx:{\n\t\ttampla:'123',\n\t\tfofa:12 },\n\ty:124\n}");
	// });
	// it("Simple deep JSON", function(){
	// 	expect(Warden.stringify(mocks.mock4)).toBe("{ a:{ b:{ c:[object] } } }");
	// });
});