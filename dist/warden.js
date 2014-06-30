(function() {
  var EventBus, EventStream, Stream, Warden,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventBus = (function() {
    function EventBus(type) {
      this.type = type;
    }

    return EventBus;

  })();

  Stream = (function() {
    function Stream(type, name) {
      this.type = type;
      this.name = name;
      this.events = [];
      this.bus = new EventBus(this.type);
    }

    Stream.prototype.evaluate = function(ev, cnt) {
      if (!this.bus.listening) {
        console.log("" + this.name + " stream is not listening by any Bus");
        return false;
      }
    };

    return Stream;

  })();

  EventStream = (function(_super) {
    __extends(EventStream, _super);

    function EventStream() {
      return EventStream.__super__.constructor.apply(this, arguments);
    }

    return EventStream;

  })(Stream);

  Warden = {};

  Warden.version = "0.0.0";

  Warden.createStream = function(type, name) {
    return new EventStream(type, name);
  };

  Warden.module = function(fn) {
    var Emitter;
    return Emitter = (function() {
      var callbacks, streams;

      streams = {};

      callbacks = {};

      function Emitter() {
        fn.apply(this, arguments);
      }

      Emitter.prototype.emit = function(ev) {
        var self;
        self = this;
        if (streams[ev.type] != null) {
          streams[ev.type].map(function(i) {
            return i.evaluate(ev, self);
          });
        }
        if (callbacks[ev.type] != null) {
          callbacks[ev.type].map(function(item) {
            var adj, context;
            context = (item.config && item.config.context) || self;
            adj = item.config && item.config.adj;
            return item.callback.apply(context, [ev].concat(adj));
          });
        }
        return this;
      };

      Emitter.prototype.on = function(ev, callback, config) {
        var c;
        c = callbacks[ev];
        if (callbacks[ev] == null) {
          callbacks[ev] = [];
        }
        callbacks[ev].push({
          callback: callback,
          config: config
        });
        return this;
      };

      Emitter.prototype.stream = function(type, name) {
        var stream;
        stream = Warden.createStream(type, name);
        if (streams[type] == null) {
          streams[type] = [];
        }
        streams[type].push(stream);
        return stream;
      };

      return Emitter;

    })();
  };

  Warden.stringify = function(json, delim, n) {
    var i, key, offset, res, val;
    res = "{" + (delim ? "\n" : " ");
    if (!n) {
      n = 0;
    }
    if (n > 2) {
      res = "[object]";
      return res;
    }
    offset = "";
    i = 0;
    while (i++ <= n && delim) {
      offset += "\t";
    }
    for (key in json) {
      val = json[key];
      res += "" + offset + key + ":";
      if (typeof val === 'object') {
        res += Warden.stringify(val, delim, n + 1) + (delim ? ",\n" : ", ");
      } else {
        if (val) {
          if (typeof val === 'string') {
            if (delim) {
              res += "'" + (val.toString()) + "',\n";
            } else {
              res += "'" + (val.toString()) + "', ";
            }
          } else {
            if (delim) {
              res += "" + (val.toString()) + ",\n";
            } else {
              res += "" + (val.toString()) + ", ";
            }
          }
        } else {
          res += "'undefined'" + (delim ? ",\n" : ", ");
        }
      }
    }
    res = res.slice(0, -2);
    if (n > 0) {
      res += " }";
    } else {
      res += delim ? "\n}" : " }";
    }
    return res;
  };

  this.Warden = Warden;


  /*
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
   */

}).call(this);
