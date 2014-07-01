(function() {
  var Warden;

  Warden = {};

  Warden.version = "0.0.0";

  Warden.toString = function() {
    return Warden.stringify(Warden);
  };

  Warden.create = function(fn, config) {
    var callbacks, settings, streams;
    streams = {};
    callbacks = {};
    settings = {};
    settings.max = (config && config.max) || 128;
    fn.prototype.emit = function(ev) {
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
      if (fn.trigger) {
        fn.trigger(ev);
      }
      return this;
    };
    if (fn.on === void 0) {
      fn.prototype.on = function(ev, callback, config) {
        if (typeof ev !== 'string') {
          throw "Type Error: Wrong argument[1] in .on method. Expected string.";
        }
        if (typeof callback !== 'function') {
          throw "Type Error: Wrong argument[2] in .on method. Expected function.";
        }
        if (callbacks[ev] == null) {
          callbacks[ev] = [];
        }
        if (callbacks[ev].length >= settings.max) {
          throw "The maximum number (" + settings.max + ") of handler for event [" + ev + "] exceed.";
        }
        callbacks[ev].push({
          callback: callback,
          config: config
        });
        return this;
      };
    }
    fn.prototype.stream = function(type, name) {
      var stream;
      stream = Warden.stream(type, name);
      if (streams[type] == null) {
        streams[type] = [];
      }
      streams[type].push(stream);
      return stream;
    };
    return fn;
  };

  Warden.stream = function(ev, name) {
    var Bus, stream;
    Bus = (function() {
      function Bus(process) {
        this.process = process != null ? process : [];
        this.taken = 0;
      }

      Bus.prototype.exec = function(ev, cnt) {
        var event, fn, process, self, _i, _len, _ref;
        self = this;
        event = ev;
        event.timestamp = (new Date()).getTime();
        event.environment = 'Warden 0.0.0';
        _ref = this.process;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          process = _ref[_i];
          fn = process.fn;
          switch (process.type) {
            case 'm':
              if (typeof fn === 'function') {
                event = fn(event);
              } else if (typeof fn === 'string') {
                if (event[fn] !== void 0) {
                  event = event[fn];
                }
              } else {
                event = fn;
              }
              self.mapped = true;
              break;
            case 'f':
              if (typeof fn === 'function') {
                if (fn(event) === false) {
                  return false;
                }
              } else {
                if (Boolean(fn) === false) {
                  return false;
                }
              }
          }
        }
        if (this.limit && (this.taken >= this.limit)) {
          return false;
        }
        this.taken++;
        return this.final.apply(cnt, [event]);
      };

      return Bus;

    })();
    stream = {
      type: ev,
      name: name,
      config: [],
      activeBus: []
    };
    Bus.prototype.map = function(fn) {
      return new Bus(this.process.concat({
        type: 'm',
        fn: fn
      }));
    };
    Bus.prototype.filter = function(fn) {
      return new Bus(this.process.concat({
        type: 'f',
        fn: fn
      }));
    };
    Bus.prototype.take = function(limit, last) {
      var newbus;
      if (typeof limit === 'function') {
        return this.filter(limit);
      } else {
        newbus = new Bus(this.process);
        if (last != null) {
          console.log('slice');
        } else {
          this.limit = limit;
          newbus.limit = limit;
        }
        return newbus;
      }
    };
    Bus.prototype.listen = function(fn) {
      this.final = fn;
      stream.activeBus.push(this);
      return this;
    };
    Bus.prototype.evaluate = function(ev, cnt) {
      return stream.activeBus.map(function(bus) {
        return bus.exec(ev, cnt);
      });
    };
    return new Bus();
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

}).call(this);
