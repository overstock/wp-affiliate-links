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

			switch (data['type']) {
				case 'search':
					var item = new ostk_SearchQuery(data, element);
					break;
				case 'link':
					var item = new ostk_Link(data, element);
					break;
				case 'rectangle':
					var item = new ostk_Rectangle(data, element);
					break;
				case 'leaderboard':
					var item = new ostk_Leaderboard(data, element);
					break;
				case 'skyscraper':
					var item = new ostk_Skyscraper(data, element);
					break;
				case 'carousel':
					var item = new ostk_Carousel(data, element);
					break;
				case 'stock_photo':
					var item = new ostk_Stockphoto(data, element);
					break;
				case 'product_link':
					var item = new ostk_ProductDetailsLink(data, element);
					break;
				case 'sample_data':
					var item = new ostk_SampleData(data, element);
					break;
			}//switch

		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin

function ostk_Element(atts, element){
	this.atts = atts;
	this.element = element;

	//Init
	this.init = function(){
		/**
		* consumes a single param . 'type'
		* then passes the rest of atts to other functions.
		**/
		var error = null;
		if(!ostk_isset(developerId)){
			error = "Linkshare ID needs to be authenticated."; 
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
				error = "Width requires % or px, and a value greater than 0.";
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			// console.log('calling back');
			// console.dir(this);
			// callback();
			this.initElement();
		}
	};//init

	// Init Object
	this.initObject = function(callback){
		var _this = this;
		this.obj.init(
			//Success
			function(){
				_this.generateHtml();
				// _this.renderHTML(callback(_this.obj, this.atts));
				// _this.renderHTML(callback(_this.obj, atts));
			},
			// Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//initObject

	//Render HTML
	this.renderHTML = function(data){
		this.element.fadeOut('slow');
		data = $ostk_jQuery(data);
		this.element.replaceWith(data);
		data.hide();
		data.fadeIn('slow');
	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){

		this.renderHTML(ostk_formatError(data));
	};//renderHTMLError
}//ostk_Element

function ostk_SearchQuery(atts, element){
	/*
	Search Query: takes you to search results page
	Generate a link to a search results page
	Query is link text if link_text parameter is empty
	*/
	ostk_Element.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
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
	};//initElement

	this.init();
}//ostk_SearchQuery

function ostk_Link(atts, element){
	/*
	Link: lets you create links to any overstock page
	Generate a link to a predefined page on Overstock.com
	Specify the link_text with the link_text attribute
	*/
	ostk_Element.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		atts = ostk_shortcode_atts(
	    {
	      'type': null,
	      'url': 'http://www.overstock.com/', 
	      'link_text': 'A link to Overstock.com',
	      'link_target': 'new_tab'
	    }, atts);

		var output = '';
		var link_text = atts['link_text'];
		var affiliateLink = ostk_generateAffiliateLink(atts['url']);

		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';

		this.renderHTML(output);
	};//initElement

	this.init();
}//ostk_Link

function ostk_ProductDetailsLink(atts, element){
	/*
	Product Details Link : Allow users to create easy links to products they are showcasing.
	*/
	ostk_Element.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		atts = ostk_shortcode_atts(
		{
			'id': null,
			'display': null,
			'link_target': 'new_tab'
		}, atts);

		this.obj = new ostk_SingleProductData();
		this.obj.productId = atts['id']

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
				switch (atts['display']) {
					case 'name':
						output = this.obj.getName();
						break;
					case "price":
						output = this.obj.getPrice();
						break;
					case 'description':
						output = this.obj.getDescription();
						break;
				}//switch
		output = '<a href="'+this.obj.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(atts)+'>'+output+'</a>';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_ProductLink

function ostk_Rectangle(atts, element){
	/* 
	Rectangle: Lets you create a rectangular banner for a SINGLE product 
	*/
	ostk_Element.call(this, atts, element);

	// Init Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();

		if(this.atts['id']){
			this.obj.productId = this.atts['id'];
		}else if(this.atts['event']){
			var query = ostk_getEventQuery(this.atts['event']);
			this.obj.query = query;
		}

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		output += '<div class="ostk-element ostk-'+atts['type']+'" '+ostk_getStyles(atts)+'>';
			output += '<div class="ostk-element-inner">';
				output += ostk_getBranding();
				output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
					output += '<div class="element-content">';
						output += '<img src="'+this.obj.getImage_Large()+'"/>';
					output += '</div>';
					output += '<div class="element-overlay">';
					    output += '<div class="element-content">';
							output += '<p class="title">'+this.obj.getName()+'</p>';
							if(this.obj.averageReviewAsGif){
								output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
							}
							output += '<p class="price">'+this.obj.getPrice()+'</p>';
						output += '</div>';
					output += '</div>';
				output += '</a>';
			output += '</div><!-- ostk-element-inner -->';
		output += '</div><!-- ostk-element -->';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_Reactagngle

function ostk_Leaderboard(atts, element){
	/* 
	Leaderboard: Lets you create a leaderboard banner for up to two products 
	*/
	ostk_Element.call(this, atts, element);

	// Init Element
	this.initElement = function(){
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

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = this.obj.getProductList();
		var output = '';
		output += '<div class="ostk-element ostk-leaderboard">';
			output += '<div class="ostk-element-inner">';
				output += ostk_getBranding();
				output += '<div class="item-holder item-count-'+productList.length+'">';
					for(var i = 0 ; i < productList.length ; i++){
						var product = productList[i];
					    output += '<div class="element-content">';
							output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
								output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';
								output += '<p class="title">'+product.getName()+'</p>';
								output += '<p class="description">'+product.description+'</p>';
								if(product.averageReviewAsGif){
									output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
								}
								output += '<p class="price">'+product.getPrice()+'</p>';
							output += '</a>';
						output += '</div>';
					}//for
				output += '</div>';
			output += '</div><!-- ostk-element-inner -->';
		output += '</div><!-- ostk-element -->';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_Leaderboard

function ostk_Skyscraper(atts, element){
	/* 
	Skyscraper: Lets you create a skyscraper banner for up to three products
	*/
	ostk_Element.call(this, atts, element);

	// Init Element
	this.initElement = function(){
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

		this.initObject();
	};//initElement


	// Generate Html
	this.generateHtml = function(){
		var productList = this.obj.getProductList();
		var output = '';
		output += '<div class="ostk-element ostk-skyscraper" '+ostk_getStyles(atts)+'>';
			output += '<div class="ostk-element-inner">';
				output += ostk_getBranding();

				for(var i = 0 ; i < productList.length ; i++){
			    var product = productList[i];
			    output += '<div class="element-content">';
					output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
						output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';
						output += '<p class="title">'+product.getName()+'</p>';
						if(product.averageReviewAsGif){
							output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+product.getPrice()+'</p>';
					output += '</a>';
				output += '</div>';
			  }//for

			output += '</div><!-- ostk-element-inner -->';
		output += '</div><!-- ostk-element -->';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_Skyscraper

function ostk_Carousel(atts, element){
	/*
	Carousel: Lets you create a carousel banner for up to five products
	Generate a carousel viewer for a number_of_products
	*/
	ostk_Element.call(this, atts, element);

	// Init Element
	this.initElement = function(){
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
		this.muliProduct = true;
		var img_count = 0;

		if(atts['id']){
			this.muliProduct = false;

			this.obj = new ostk_SingleProductData();
			this.obj.productId = atts['id'];
			this.obj.multiImages = true;
			this.initObject();
		}else{
			var taxonomy = '';
			var sortOption = '';
			var keywords = '';
			if(atts['product_ids']){
				var product_ids = atts['product_ids'].split(',');
			}else if(atts['category']){
				taxonomy = "&taxonomy=" + ostk_getTaxonomy(atts['category']);
				sortOption = (ostk_isset(atts['sort_by']) ? "&sortOption=" + ostk_getSortOption(atts['sort_by']) : '');
				if (ostk_isset(taxonomy) && ostk_getTaxonomy(atts['category']) == false) {
					error = "category="+atts['category']+" does not match our given categories, please check it.";
				} 
			}else if(atts['keywords']){
				keywords = "keywords=" + str_replace(' ', '%20', atts['keywords']);
			}else {
				error = "Some required fields are missing, (category or keywords) or (a list of product_ids)";
			}

			this.obj = new ostk_MultiProductData();
			this.obj.limit = atts['number_of_items'];
			if (ostk_isset(product_ids)) {
				this.obj.productIds = product_ids;
				this.initObject();
			}else{
				var query = "https://api.overstock.com/ads/products?developerid=test&"+keywords+taxonomy+sortOption;
				this.obj.query = query;
				this.initObject();
			}
		}

		if(error){
			this.renderHTMLError(error);
		}
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var productList;
		var product;		
		if(this.muliProduct){
			productList = this.obj.productList;
		}else{
			product = this.obj;
			productList = product.getArrayOfAllProductImages();
		}

		if(atts['number_of_items'] !== null){
			productList = ostk_limitArrayCount(productList, atts['number_of_items']);
		}

		output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>';
	        output += '<div class="ostk-element-inner">';
				output += '<div class="ostk-flexslider">';
					output += '<ul class="slides">';

						if(this.muliProduct){
							for(var i = 0 ; i < productList.length ; i++){
								var product = productList[i];
								productImg = product.getImage_Large();
								output += this.getCarouselListItems(product, productImg);
							}//foreach
						}else{
							for(var i = 0 ; i < productList.length ; i++){
								var productImg = productList[i];
								output += this.getCarouselListItems(product, productImg);
							}//foreach
						}

					output += '</ul>';
				output += '</div>';

				if(productList.length > 1){
					//only show thumbnail navigation if more than 1 item
					output +=  '<div class="custom-navigation count-'+productList.length+'">';
						output += '<a href="#" class="flex-prev">';
							output += '<div class="ostk-arrow ostk-arrow-left"></div>';
						output += '</a>';
						output += '<a href="#" class="flex-next">';
							output += '<div class="ostk-arrow  ostk-arrow-right"></div>';
						output += '</a>';
						output += '<div class="custom-controls-container"></div>';
					output += '</div>';
				}
			output += '</div><!-- ostk-element-inner -->';
		output += '</div><!-- ostk-element -->';

		var img_count = 0;

		output = $ostk_jQuery(output);

		if(this.obj.multiImages){
			img_count = this.obj.arrayOfAllProductImages.length;
		}else{
			if(this.muliProduct){
				img_count = this.obj.productList.length;
			}
		}

		if(img_count > 1){
			this.loadCarousel(output);
		}
		this.renderHTML(output);
		this.resizeCarousel(output);

		$ostk_jQuery(window).resize(function() {
		    clearTimeout(window.resizedFinished);
		    window.resizedFinished = setTimeout(function(){
				this.resizeCarousel(output);
		    }, 250);
		});
	}//generateHtml

	this.getCarouselListItems = function(product, productImg){
		var output = '';
		output += '<li data-thumb="'+productImg+'">';
			output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
			    output += '<div class="element-content">';
					output += '<img src="'+productImg+'"/>';
				output += '</div>';
			    output += '<div class="element-overlay">';
						output += '<p class="title">'+product.getName()+'</p>';
						if(product.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+product.getPrice()+'</p>';
						output += '<img class="ostk-logo" src="'+ostk_api_url+'images/overstock-logo.png">';
				output += '</div>';
			output += '</a>';
		output += '</li>';
		return output;
	};//getCarouselListItems

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

	this.init();
}//ostk_Skyscraper

function ostk_SampleData(atts, element){
	/*
	Sample Widget: takes productId returns ProductData object
	*/
	ostk_Element.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		atts = ostk_shortcode_atts(
		{
			'id': ''
		}, atts);

		this.obj = new ostk_SingleProductData(atts['id']);
		this.obj.productId = this.atts['id'];

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		output += '<p>The name is <strong>'+this.obj.getName()+'</strong></p><br/>';
		output += '<p>The price is <strong>'+this.obj.getPrice()+'</strong></p><br/>';
		output += '<p>The rating (as decimal is) <strong>'+this.obj.getAverageReviewAsDecimal()+'</strong></p><br/>';
		output += '<p>The rating (as gif is)... see below</p><br/>';
		output += '<img src= "'+this.obj.getAverageReviewAsGif()+'"/><br/>';
		output += '<p> <strong>Large image:</strong></p><br/>';
		output += '<a href="'+this.obj.getAffiliateUrl()+'"><img src= '+this.obj.getImage_Large()+' /></a><br/>';
		output += '<p> <strong>Medium image:</strong></p><br/>';
		output += '<a href="'+this.obj.getAffiliateUrl()+'"><img src= '+this.obj.getImage_Medium()+' /></a><br/>';
		output += '<p> <strong>Small image:</strong></p><br/>';
		output += '<a href="'+this.obj.getAffiliateUrl()+'"><img src= '+this.obj.getImage_Thumbnail()+' /></a><br/>';
		output += '<p>The url link is <a href="'+this.obj.getAffiliateUrl()+'"><strong>here, click me!</strong></a></p><br/>';
		output += '<p>Also, all photos are clickable.<p><br/>';
		this.renderHTML(output);
	};//generateHtml

	this.init();
}//ostk_SampleData

function ostk_Stockphoto(atts, element){
	/* 
	Skyscraper: Lets you create a skyscraper banner for up to three products
	*/
	ostk_Element.call(this, atts, element);

	// Init Element
	this.initElement = function(){
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

	    this.obj = new ostk_SingleProductData();
	    this.obj.productId = atts['id'];
		this.obj.multiImages = true;

	  //   item.init(
	  //   	//Success
	  //   	function(){
			// 	if(atts['image_number'] <= item.arrayOfAllProductImages.length){
			// 		output = ostk_generateStockPhotoHtmlOutput(item, atts);
			// 		_this.renderHTML(output);
			// 	}else{
			// 		var imageNumberError = 'Image number '+atts['image_number']+' is not available.';
			// 		if(item.arrayOfAllProductImages.length > 1){
			// 			imageNumberError += ' Image numbers from 1 to '+ item.arrayOfAllProductImages.length +' are available.';
			// 		}else{
			// 			imageNumberError += ' This image only has 1 available image.';
			// 		}
			// 		imageNumberError += ' Please change the image_number attribute and try again';
			// 		_this.renderHTMLError(imageNumberError);
			// 	}
	  //   	},
			// //Error
			// function(error){
			// 	_this.renderHTMLError(error);
			// }
	  //   );

		this.initObject();
	};//initElement


	// Generate Html
	this.generateHtml = function(){
		var output = '';
		output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(atts)+'>';
			output += '<div class="ostk-element-inner">';
				output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
				    output += '<div class="element-content">';
						output += '<img src="'+this.obj.getImageAtIndex(atts['image_number']-1)+'" width="'+atts['width']+'" height="'+atts['height']+'" style="'+atts['custom_css']+'">';
						output += '</div>';
					    output += '<div class="element-overlay">';
						    output += '<div class="element-content">';
								output += '<p class="title">'+this.obj.getName()+'</p>';
								if(this.obj.averageReviewAsGif){
									output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
								}
								output += '<p class="price">'+this.obj.getPrice()+'</p>';
								output += '<img class="ostk-logo" src="'+ostk_api_url+'images/overstock-logo.png">';
						output += '</div>';
					output += '</div>';
				output += '</a>';
			output += '</div><!-- ostk-element-inner -->';
		output += '</div><!-- ostk-element -->';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_Stockphoto





