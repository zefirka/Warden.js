function title (str) {
	return "Warden.js : " + str;
}

var common = {
	title: title('Declarative Event-drive development'),
	singlepage: {
		src: 'single'
	}
}


module.exports = {
	defaults: common,
	pages: {
		'index' : {
			title: common.title,
			scripts: ['main']
		},
		'demo' : {
			title: title("Demos"),
			scripts : ['demos'],
			dependencies: ["aside"]
		},
		'about' : {
			title: common.title,
		},
		'docs' : {
			title: title("Documentation"),
			dependencies: ['aside']
		},
		'pubsub' : {
			title : title('Pub/Sub usage'),
			dependencies : ['aside']
		},
		'dragndrop' : {
			title : title("Drag and Drop example"),
			dependencies: ['aside'],
			scripts: ['dnd'],
			styles: ['dnd']
		},
		'download' : {
			title: title("Download"),
		},
		'streams' : {
			title: title('Streams'),
			dependencies: ['aside']
		},
		'counter' : {
			title : title('Counter example'),
			scripts : ['counter'],
			styles : ['counter'],
			dependencies: ['aside']
		},
		'away' : {},
		'buses' : {},
		'http' : {
			title : title('HTTP example'),
			scripts : ['http'],
			styles : ['http'],
			dependencies: ['aside']	
		},
	}
}