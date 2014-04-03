/**
 * View model binded to a DOM element tree by applying databinding.
 * 
 * @module Flickr
 * @requires app
 * @requires knockout
 * @requires flickrService
 * @requires jsonData
 * @requires jquery
 * @requires paginator
 */
define([ 'durandal/app', 'knockout', 'services/flickrService',
		'services/config', 'jquery', 'paginator' ], function(app, ko,
		flickrService, config, $, paginator) {

	var flickr = function() {

		var self = this;
		var totalImages = [];
		var totalPages = 0;
		var temp = 0;
		var configData = config.getData();
		var imagesToShow = configData['imagesToShow'];
		this.displayName = configData['flickrTitle'];
		this.searchText = ko.observable('');
		this.images = ko.observableArray([]);
		this.activate = activate;
		this.getPhotos = getPhotos;
		this.searchPhotos = searchPhotos;
		this.showDetails = showDetails;
		this.scrolled = scrolled;
		this.attached = attached;
		this.home = home;

		/**
		 * Call back function
		 */
		function activate() {
			// the router's activator calls this function and waits for
			// it to
			// complete before proceding
			if (this.images().length > 0) {
				return;
			}
			return getPhotos();

		}

		/**
		 * Call back function.
		 */
		function attached(view) {
			createOrUpdatePaginator(totalPages);
		}

		/**
		 * Click on home gets default images.
		 */
		function home() {
			self.searchText('');
			configData.page = 1;
			getPhotos();
		}

		/**
		 * Gets images by calling flickr API.
		 */
		function getPhotos() {
			return flickrService.getPhotos().then(function(response) {
				totalPages = response.photos['pages'];
				if (temp == 0) {
					temp = totalPages;
				} else {
					if (temp != totalPages) {
						createOrUpdatePaginator(totalPages);
						temp = totalPages;
					}
				}
				totalImages.splice(0, totalImages.length);
				totalImages.push(response.photos.photo);
				self.images(totalImages[0].splice(0, imagesToShow));
			});
		}
		/**
		 * Shows details of selected image.
		 * 
		 * @param item
		 *            Image selected
		 */
		function showDetails(item) {

			flickrService.showDetails(item).then(function(response) {
				response.viewUrl = 'views/photoDetail';
				app.showDialog(response);

			});
		}

		/**
		 * Search images based on user entered text.
		 */
		function searchPhotos() {
			flickrService.searchPhotos(self.searchText()).then(
					function(response) {
						// console.log(response.photos.photo);
						if (response.photos != undefined) {
							if (response.photos.photo.length > 0) {
								totalPages = response.photos['pages'];
								if (temp != totalPages) {
									createOrUpdatePaginator(totalPages);
									temp = totalPages;
								}
								totalImages.splice(0, totalImages.length);
								self.images.removeAll();
								totalImages.push(response.photos.photo);
								self.images(totalImages[0].splice(0,
										imagesToShow));
							}
						}
					});
		}

		/**
		 * Loads images when scrolled down to end.
		 * 
		 * @param data
		 *            Data event Event
		 */
		function scrolled(data, event) {
			event.preventDefault();
			var elem = event.target;
			if (elem.scrollTop >= (elem.scrollHeight - elem.offsetHeight)) {
				var imgs = totalImages[0].splice(0, 20);
				for (var index = 0; index < imgs.length; index++) {
					self.images.push(imgs[index]);
				}
			}

		}

		/**
		 * On pagination, loads images of selected page
		 * 
		 * @param event
		 *            Event
		 * @param originalEvent
		 *            originalEvent
		 * @param type
		 *            type
		 * @param pageNum
		 *            page number
		 */
		function onPageClick(event, originalEvent, type, pageNum) {
			event.preventDefault();
			configData.page = pageNum;
			if (self.searchText() != null && self.searchText() != "") {
				searchPhotos();
			} else {
				getPhotos();
			}
		}

		/**
		 * Creates or updates pagination controls
		 * 
		 * @param pages
		 *            Total pages
		 */
		function createOrUpdatePaginator(pages) {
			var options = {
				currentPage : 1,
				totalPages : pages,
				size : "large",
				onPageClicked : onPageClick,
				itemTexts : function(type, page, current) {
					switch (type) {
					case "first":
						return "First";
					case "prev":
						return "Previous";
					case "next":
						return "Next";
					case "last":
						return "Last";
					case "page":
						return page;
					}
				}
			};

			$('#pagination').bootstrapPaginator(options);
		}

	};
	return flickr;
});