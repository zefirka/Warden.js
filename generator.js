var Warden = require('warden.js'),
	fs = require('fs'),
	map = require('./static.js');

var _ = Warden.Utils;

function file(str){
	return fs.readFileSync("./templates/" + str + '.tpl', "utf8");
}

var html = file('common/html'),
	head = file('common/head');

for(var pagename in map.pages){
	var page = map.pages[pagename];
	var str;


	try{
		str = file(pagename);
	}catch(error){
		console.warn("File " + pagename + " not found.");
		page = map.defaults[page.type || 'singlepage'];
		try{
			str = file(page.src);
		}catch(e){
			console.warn("Cant find default file");
			str = " ";
		}		
		
	}


	/* Preparing head */
	var title = page.title || " ";
	var scripts = " ";
	if(page.scripts){
		scripts = page.scripts.map(function(src){
			return "<script src='/assets/js/"+src+".js' type='text/javascript'></script>"
		});
	}

	var styles = " ";
	if(page.styles){
		styles = page.styles.map(function(src){
			return "<link href='/assets/css/"+src+".css' rel='stylesheet' type='text/css'>"
		});	
	}

	var currentHead = _.interpolate(head, {
		title: title,
		scripts: scripts,
		styles : styles
	});


	/* Prepating content */
	if(page.dependencies){
		var interpolant = {};
		page.dependencies.forEach(function(src){
			try{
				interpolant[src] = file(src);
			}catch(error){
				console.warn("Dependency: " + src + " not found.");
				interpolant[src] = " ";
			}
		});
		str = _.interpolate(str, interpolant);
	}

	console.log(str);

	var result = _.interpolate(html, {
		head: currentHead,
		content: str
	});

	fs.writeFileSync(pagename + '.html', result)
}