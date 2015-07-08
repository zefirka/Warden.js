describe('Reactive Programming', function(){
	var runa, runb;

	var a = Warden.Stream(function(fire){
		runa = fire;
	});

	var b = Warden.Stream(function(fire){
		runb = fire;
	});
		
	
	it('-- type operating', function(done){
		var res = 0;

		var x = a.map(10).watch();
		var y = b.map(20).watch();


		runa(); runb();

		expect(+x).toBe(10);
		expect(+y).toBe(20);
		expect(x+y).toBe(30);
		done();
	});

	it('-- formula: (+)', function(done){
		var res = 0;

		var cell = Warden.Formula([a, b], function(a, b){
			return a + b;
		});

		runa(12); 

		expect(+cell).toBe(12);

		runb(10);

		expect(+cell).toBe(22);

		done();
	});

	it('-- formula: (from taken)', function(done){
		var res = 0;

		runa(0);
		runb(0);

		var cell = Warden.Formula([a, b], function(a, b){
			return a + b;
		});

		runa(12); 
		expect(+cell).toBe(12);


		runb(10);
		expect(+cell).toBe(22);	
		done();
	

		
	});

	it('-- formula: (bigger)', function(done){
		var a = Warden(0),
			b = Warden(1);

		var bigger = Warden.Formula([a, b], function(x, y){
			return x.value > y.value ? x.value : y.value;
		});

		
		expect(bigger.value).toBe(1);
		a.value = 10;
		expect(bigger.value).toBe(10);
		b.value = 9;
		expect(bigger.value).toBe(10);
		b.value = 91;
		expect(bigger.value).toBe(91);

		done();

	});


	it('-- formula: (bigger: object)', function(done){
		function Player(name, team, score){
			this.name = name;
			this.team = team;
			this.score = Warden(score || 0);
			this.score.$$context = this;
		}

		Player.prototype.setScore = function(sc) {
			this.score.value = sc;
		};

		var players = [
			new Player("Jane", 'E', 0),
			new Player("Doug", 'E', 0),
			new Player("Johny", 'E', 0),
			new Player("Joel", 'D', 0),
			new Player("Hanz", 'D', 0) ];


		function Team (players, name) {
			this.score = Warden.Formula(players.map(function (p) {
				return p.score;
			}), function() {
				return Warden.Utils.reduce(arguments, function(a, b){
					return a + b;
				});
			});
			this.name = name;
			this.score.$$context = this;
		}


		function takeTeam(teamName) {
			return new Team(Warden.Utils.filter(players, function(e){ 
				return e.team == teamName;
			}), teamName)	
		}

		var eTeam = takeTeam('E');
		var dTeam = takeTeam('D');

		var winnigScore = Warden.Formula([eTeam.score, dTeam.score], function (a, b) {
			return a > b ? { score : a.value, name : a.$$context.name } : { score : b.value, name : b.$$context.name };
		});

		var wteam = winnigScore.grep('.name').watch()
		var wscore = winnigScore.grep('.score').watch();

		players[0].setScore(10);

		expect(wteam.value).toBe('E');
		expect(wscore.value).toBe(10);

		players[1].setScore(20);

		expect(wteam.value).toBe('E');
		expect(wscore.value).toBe(30);

		players[4].setScore(120);

		expect(wteam.value).toBe('D');
		expect(wscore.value).toBe(120);

		done();
	});

});


