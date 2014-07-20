function Stream = function(data){
  
};

function DataBus = function(route){
    this.route = route;
  }
  
DataBus.prototype.eval = function(){
  
}


Warden.makeStream = function(eventType, context){
  var streamMaxLength = 16;
  
  
  
  
}

function createStream(ev, options) {
    var config = {
      maxTakenLength : (options && options.maxTakenLength) || 64,
      maxHistoryLength : (options && options.maxHistoryLength) || 64,
      context : (options && options.context) || null
    };
    
    // Event bus class
    var Bus = (function() {
      function Bus(process) {
        this.process = process != null ? process : [];
        this._public = {
          skipped : 0,
          taken : 0,
          limit : 0,
          length : 0,
          ignore : 0
        };
        this.history = [];
        this.taken = [];
      }
          
      
      Bus.prototype.exec = function(ev, cnt) {     
        if(this.locked){
          return false;
        }        
        var self = this;
        var event = ev;        
        this._public.length++;
        
        event.timestamp = (new Date()).getTime();
        
        for(var i=0, l=this.process.length; i<l; i++){
          var process = this.process[i];
          var res = Processor[process.type].apply(this, [process, event]);
          if(res.busIsDeprecated){
            return false;
          }else{
            event = res;
          }
        };        

        if(this.history.length >= config.maxHistoryLength){
          this.history.shift(0);
        }
        this.history.push(ev); 
         
        // skipin by limit on top
        if (this._public.limit && (this._public.taken >= this._public.limit)) {
          return false;
        }

        // skipin by limit on bottom
        if(this._public.length <= this._public.ignore){
          this._public.skipped++;
          return false;
        }

        this._public.taken++;
        
        if(this.taken.length >= config.maxTakenLength){
          this.taken.shift(0)
        }
        this.taken.push(event); 

        if(this.connector){
          if(!this.connector.locked){
            this.connector.assign(event);
          }else{
            console.log('locked');
          }
        }else{
           this.finalCallback.apply(config.context || cnt, [event]);  
        }

        return this;        
      };
      
      Bus.prototype.toString = function(){
        return Warden.stringify(this.process);
      };

      Bus.prototype.map = function(fn){
        var newbus = new Bus(this.process.concat({
          type: 'm',
          fn: fn
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.filter = function(fn){
        var newbus =  new Bus(this.process.concat({
          type: 'f',
          fn: fn
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.include = function(prop){
          var newbus = new Bus(this.process.concat({
            type : 'i',
            fn : prop
          }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.reduce = function(start, fn) {
        var newbus = new Bus(this.process.concat({
          type : 'r',
          fn : fn,
          start : start
        }));
        newbus._public = this._public;
        return newbus;
      };

      Bus.prototype.take = function(limit, last){
        if(typeof limit === 'function'){
          return this.filter(limit);
        }else{
          var newbus = new Bus(this.process);
          if(last != null){
            if(typeof last == 'number'){ //need checj that last > limit
              return newbus.skip(limit).take(last-limit);
            }else{
              throw "Type Error: take method expect number at second argumner;";
            }
          }else{
            this.limit = limit;
            this._public.limit = limit;
            var pub = this._public;
            newbus._public = pub;
            newbus._public.limit = limit;
            newbus.limit = limit;
          }
          return newbus;
        }
      };
      
      Bus.prototype.skip = function(count){
        if(typeof count !== 'number'){
          throw "Type Error: skip method expect numbers;";
        }
        var newbus = new Bus(this.process);
        var pub = this._public;
        newbus._public = pub;
        newbus._public.ignore = count;
        this._public.ignore = count;
        return newbus;      
      };

      Bus.prototype.unique = function(prop) {
        var newbus = new Bus(this.process.concat({
          type : 'u',
          prop : prop
        }));
        newbus._public = this._public;
        return newbus;
      };
      
      Bus.prototype.lock = function(){
        this.locked = true;
      };
      
      Bus.prototype.unlock = function(){
        this.locked = false;
      };
          
      Bus.prototype.listen = function(fn){
        if(fn === 'log'){
          this.finalCallback = function(e){
            console.log(e);
          }
        }else{
          this.finalCallback = fn;  
        }        
        stream.activeBus.push(this);
        return this;
      };

      Bus.prototype.log = function(){
        return this.listen(function(e){
          console.log(e);
        });
      };
      
      Bus.prototype.evaluate = function(ev, cnt){
        return stream.activeBus.map(function(bus){
          return bus.exec(ev, cnt);
        });
      };
      
      Bus.prototype.merge = function(bus){

      }

      Bus.prototype.connect = function(item, propOrMethod) {
        var connector = new Connector(item, propOrMethod, this);
        this.connector = connector
        stream.activeBus.push(this);
        return this.connector
      };

      return Bus;
    })();
    
    var stream = {
      type: ev,
      activeBus: []
    };

    return new Bus();
  };