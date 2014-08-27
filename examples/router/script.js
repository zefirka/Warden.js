$(function() {

		var app = {};

	app.defaults = {
		home : 'home'
	}


	app.server = (function(){
		var ws = {
			model : {},
			view : {}
		};

		var success = {
				model: Warden.makeStream('', ws),
				view: Warden.makeStream('', ws),
			},
			error = {
				model: Warden.makeStream('', ws),
				view : Warden.makeStream('', ws)
			};

		ws.get = function(type){
			return function(options){
				if(!options.url){
					throw "No URL";
				}
				$.ajax($.extend(options, {
					type : 'get',
					success : success[type].eval,
					error : error[type].eval
				}));
			}

		}

		ws.model.success = success.model.get();
		ws.view.success = success.view.get();
		ws.model.error = error.model.get();
		ws.view.error = error.view.get();
		

		return ws;
	})();

	app.router = (function(){
		var rt = {},
			config = {},
			getModel = app.server.get('model'),
			getView = app.server.get('view');

		rt.config = function(obj){
			config = obj;
		}



		rt.routeTo = function(route){
			route = route.split('#'); 
			route = route[route.length-1]
			getModel({
				type : 'POST',
				dataType : 'GET',
				url : getUrl(route, 'model') + '.json'
			});

			getView({
				type : 'GET',
				dataType : 'HTML',
				url : getUrl(route, 'view') + "." + config.ext
			});
		}

		var server = app.server;

		server.model.error.listen(function(error){
			server.model.success.fire({
				user : 'dalhsd'
			})
		});

		server.view.error.listen(function(error){
			server.view.success.fire('{{user}} hello!');
		});

		server.view.success.sync(server.model.success).listen(function(x){
			var view = x[0],
				data = x[1];
			var regex = /{{\s*[\w\.]+\s*}}/g;
			$('[view').html(view.replace(regex, function(i){
      			return data[i.slice(2,-2)];
    		}));
		});

		function getUrl(route, type, prevent){
			var cons, from, param = '';
			if(route.indexOf('/')>=0){
				cons = route.split('/');
				if(cons.length>1){
					from = cons[0];
					param = cons[1];
				}
			}else{	
				from = route;
			}
			var match = config.when[from];

			if(!match){
				for(var i in config.when){
					if(config.when[i].split('/')[0] == from){
						match = config.when[i].split('/')[0];
					}
				}
			}

			match = match || getUrl(config.other, type, 1);
			if(prevent){
				return match + (param.length ? ('/' + param) : '');
			}
			return config[type] + '/' + match + (param.length ? ('/' + param) : '');
		}

		return rt;
	})();

	app.route = location.hash.length ? location.hash : app.defaults.home;

	app.router.config({
		ext : 'tpl',
		view : 'views',
		model : 'controllers',
		when: {
			'home' : 'index',
			'users/:name' : 'users/:name',
			'projects/:id' : 'projects/:id'
		},
		other: 'home'
	})

	$(window).on('hashchange', function(e) {
  		var hash = location.hash;
  		app.router.routeTo(hash);
	});

	app.router.routeTo(location.hash);

});