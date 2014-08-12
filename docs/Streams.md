Streams
=========

##Streams of events##
Потоки событий создаются из пользовательских событий или кастомных событий, созданных разработчиком, но так или иначе эмитированных напрямую либо через .emit(), либо косвенно, - через нативные триггеры. Это могут быть как DOM события, так и кастомные события извещающие о каких-то действиях в стандартно паттерне Pub/Sub

##Creating custom data streams##

Module at: 
	- `./src/module/Streams.js` : Streams module
	- `./src/module/DataBus.js` : DataBus module

Usage : 
	- `object.stream(type, [context])` - Create an event stream,
	- `Warden.makeStream(creator)` - Create custom data stream



###Usage###
####Extend objects with Warden.extend()###


