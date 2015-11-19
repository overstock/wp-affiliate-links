var ostk_developerId;
var ostk_api_url = 'https://cdn.rawgit.com/overstock/wp-affiliate-links/6ea285ce81b12fb56c8cebbabb6410256e066ada/api/';
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
			var obj = $ostk_jQuery(this);
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
			var item = new ostk_Element(data, obj);
		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin

function ostk_Element(atts, obj){
	this.atts = atts;
	this.obj = obj;

	// Constructor
	this.constructor = function(){
		/**
		* consumes a single param . 'type'
		* then passes the rest of atts to other functions.
		*	
		* Example usage:
		* 1) [overstock type="search" query="book of Mormon"]
		* 2) [overstock type="carousel" category="Pets" number_of_items="5"]
		**/
		var error = null;
		if(!ostk_isset(developerId)){
			error = ostk_formatError("Linkshare ID needs to be authenticated."); 
		}

		switch(this.atts['type']){
			case 'stock_photo':
			case 'product_carousel':
				error = ostk_formatError("Invalid type attribute.");
			break;
		}//switch

		if(ostk_areAttributesValid(this.atts) !== true){
			this.renderHTML(ostk_areAttributesValid(this.atts));
		}
		if(this.atts['type'] == '' || this.atts['type'] == null){ 
			error = ostk_formatError("Type parameter cannot be empty.");
		}else if(ostk_isset(this.atts['link_target']) && !ostk_isValidLinkTarget(this.atts)){ 
			error = ostk_formatError('"link_target" not found. Please check spelling and try again.');
		}

		// hoki - check to make sure that this pregmatch is working
		var regex = /^[1-9]\d*(px|%)/i;
		if(ostk_isset(this.atts['width']) && !regex.exec(this.atts['width'])){
			// if(ostk_isset(this.atts['width']) && !preg_match("/^[1-9]\d*(px|%)/i", this.atts['width'])){
			error = ostk_formatError("Width requires % or px, and a value greater than 0.");
		}

		if(error === null){
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
		}else{
			this.renderHTML(error);
		}
	};//generateShortcodeWidgets

	// Pattern 1 - Generate Search Query Widget
	this.generateSearcQueryWidget = function(){
		/**
		* Search Query: takes you to search results page
		* Generate a link to a search results page
		* Query is link text if link_text parameter is empty
		*	
		* Usage example 
		* 1) [overstock type="search" query="soccer shoes"]
		* 2) [overstock type="search" query="soccer shoes" link_text="Overstock has great soccer shoes"]
		**/
		var output = '';
		var keywords = (ostk_isset(atts['query']) ? "keywords=" + atts['query'].split(" ").join("%20") : null);
		var taxonomy = '';
		var taxonomyParam = '';
		var error = null;
		var sortOption = '';

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
		*	
		* Usage example 
		* 1) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"]
		* 2) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html" link_text="I want to buy this for my wife"]
		**/
		var output = '';
		atts = shortcode_atts(
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
		*	
		* Usage example 
		* 1) [overstock type="rectangle" id="10234427"]
		**/
		var output = '';
		var _this = this;
		var item = new ostk_SingleProductData(this.atts['id']);
		item.init(
			//Success
			function(){
				output += '<div class="ostk-element ostk-'+_this.atts['type']+'" '+ostk_getStyles(_this.atts)+'>';
					output += '<div class="ostk-element-inner">';
						output += ostk_getBranding();
						output += '<a href="'+item.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
							output += '<div class="element-content">';
								output += '<img src="'+item.getImage_Large()+'"/>';
							output += '</div>';
							output += '<div class="element-overlay">';
							    output += '<div class="element-content">';
									output += '<p class="title">'+item.getName()+'</p>';
									if(item.averageReviewAsGif){
										output += '<img class="ostk-rating" src="'+item.getAverageReviewAsGif()+'"/>';
									}
									output += '<p class="price">'+item.getPrice()+'</p>';
								output += '</div>';
							output += '</div>';
						output += '</a>';
					output += '</div><!-- ostk-element-inner -->';
				output += '</div><!-- ostk-element -->';
				_this.renderHTML(output);
			},
			// Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//generateRectangleWidget

	// Pattern 4 - Generate Leaderboard Widget
	this.generateLeaderboardWidget = function(){
		/**
		* Leaderboard: Lets you create a leaderboard banner for up to two products
		*	
		* Usage Example
		* 1) [overstock type="leaderboard" product_ids="8641092"]
		* 2) [overstock type="leaderboard" product_ids="8641092, 9547029"]
		**/
		var output = '';
		var error = null;
		atts = shortcode_atts(
		{
			'type': null,
			'product_ids': null,
			'link_target': 'new_tab'
		}, atts);
		//hoki make sure this is working     
		// var product_ids = (ostk_isset(atts['product_ids']) ? array_map('trim', explode(',', atts['product_ids'])) : null);
		var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);
		for(id in product_ids) {
			if(ostk_checkForMissingCommas(id) == true) {
				error = "Commas missing between ids, returning...";
			}
		}//for

		if(error){
	    	this.renderHTMLError(error);
		}else{
			var product_ids = ostk_limitArrayCount(product_ids, 2);
			var products = new ostk_MultiProductDataFromArray();
			var _this = this;
			products.init(
				product_ids, 
				2, 
				//Success
				function(){
					output += '<div class="ostk-element ostk-leaderboard">';
						output += '<div class="ostk-element-inner">';
							output += ostk_getBranding();
							output += '<div class="item-holder item-count-'+product_ids.length+'">';
								output += ostk_generateLeaderboardHtmlOutput(products, atts);
							output += '</div>';
						output += '</div><!-- ostk-element-inner -->';
					output += '</div><!-- ostk-element -->';
			    	_this.renderHTML(output);
				},
				//Error
				function(error){
					_this.renderHTMLError(error);
				}
			);
		}
	};//generateLeaderboardWidget

	// Pattern 5 - Generate Skyscraper Widget
	this.generateSkyscraperWidget = function(){
		/**
		* Skyscraper: Lets you create a skyscraper banner for up to three products
		*	
		* Usage Example
		* 1) [overstock type="skyscraper" product_ids="8641092"]
		* 2) [overstock type="skyscraper" product_ids="8641092, 9547029"]
		* 3) [overstock type="skyscraper" product_ids="8641092, 9547029, 9547023"]
		*/
		var output = '';
		var _this = this;
		var error = '';
		atts = shortcode_atts(
		{
			'type': null,
			'product_ids': null,
			'width': null,
			'link_target': 'new_tab'
		}, atts);
		var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);
		for(id in product_ids) {
			if(ostk_checkForMissingCommas(id) == true) {
				error = ostk_formatError("Commas missing between ids, return ing...");
			}
		}//for

		if(error){
		    this.renderHTMLError(output);
		}else{
			var product_ids = ostk_limitArrayCount(product_ids, 3);
			var products = new ostk_MultiProductDataFromArray();
			products.init(
				product_ids, 
				3, 
				//Success
				function(){
					output += '<div class="ostk-element ostk-skyscraper" '+ostk_getStyles(atts)+'>';
						output += '<div class="ostk-element-inner">';
							output += ostk_getBranding();
							output += ostk_generateSkyscraperHtmlOutput(products, atts);
						output += '</div><!-- ostk-element-inner -->';
					output += '</div><!-- ostk-element -->';
					_this.renderHTML(output);
				},
				//Error
				function(error){
					_this.renderHTMLError(error);
				}
			);
		}
	};//generateSkyscraperWidget

	// Pattern 6 - Generate Carousel Widget
	this.generateCarouselWidget = function(){
		/**
		* Carousel: Lets you create a carousel banner for up to five products
		* Generate a carousel viewer for a number_of_products
		*	
		* Usage Example
		* 1) [overstock type="carousel" product_ids="8641092, 9547029, 9547023"]
		* 2) [overstock type="carousel" category="Pets" sort_by="Top Sellers"]
		* 3) [overstock type="carousel" keywords="soccer shoes" number_of_items="6"]
		**/
		var output = '';
		var products;
		var error = null;
		var _this = this;
		atts = shortcode_atts(
		{
			'type': null,
			'category': null, 
			'number_of_items': 10,
			'sort_by': null, 
			'keywords': null,
			'product_ids': null,
			'width': null,
			'link_target': 'new_tab'
		}, atts);
	  
		var taxonomy = (ostk_isset(atts['category']) ? "&taxonomy=" + ostk_getTaxonomy(atts['category']) : null);
		var sortOption = (ostk_isset(atts['sort_by']) ? "&sortOption=" + ostk_getSortOption(atts['sort_by']) : '');
		var keywords = (ostk_isset(atts['keywords']) ? "keywords=" + str_replace(' ', '%20', atts['keywords']) : null);
		var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);

		if (ostk_isset(taxonomy) && ostk_getTaxonomy(atts['category']) == false) {
			error = "category="+atts['category']+" does not match our given categories, please check it.";
		} else if (taxonomy == null && keywords == null && product_ids == null) {
			error = "Some required fields are missing, (category or keywords) or (a list of product_ids)";
		} else if (ostk_isset(product_ids)) {
			for(id in product_ids) {
		    	if(ostk_checkForMissingCommas(id) == true) {
		    		error = ostk_formatError("Commas missing between ids, return ing...");
		    	}
		    }//for
			products = new ostk_MultiProductDataFromArray();
			products.init(
				product_ids, 
				atts['number_of_items'], 
				//Success
				function(){
					output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>';
						output += '<div class="ostk-element-inner">';
							output += ostk_generateCarouselHTML('carousel', products.getProductList(), atts);
						output += '</div><!-- ostk-element-inner -->';
					output += '</div><!-- ostk-element -->';

					// _this.renderHTML(output);
					// output = $ostk_jQuery(output);
					// _this.loadCarousel(output);						
		    	},
				// Error
				function(error){
					_this.renderHTMLError(error);
				}		    	
		    );
	  } else {
		var query = "http://www.overstock.com/api/search.json?"+keywords+taxonomy+sortOption;
		products = new ostk_MultiProductDataFromQuery();
		products.init(
			query, 
			atts['number_of_items'], 
			//Success
			function(){
				output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>';
					output += '<div class="ostk-element-inner">';
						output += ostk_generateCarouselHTML('carousel', products.getProductList(), atts);
					output += '</div><!-- ostk-element-inner -->';
				output += '</div><!-- ostk-element -->';
				_this.renderHTML(output);
				// _this.loadCarousel();						
			},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}		    	
		);
	  }

	  if(error){
	    this.renderHTMLError(output);
	  }
	};//generateCarouselWidget

	// Pattern 7 - Generate Stock Photo Widget
	this.generateStockPhotoWidget = function(){
		/**
		* Stock Photo: lets you create an image link to a product page (stock photo)
		* Allow users to add stock photos to their posts (and get paid for it).
		*	
		* Example Usage:
		* 1) [overstock type="stock_photo" id="8859234"]
		**/
		var output = '';
		var _this = this;
		atts = shortcode_atts(
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
	    item.constructor(
	    	//Success
	    	function(){
				if(atts['image_number'] <= item.numImages){
					output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(atts)+'>';
						output += '<div class="ostk-element-inner">';
							output += ostk_generateStockPhotoHtmlOutput(item, atts);
						output += '</div><!-- ostk-element-inner -->';
					output += '</div><!-- ostk-element -->';
				}else{
					imageNumberError = 'Image number '+atts['image_number']+' is not available.';
					if(item.numImages > 1){
						imageNumberError += ' Image numbers from 1 to '+ item.numImages +' are available.';
					}else{
						imageNumberError += ' This image only has 1 available image.';
					}
					imageNumberError += ' Please change the image_number attribute and try again';
					output = ostk_formatError(imageNumberError);
				}
				_this.renderHTML(output);
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
		* Example Usage:
		* 1) [overstock type="product_link" id="8859234"]
		**/
		var output = '';
		var _this = this;
		var error = null;
		atts = shortcode_atts(
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

	// Pattern 9 - Generate Product Carousel Widget
	this.generateProductCarouselWidget = function(){
		/**
		* Product Carousel: Lets you create a carousel for a single product, it shows all product photos
		* Usage Example
		* 1) [overstock type="product_carousel" id="6143359"]
		**/
		var output = '';
		atts = shortcode_atts(
		{
		'id': null,
		'width': null,
		'link_target': 'new_tab',
		'number_of_items': null
		}, atts);
		var item = new ostk_SingleProductData(atts['id']);
		item.constructor(
			//Success
			function(){
			    if(item.isValidProductID()){
					output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>';
				        output += '<div class="ostk-element-inner">';
							output += ostk_generateCarouselHTML('product_carousel', item, atts);
						output += '</div><!-- ostk-element-inner -->';
					output += '</div><!-- ostk-element -->';
			    }else{
			  		output = ostk_formatError('Invalid product ID');
			    }
			    _this.renderHTML(output);
				_this.loadCarousel(data);						
			},
			//Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	}//generateProductCarouselWidget

	// Pattern 10 - Generate Sample Data Widget
	this.generateSampleData =function() {
		/**
		* Sample Widget: takes productId returns ProductData object
		**/
		var output = '';
		var _this = this;
		atts = shortcode_atts(
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
	}//generateSampleData

	//Render HTML
	this.renderHTML = function(data){
		data = $ostk_jQuery(data);
		this.obj.replaceWith(data);
	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){
		throw new Error("(Overstock Plugin) " + data);
		this.renderHTML(ostk_formatError(data));
	}//renderHTMLError

	// Load Carousel
	this.loadCarousel = function(carousel){
		var _this = this;
		var _carousel = carousel;
		_this.resizeCarousel(carousel);
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
				$ostk_jQuery(window).resize(function() {
				    clearTimeout(window.resizedFinished);
				    window.resizedFinished = setTimeout(function(){
						_this.resizeCarousel(_carousel);
				    }, 250);
				});
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

	this.constructor(this.atts);
}//ostk_Element






