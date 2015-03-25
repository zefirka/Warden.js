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
			dependencies : ['aside'],
			active : 'demo'
		},
		'dragndrop' : {
			title : title("Drag and Drop example"),
			dependencies: ['aside'],
			scripts: ['dnd'],
			styles: ['dnd'],
			active : 'demo'
		},
		'download' : {
			title: title("Download"),
		},
		'streams' : {
			title: title('Streams'),
			scripts: ['streams'],
			styles: ['streams'],
			dependencies: ['aside'],
			active : 'demo'
		},
		'counter' : {
			title : title('Counter example'),
			scripts : ['counter'],
			styles : ['counter'],
			dependencies: ['aside'],
			active : 'demo'
		},
		'away' : {},
		'buses' : {},
		'http' : {
			title : title('HTTP example'),
			scripts : ['http'],
			styles : ['http'],
			dependencies: ['aside'],
			active : 'demo'
		},
	}
}