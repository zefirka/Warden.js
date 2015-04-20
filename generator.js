var Warden = require('warden.js'),
	fs = require('fs'),
	map = require('./static.js');

var _ = Warden.Utils;

function file(str){
	return fs.readFileSync("./templates/" + str + '.tpl', "utf8");
}

var g_html = file('common/html'),
	g_head = file('common/head');


var common_data = {
	version : Warden.version,
	date : new Date(),
}
 
(function(){
	var stats = fs.statSync("assets/download/warden.min.js"),
		fileSizeInBytes = stats["size"],
		fileSizeInKB = fileSizeInBytes / 1024,
		statsGz = fs.statSync("assets/download/warden.gz"),
		fileSizeInBytesGz = statsGz["size"],
		fileSizeInKBGz = fileSizeInBytesGz / 1024;

	common_data.size_min = fileSizeInKB.toFixed(2);
	common_data.size_gz = fileSizeInKBGz.toFixed(2);
})();


for(var pagename in map.pages){
	var html = g_html,
		head = g_head;

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
			return "<script type='text/javascript' src='assets/js/"+src+".js'></script>"
		});
	}

	var styles = " ";
	if(page.styles){
		styles = page.styles.map(function(src){
			return "<link href='assets/css/"+src+".css' rel='stylesheet' type='text/css'>"
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

	if(page.active){
		html = _.interpolate(html, {
			active_tab: page.active
		});
	}

	var result = _.interpolate(html, {
		head: currentHead,
		content: str
	});

	result = _.interpolate(result, common_data)

	fs.writeFileSync(pagename + '.html', result)
}