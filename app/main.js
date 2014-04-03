/**
 * Starting point of the app
 * 
 * @module main
 * @require system
 * @require app
 * @require viewLocator
 * @require config
 * @require jquery
 */

requirejs.config({
	paths : {
		'text' : '../lib/require/text',
		'durandal' : '../lib/durandal/js',
		'plugins' : '../lib/durandal/js/plugins',
		'transitions' : '../lib/durandal/js/transitions',
		'knockout' : '../lib/knockout/knockout-2.3.0',
		'bootstrap' : '../lib/bootstrap/js/bootstrap',
		'jquery' : '../lib/jquery/jquery-1.9.1',
		'paginator' : '../lib/bootstrap/js/bootstrap-paginator'
	},
	shim : {
		'bootstrap' : {
			deps : [ 'jquery' ],
			exports : 'jQuery'
		}
	}
});

define([ 'durandal/system', 'durandal/app', 'durandal/viewLocator',
		'services/config', 'jquery' ], function(system, app, viewLocator,
		config, $) {
	//>>excludeStart("build", true);
	system.debug(true);
	//>>excludeEnd("build");

	app.configurePlugins({
		router : true,
		dialog : true,
		widget : true
	});

	app.start().then(function() {
		//Replace 'viewmodels' in the moduleId with 'views' to locate the view.
		//Look for partial views in a 'views' folder in the root.
		viewLocator.useConvention();

		$.getJSON("app/json/config.json", function(data) {
			config.setData(data);
			var configData = config.getData();
			app.setRoot(configData['root'], configData['transition']);
		});

	});
});