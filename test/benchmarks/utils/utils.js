module.exports.square = function square(x){
	return x*x;
}

module.exports.random = function random(t){
	return function(){
		return Math.random() * t;
	}
}

module.exports.moreThan = function moreThan(x){
	return function(y){
		return y > x;
	}
}

module.exports.repeat = function repeat(x, f){
	while(x--){
		f(x);
	}
}

module.exports.mul = function mul(x){
	return function(y){
		return x*y;
	}
}


module.exports.floor = function mul(x){
	return x >> 0;
}

module.exports.sadd = function mul(x,y){
	return x + y;
}

