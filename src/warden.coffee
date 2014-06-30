class Stream 
	constructor : (@type) ->

class EventStream extends Stream
	

Warden = {}

Warden.createStream = (type) ->
	return new EventStream(type)

Warden.module = (fn) ->
	class Emitter
		streams = {}
		callbacks = {}

		constructor : () ->
			fn.apply(@, arguments)

		emit: (ev) ->
			self = @

			if streams[ev.type]?
				streams[ev.type].map((i)->
					i.evaluate(ev, self)
				)
			if callbacks[ev.type]?
				callbacks[ev.type].map((item) ->
					context = (item.config and item.config.context) or self
					adj = item.config and item.config.adj
					item.callback.apply(context, [ev].concat(adj))
				)
			return @

		on: (ev, callback, config) ->
			c = callbacks[ev]
			if not callbacks[ev]?
				callbacks[ev] = []
			callbacks[ev].push {callback, config}
			return @

		stream: (type) ->
			stream = Warden.createStream(type)
			if streams[type]?
				streams[type] = []
			streams[type].push stream

			return stream

@.Warden = Warden

Warden.version = "0.0.0";

Warden.stringify = (json, delim, n) ->
	res = "{" + if delim then "\n" else " "
	if not n 
		n = 0

	if n > 3
		res = "[object]"

	for key, val of json

		offset = ""
		i = 0
		while i++ <= n and delim
			offset += "\t"
		res += "#{offset}#{key}:"

		if typeof val is 'object'	
			res += stringify(val, delim, n+1) + if delim then ",\n" else ", "
		else
			if val
				if(typeof val is 'string')
					if delim
						res += "'#{val.toString()}',\n"
					else
						res += "'#{val.toString()}', "
				else
					if delim
						res += "#{val.toString()},\n"
					else
						res += "#{val.toString()}, "
			else 
				res += "'undefined'" + if delim then ",\n" else ", "
	res = res.slice(0, -2)
	res += if delim then "\n}" else " }";
	return res;
	


###
var Workflow = (function(){
		var _private = {};
	
		function Workflow(){
			this.system = {
				taken : 0,
				mapped : false,
				filtered : false,
				reduced : false
			};
			this.events = [];
			this.process = [];
			this.history = ['Workflow'];
		}

		Workflow.prototype.getHistory = function() {
			return this.history.join("\n");
		};
		Workflow.prototype.stack = function(e) {
			this.process.push({
				type: e.type,
				fn : e.fn,
				prop : e.prop,
				initial : e.initial
			});
			this.history.push(e.handle);
		};
		Workflow.prototype.setup = function(e) {
			for(var i in e){
				this.system[i] = e[i];
			}
		};

		return Workflow
	})();

	var Stream = (function(){
		function Stream(eventType){
			var Workflows = [];

			var flow = new Workflow();
			flow.stack({handle: "Stream: " + eventType + "\n"});
			
				
			var self = {
				type : eventType,
				flow : Object.create(flow)
			};			
			
			
			self.getEventPresent = function(n, c){
				return "[" + Workflows[n || 0].events.map(function(e){
					return flipster(e);
				}).join(c || ' ,') + "]"
			}		

			self.getWorkFlow = function(n){
				return this.flow.getHistory();
			}

			self.destroy = function(){
				self = {};
				return self;
			}

			self.include = function(prop, comment){
				if(!(prop in flow.system)){
					throw new Error("You cant include non-allowed system variables");
				}
				flow.stack({
					type : 'i', 
					prop : prop,
					handle : ".include: [" + (comment ? prop + " : " + comment : prop) + "]"
				});
				var res = Object.create(self);
				res.flow = Object.create(flow);
				return res;
			};

			self.map = function(fn, comment){
				flow.stack({
					type : 'm', 
					fn : fn,
					handle : ".map: " + (comment ? comment : fn.toString())
				});
				var res = Object.create(self);
				res.flow = Object.create(flow);
				return res;
			};

			self.filter = function(fn, comment){
				flow.stack({
					type : 'f', 
					fn : fn,
					handle : ".filter: " + (comment ? comment : fn.toString() )
				});
				var res = Object.create(self);
				res.flow = Object.create(flow);
				return res;
			};

			self.reduce = function(initial, fn, comment){
				flow.stack({
					type : 'r',
					fn : fn,
					initial : initial,
					handle : '.reduce: ' + (comment ? comment : fn.toString() )
				});
				var res = Object.create(self);
				res.flow = Object.create(flow);
				return res;
			};

			self.once = function(comment) {
				return this.take(1, "called from once() method " + (comment ? comment : ''));				
			};

			//take only n count events
			self.take = function(count, comment) {
				flow.setup({
					fixedTaken : flow.system.taken,
					takeLimit : count
				});
				
				flow.stack({handle : ".take [" + (comment ? comment : count.toString()) + "]"});
				var res = Object.create(self);
				res.flow = Object.create(flow);
				return res;
			};

			self.exec = function(fn, comment) {
				flow.setup({listening : true});
				flow.stack({handle : "\nHandler: " + (comment ? comment : fn.toString()) });
				flow.setup({callback : fn});
				
				var res = Object.create(self);
				res.flow = Object.create(flow);

				Workflows.push(flow);
				flow = new Workflow();
				flow.stack({handle: "Stream: " + self.type + "\n"});
				self.flow = flow;

				return res;			
			};

			self.execute = function(event, context){
				Workflows.map(function(f){
					if(!f.system.listening){
						return false;
					}

					event.timestamp = (new Date()). getTime();
					event.typescript = 'Warden Event';
					event.calee = arguments.calee;
					event.caller = arguments.caller;		


					if(f.process.length){
						for(var i = 0; i < f.process.length; i++){
							var process = f.process[i];
							
							//если фильтр
							if(process.type === 'f'){
								if(!process.fn(event)){
									return false
								}
							}else
							//если map
							if(process.type === 'm'){
								f.system.mapped = true;
								event = process.fn(event);
							}else
							//если include
							if(process.type === 'i'){
								event[process.prop] = f.system[process.prop];
							}else
							//если reduce
							if(process.type === 'r'){
								event = process.fn(f.events[f.events.length - 1] || process.initial, event);
							}
						}
					}
					
					f.events.push(event);

					if(f.system.takeLimit && (f.system.taken - f.system.fixedTaken >= f.system.takeLimit)){
						f.system.listening = false;
						return false;
					}

					f.system.callback.apply(context, [event]);
					f.system.executed = true;
					f.system.taken++;	
				});								
			}

			return self;
		}

		return Stream
	})();

	var Warden = (function(){ //класс для общей функциональности
		var Streams = {};

		function Warden(){}

		Warden.prototype.emit = function(event){
			var self = this;
			if(Streams[event.type]){	
				Streams[event.type].map(function(i){ 
					return i.execute(event, self); 
				});
			}
		}

		Warden.prototype.stream = function(eventType) {
			var stream = Stream(eventType);
			if(Streams[eventType]){
				Streams[eventType].push(stream);
			}else{
				Streams[eventType] = [stream];
			}

			return stream;
		};

		return Warden
	})();


	function WardenGen(obj) {
		obj.prototype = new Warden();
		return obj;
	}

	root.Warden = WardenGen;
})(this);
###