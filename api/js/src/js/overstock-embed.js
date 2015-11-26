var ostk_developerId;
var ostk_api_url = 'https://cdn.rawgit.com/overstock/wp-affiliate-links/master/api/';
// var ostk_api_url = 'http://localhost/~thoki/overstock-affiliate-links/trunk/api/';
var ostk_plugin = new ostk_Plugin();

function ostk_Plugin(){
	/**
	* OSTK PLUGIN Data Class
	* Everything needed to create and render ostk widgets
	**/ 

	this.constructor = function(){
		setDeveloperID('FKAJQ7bUdyM');
		this.ostk_check_jquery();
	};//constructor

	this.ostk_check_jquery = function(){
		if(typeof jQuery == 'undefined'){
			this.ostk_get_script('http://code.jquery.com/jquery-2.1.4.min.js', function() {
				if(typeof jQuery=='undefined'){
					// Super failsafe - still somehow failed...
				}else{
					this.ostk_init_elements();
				}
			});
		} else { // jQuery was already loaded	
			this.ostk_init_elements();
		};
	};//ostk_check_jquery

	this.ostk_init_elements = function(){
		var _this = this;
		$ostk_jQuery = jQuery.noConflict();
		$ostk_jQuery(document).ready(function() {
			_this.load_css();
			_this.get_elements();
			_this.ostk_preloaders();

		});
	};//ostk_init_elements

	this.ostk_get_script = function(url, success) {
		var script = document.createElement('script');
	     script.src = url;
		var head = document.getElementsByTagName('head')[0],
		done = false;
		// Attach handlers for all browser
		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
			done = true;
				// callback function provided as param
				success();
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);	
			};
		};
		head.appendChild(script);
	};//ostk_get_script

	this.load_css = function(){
		$ostk_jQuery('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', ostk_api_url+'css/overstock-embed.min.css');
	};//ostk_loadCSS

	this.ostk_preloaders = function(){
		$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
			var _this = $ostk_jQuery(this);

			var attrs = _this[0].attributes;
			for(var i = 0 ; i < attrs.length ; i++){
				if(attrs[i]['name'] === 'data-width'){
					_this.css('width', attrs[i]['value']);
					break;
				}else if(attrs[i]['name'] == 'data-type' && attrs[i]['value'] == 'leaderboard'){
					_this.css('width', '728px');
					break;
				}
			}//for

		    var ostk_loader_div = $ostk_jQuery('<div>')
		    	.attr('class', 'ostk-loader')
				.appendTo(_this);

		    $ostk_jQuery('<img>')
		    	.attr({
		    		src: ostk_api_url+'images/overstock-logo.png',
		    		width: 125
		    	})
		    	.appendTo(ostk_loader_div);

		    var p = $ostk_jQuery('<p>')
		    	.text(' Loading...')
		    	.appendTo(ostk_loader_div);

		    $ostk_jQuery('<i>')
		    	.attr({
					class: "fa fa-refresh fa-spin"
		    	})
		    	.prependTo(p);
		});
	};//ostk_preloaders

	this.get_elements = function(){
		var ostk_element_count = $ostk_jQuery('div').filter("[data-tag='overstock']").length;
		var ostk_element_loaded_count = 0;
		var _this = this;
		$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
			var element = $ostk_jQuery(this);
			var atts = $ostk_jQuery(this)[0].attributes;
			var data = {};
			for(var i = 0 ; i < atts.length ; i++){
				if (atts[i]['name'].indexOf("data-") >= 0){
					var name = atts[i]['name'].split('data-')[1];
					var value = atts[i]['value'];
					if(name != 'tag'){
						data[name] = value;
					}
				}
			}//for
			var item = new ostk_Element(data, element);
		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin

function ostk_Element(atts, element){
	this.atts = atts;
	this.element = element;

	// Constructor
	this.constructor = function(){
		/**
		* consumes a single param . 'type'
		* then passes the rest of atts to other functions.
		**/
		var error = null;
		if(!ostk_isset(developerId)){
			error = ostk_formatError("Linkshare ID needs to be authenticated."); 
		}

		if(!error){
			var areAttsValid = ostk_areAttributesValid(this.atts)
			if(areAttsValid !== true){
				error = areAttsValid;
			}
		}

		if(!error){
			if(this.atts['type'] == '' || this.atts['type'] == null){ 
				error = "Type parameter cannot be empty.";
			}else if(ostk_isset(this.atts['link_target']) && !ostk_isValidLinkTarget(this.atts)){ 
				error = '"link_target" not found. Please check spelling and try again.';
			}
		}

		if(!error){
			// hoki - check to make sure that this pregmatch is working
			var regex = /^[1-9]\d*(px|%)/i;
			if(ostk_isset(this.atts['width']) && !regex.exec(this.atts['width'])){
				// if(ostk_isset(this.atts['width']) && !preg_match("/^[1-9]\d*(px|%)/i", this.atts['width'])){
				error = ostk_formatError("Width requires % or px, and a value greater than 0.");
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			switch (this.atts['type']) {
				case 'search':
					this.generateSearcQueryWidget();
					break;
				case 'link':
					this.generateLinkWidget();
					break;
				case 'rectangle':
					this.generateRectangleWidget();
					break;
				case 'leaderboard':
					this.generateLeaderboardWidget();
					break;
				case 'skyscraper':
					this.generateSkyscraperWidget();
					break;
				case 'carousel':
					this.generateCarouselWidget();
					break;
				case 'stock_photo':
					this.generateStockPhotoWidget();
					break;
				case 'product_link':
					this.generateProductDetailsLinkWidget();
					break;
				case 'product_carousel':
					this.generateProductCarouselWidgetWidget();
					break;
				case 'sample_data':
					this.generateSampleData();
					break;
			}//switch
		}
	};//generateShortcodeWidgets

	// Pattern 1 - Generate Search Query Widget
	this.generateSearcQueryWidget = function(){
		/**
		* Search Query: takes you to search results page
		* Generate a link to a search results page
		* Query is link text if link_text parameter is empty
		**/
		var output = '';
		var keywords = (ostk_isset(atts['query']) ? "keywords=" + atts['query'].split(" ").join("%20") : null);
		var taxonomy = '';
		var taxonomyParam = '';
		var error = null;
		var sortOption = '';

		var link_text = atts['link_text'];

		if(!error){
			if(keywords == null) {
				error = '"query" parameter cannot be empty.';
			}
		}

		if(error){
			if(ostk_isset(atts['category'])){
				taxonomyParam = ostk_getTaxonomy(atts['category']);
				if(!taxonomyParam){
					error = '"category" not found. Please check spelling and try again.';
				} else {
					taxonomy = "&taxonomy=" + taxonomyParam; 
				}
			}
		}

		if(error){
			if(ostk_isset(atts['sort_by'])){
				sortOptionParam = ostk_getSortOption(atts['sort_by']);
				if(!sortOptionParam){
					error = '"sort_by" not found. Please check spelling and try again.';
				} else {
					sortOption = "&sortOption=" + sortOptionParam; 
				}
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			var affiliateLink = ostk_generateAffiliateLink("http://www.overstock.com/search?"+keywords+taxonomy+sortOption);
			link_text = (atts['link_text'] != null ? atts['link_text'] : atts['query']);
			output = '<a href="'+affiliateLink+'" class="ostk-element ostk-search" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';
			this.renderHTML(output);
		}
	};//generateSearcQueryhWidget

	// Pattern 2 - Generate Link Widget
	this.generateLinkWidget = function(){
		/**
		* Link: lets you create links to any overstock page
		* Generate a link to a predefined page on Overstock.com
		* Specify the link_text with the link_text attribute
		**/
		var output = '';
		atts = ostk_shortcode_atts(
	    {
	      'type': null,
	      'url': 'http://www.overstock.com/', 
	      'link_text': 'A link to Overstock.com',
	      'link_target': 'new_tab'
	    }, atts);
		var link_text = atts['link_text'];
		var affiliateLink = ostk_generateAffiliateLink(atts['url']);
		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';
		this.renderHTML(output);
	};//generateLinkWidget

	// Pattern 3 - Generate Rectangle Widget
	this.generateRectangleWidget = function(){
		/**
		* Pattern 3 - Rectangle: Lets you create a rectangular banner for a SINGLE product
		**/
		var output = '';
		var _this = this;
		this.obj = new ostk_SingleProductData();

		if(this.atts['id']){
			this.obj.productId = this.atts['id'];
		}else if(this.atts['event']){
			var query = ostk_getEventQuery(this.atts['event']);
			this.obj.query = query;
		}

		this.initObject(ostk_generateRectangleHtmlOutput);

	};//generateRectangleWidget

	// Pattern 4 - Generate Leaderboard Widget
	this.generateLeaderboardWidget = function(){
		/**
		* Leaderboard: Lets you create a leaderboard banner for up to two products
		**/
		atts = ostk_shortcode_atts(
		{
			'type': null,
			'product_ids': null,
			'event': null,
			'link_target': 'new_tab',
			'number_of_items': 2
		}, atts);

		var output = '';
		var error = null;
		var _this = this;
		var limit = (parseInt(atts['number_of_items']) < 2) ? atts['number_of_items'] : 2;

		this.obj = new ostk_MultiProductData();
		this.obj.limit = limit;

		if(this.atts['product_ids']){
			this.obj.productIds = atts['product_ids'];
		}else if(this.atts['event']){
			this.obj.query = ostk_getEventQuery(this.atts['event']);
		}

		this.initObject(ostk_generateLeaderboardHtmlOutput);

	};//generateLeaderboardWidget

	// Pattern 5 - Generate Skyscraper Widget
	this.generateSkyscraperWidget = function(){
		/**
		* Skyscraper: Lets you create a skyscraper banner for up to three products
		*/
		atts = ostk_shortcode_atts(
		{
			'type': null,
			'product_ids': null,
			'width': null,
			'link_target': 'new_tab',
			'number_of_items': 3
		}, atts);

		var error = '';
		var limit = (parseInt(atts['number_of_items']) < 3) ? atts['number_of_items'] : 3;

		this.obj = new ostk_MultiProductData();
		this.obj.limit = limit;

		if(this.atts['product_ids']){
			this.obj.productIds = atts['product_ids'];
		}else if(this.atts['event']){
			this.obj.query = ostk_getEventQuery(this.atts['event']);
		}

		this.initObject(ostk_generateSkyscraperHtmlOutput);

	};//generateSkyscraperWidget

	this.initObject = function(callback){
		var _this = this;
		this.obj.init(
			//Success
			function(){
				_this.renderHTML(callback(_this.obj, atts));
			},
			// Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//initObject

	// Pattern 6 - Generate Carousel Widget
	this.generateCarouselWidget = function(){
		/**
		* Carousel: Lets you create a carousel banner for up to five products
		* Generate a carousel viewer for a number_of_products
		**/
		atts = ostk_shortcode_atts(
		{
			'id': null,
			'type': null,
			'category': null, 
			'carousel-type': null, 
			'number_of_items': 10,
			'sort_by': null, 
			'keywords': null,
			'product_ids': null,
			'width': null,
			'link_target': 'new_tab'
		}, atts);

		var output = '';
		var error = null;
		var _this = this;
		var muliProduct = true;
		var img_count = 0;

		if(atts['id']){
			muliProduct = false;

			this.obj = new ostk_SingleProductData();
			this.obj.productId = atts['id'];
			this.obj.multiImages = true;
			this.carouselHelper(muliProduct);
		}else{
			if(atts['product_ids']){
				var product_ids = atts['product_ids'].split(',');
			}else if(atts['category']){
				var taxonomy = "&taxonomy=" + ostk_getTaxonomy(atts['category']);
				var sortOption = (ostk_isset(atts['sort_by']) ? "&sortOption=" + ostk_getSortOption(atts['sort_by']) : '');
				if (ostk_isset(taxonomy) && ostk_getTaxonomy(atts['category']) == false) {
					error = "category="+atts['category']+" does not match our given categories, please check it.";
				} 
			}else if(atts['keywords']){
				var keywords = "keywords=" + str_replace(' ', '%20', atts['keywords']);
			}else {
				error = "Some required fields are missing, (category or keywords) or (a list of product_ids)";
			}

			this.obj = new ostk_MultiProductData();
			this.obj.limit = atts['number_of_items'];
			if (ostk_isset(product_ids)) {
				this.obj.productIds = product_ids;
				this.carouselHelper(muliProduct);
			}else{
				var query = "https://api.overstock.com/ads/products?developerid=test&"+keywords+taxonomy+sortOption;
				this.obj.query = query;
				this.carouselHelper(muliProduct);
			}
		}

		if(error){
			this.renderHTMLError(error, muliProduct);
		}
	};//generateCarouselWidget

	this.carouselHelper = function(muliProduct){
		var output = '';
		var _this = this;
		var img_count = 0;

		var item = this.obj;

		item.init(
			//Success
			function(){
				output += ostk_generateCarouselHTML(item, atts, muliProduct);
				output = $ostk_jQuery(output);
				if(item.multiImages){
					img_count = item.arrayOfAllProductImages.length;
				}else{
					if(muliProduct){
						img_count = item.productList.length;
					}
				}

				if(img_count > 1){
					_this.loadCarousel(output);
				}
				_this.renderHTML(output);
				_this.resizeCarousel(output);

				$ostk_jQuery(window).resize(function() {
				    clearTimeout(window.resizedFinished);
				    window.resizedFinished = setTimeout(function(){
						_this.resizeCarousel(output);
				    }, 250);
				});
			},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//carouselHelper

	// Load Carousel
	this.loadCarousel = function(carousel){
		var _this = this;

		carousel.find('.ostk-flexslider').flexslider({
			animation: "slide",
			controlNav: "thumbnails",
			customDirectionNav: carousel.find(".custom-navigation a"),
			controlsContainer: carousel.find(".custom-controls-container"),
			touch: true,
			slideshow: false,
			start: function(carousel){
				//Call on load
				_this.showThumbnails(carousel, this);
			},
			after: function(carousel){
				//Call after changing the current img
				_this.showThumbnails(carousel, this);
			}
		});
	};//loadCarousel

	// Resize Flexslider
	this.resizeCarousel = function(carousel){
		var ostk_mobile_breakpoint = 500;
		var carousel_inner = carousel.find('.ostk-element-inner');
		if(carousel.outerWidth() > ostk_mobile_breakpoint){
			carousel_inner.addClass('desktop-size');
			carousel_inner.removeClass('mobile-size');
		}else{
			carousel_inner.removeClass('desktop-size');
			carousel_inner.addClass('mobile-size');
		}
	};//resizeCarousel

	// Show Thumbnails
	this.showThumbnails = function(carousel, flexslider){
		var itemsPerPage = 5;
		var currentSlide = carousel.currentSlide;
		var items = carousel.controlsContainer.find("ol li");
		var onBothSides = (itemsPerPage-1)/2;

		items.each(function(index){
			if( (index>=(currentSlide-onBothSides) && index<=(currentSlide+onBothSides) ) ||
				// The items on either side of the current item will show 
				(currentSlide < onBothSides && index < itemsPerPage) ||
				// If at the beginning
				(items.length-currentSlide <= onBothSides && items.length-index <= itemsPerPage) ){
				// If at the end
				$ostk_jQuery(this).show();
			}else{
				$ostk_jQuery(this).hide();
			}
		});
	};//showThumbnails

	// Pattern 7 - Generate Stock Photo Widget
	this.generateStockPhotoWidget = function(){
		/**
		* Stock Photo: lets you create an image link to a product page (stock photo)
		* Allow users to add stock photos to their posts (and get paid for it).
		**/
		var output = '';
		var _this = this;
		atts = ostk_shortcode_atts(
		{
			'type': null,
			'id': null, 
			'height': null, 
			'width': null, 
			'image_number': '1', 
			'custom_css': null,
			'link_target': 'new_tab'
		}, atts);
	    var item = new ostk_SingleProductData(atts['id']);
		item.multiImages = true;
	    item.init(
	    	//Success
	    	function(){
				if(atts['image_number'] <= item.arrayOfAllProductImages.length){
					output = ostk_generateStockPhotoHtmlOutput(item, atts);
					_this.renderHTML(output);
				}else{
					var imageNumberError = 'Image number '+atts['image_number']+' is not available.';
					if(item.arrayOfAllProductImages.length > 1){
						imageNumberError += ' Image numbers from 1 to '+ item.arrayOfAllProductImages.length +' are available.';
					}else{
						imageNumberError += ' This image only has 1 available image.';
					}
					imageNumberError += ' Please change the image_number attribute and try again';
					_this.renderHTMLError(imageNumberError);
				}
	    	},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}
	    );
	}//generateStockPhotoWidget

	// Pattern 8 - Generate Product Detials Link Widget
	this.generateProductDetailsLinkWidget = function(){
		/**
		* Product Details Link : Allow users to create easy links to products they are showcasing.
		**/
		var output = '';
		var _this = this;
		var error = null;
		atts = ostk_shortcode_atts(
		{
			'id': null,
			'display': null,
			'link_target': 'new_tab'
		}, atts);
		var item = new ostk_SingleProductData(atts['id']);
		item.init(
			//Success
			function(){
				switch (atts['display']) {
					case 'name':
						output = item.getName();
						break;
					case "price":
						output = item.getPrice();
						break;
					case 'description':
						output = item.getDescription();
						break;
				}//switch
				output = '<a href="'+item.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(atts)+'>'+output+'</a>';
				_this.renderHTML(output);
			},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	}//generateProductDetailsLinkWidget

	// Pattern 9 - Generate Sample Data Widget
	this.generateSampleData =function() {
		/**
		* Sample Widget: takes productId returns ProductData object
		**/
		var output = '';
		var _this = this;
		atts = ostk_shortcode_atts(
		{
			'id': ''
		}, atts);
		var item = new ostk_SingleProductData(atts['id']);
		item.init(
			//Success
			function(){
				output += '<p>The name is <strong>'+item.getName()+'</strong></p><br/>';
				output += '<p>The price is <strong>'+item.getPrice()+'</strong></p><br/>';
				output += '<p>The rating (as decimal is) <strong>'+item.getAverageReviewAsDecimal()+'</strong></p><br/>';
				output += '<p>The rating (as gif is)... see below</p><br/>';
				output += '<img src= "'+item.getAverageReviewAsGif()+'"/><br/>';
				output += '<p> <strong>Large image:</strong></p><br/>';
				output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Large()+' /></a><br/>';
				output += '<p> <strong>Medium image:</strong></p><br/>';
				output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Medium()+' /></a><br/>';
				output += '<p> <strong>Small image:</strong></p><br/>';
				output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Thumbnail()+' /></a><br/>';
				output += '<p>The url link is <a href="'+item.getAffiliateUrl()+'"><strong>here, click me!</strong></a></p><br/>';
				output += '<p>Also, all photos are clickable.<p><br/>';
				_this.renderHTML(output);
			},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//generateSampleData

	//Render HTML
	this.renderHTML = function(data){
		data = $ostk_jQuery(data);
		this.element.replaceWith(data);
	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){
		this.renderHTML(ostk_formatError(data));
	};//renderHTMLError

	this.constructor(this.atts);
}//ostk_Element






