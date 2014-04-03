/**
 * Flickr Service to call Flickr API and return the result.
 * 
 * @module Flickr
 * @requires http
 * @requires config
 */

define([ 'plugins/http', 'services/config' ], function(http, config) {

	var configData = config.getData();
	var key = configData['appKey'];
	var url = configData['url'];
	var user_id = configData['user_id'];

	return {
		getPhotos : getPhotos,
		showDetails : showDetails,
		searchPhotos : searchPhotos
	};

	/**
	 * Gets images from Flickr by calling flickr API
	 * 
	 * @returns promise
	 */
	function getPhotos() {
		return http.jsonp(url, {
			method : configData['flickrAPI']['getPublicPhotos'],
			api_key : key,
			user_id : user_id,
			page : configData['page'],
			per_page : configData['per_page'],
			format : configData['format']
		}, 'jsoncallback');
	}

	/**
	 * Gets details of image
	 * 
	 * @param item
	 *            Selected image.
	 * 
	 * @returns promise
	 */
	function showDetails(item) {
		return http.jsonp(url, {
			method : configData['flickrAPI']['getInfo'],
			api_key : key,
			photo_id : item.id,
			format : configData['format']
		}, 'jsoncallback');
	}

	/**
	 * Gets images that match the search text.
	 * 
	 * @param serachText
	 *            Search Text
	 * 
	 * @returns promise
	 */
	function searchPhotos(searchText) {
		return http.jsonp(url, {
			method : configData['flickrAPI']['search'],
			api_key : key,
			tags : searchText,
			page : configData['page'],
			per_page : configData['per_page'],
			format : configData['format']
		}, 'jsoncallback');
	}

});