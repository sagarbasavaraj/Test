/**
 * Root of the app.
 *
 * @module shell.
 * @requires router
 */
define([ 'plugins/router' ], function(router) {
	return {
		router : router,// Can be used in view to display navigation
		activate : function() {
			router.map([ {
				route : '',
				title : 'iGallery',
				moduleId : 'viewmodels/flickr',
				nav : false
			} ]).buildNavigationModel();

			return router.activate();
		}
	};
});