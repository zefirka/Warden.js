function title (str) {
	return "Warden.js : " + str;
}

var common = {
	title: title('Declarative Event-drive development'),
	singlepage: {
		src: 'single',
		dependencies: ['aside']
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
			dependencies: ['aside']
		},
		'documentation' : {
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
			title: title("Download")
		},
		'streams' : {},
		'away' : {},
		'buses' : {},
		'http' : {},
	}
}