Warden = {}
Warden.version = "0.0.0";
Warden.toString = ->
	return Warden.stringify(Warden);

Warden.create = (fn, config) ->
	streams = {}
	callbacks = {}
	settings = {}

	settings.max = (config and config.max) or 128 # max handlers per event



	fn.prototype.emit = (ev) ->
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
		if fn.trigger
			fn.trigger(ev)

		return @

	if fn.on is undefined		
		fn.prototype.on = (ev, callback, config) ->
			#this particles should be destroyed at production
			if typeof ev isnt 'string'
				throw "Type Error: Wrong argument[1] in .on method. Expected string."
			if typeof callback isnt 'function'
				throw "Type Error: Wrong argument[2] in .on method. Expected function."

			if not callbacks[ev]?
				callbacks[ev] = []

			if callbacks[ev].length >= settings.max 
				throw "The maximum number (#{settings.max}) of handler for event [#{ev}] exceed."
			
			callbacks[ev].push {callback, config}
			return @

	fn.prototype.stream = (type, name) ->
		stream = Warden.stream(type, name)
		if not streams[type]?
			streams[type] = []
		streams[type].push stream

		return stream

	return fn

Warden.stream = (ev, name) ->
	class Bus
		constructor: (@process=[]) ->
			@taken = 0

		exec : (ev, cnt) ->
			self = this
			event = ev;
			event.timestamp = (new Date()).getTime();
			event.environment = 'Warden 0.0.0';
			for process in @process
				fn = process.fn
				switch process.type
					when 'm'
						if typeof fn is 'function'
							event = fn(event)
						else if typeof fn is 'string'
							if event[fn] isnt undefined
								event = event[fn]
						else
							event = fn
						self.mapped = true
					when 'f'
						if typeof fn is 'function' 
							if fn(event) is false
								return false
						else 
							if Boolean(fn) is false
								return false

			if(@limit and (@taken >= @limit))
				return false	
		
			@taken++
			@final.apply(cnt, [event])



	stream = 
		type : ev
		name : name
		config : []
		activeBus : []
	
	Bus.prototype.map = (fn) ->
		return new Bus(this.process.concat
			type : 'm'
			fn : fn
		)

	Bus.prototype.filter = (fn) ->
		return new Bus(this.process.concat 
			type : 'f'
			fn : fn
		)

	Bus.prototype.take = (limit, last) ->
		if(typeof limit == 'function') 
			return this.filter(limit) 
		else 
			newbus = new Bus(this.process)
			if last?
				console.log('slice')
			else
				this.limit = limit;
				newbus.limit = limit
			return newbus
			

	Bus.prototype.listen = (fn) ->
		this.final = fn;
		stream.activeBus.push this
		return this
	
	Bus.prototype.evaluate = (ev, cnt) ->
		stream.activeBus.map (bus) ->
			bus.exec(ev, cnt)
	
	return new Bus()


Warden.stringify = (json, delim, n) ->
	res = "{" + if delim then "\n" else " "
	if not n 
		n = 0

	if n > 2
		res = "[object]"
		return res;

	offset = ""
	i = 0
	while i++ <= n and delim
		offset += "\t"

	for key, val of json
		res += "#{offset}#{key}:"

		if typeof val is 'object'	
			res += Warden.stringify(val, delim, n+1) + if delim then ",\n" else ", "
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
	if(n>0)
		res += " }"
	else
		res += if delim then "\n}" else " }";
	return res;
	
@.Warden = Warden