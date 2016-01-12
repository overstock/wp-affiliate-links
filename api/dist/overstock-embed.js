/*
==================== Carousel ====================

Class: 			ostk_Carousel
Extends: 		ostk_Widget
Description: 	Lets you create a carousel banner
*/
function ostk_Carousel(){

	// Init Element
	this.initElement = function(){
		if(!ostk_isset(this.atts.number_of_items)){
			this.atts.number_of_items = 10;
		}

		if(this.atts.id){
			this.obj = new ostk_SingleProductData();
			this.obj.multiImages = true;
		}else{
			this.obj = new ostk_MultiProductData();
			this.obj.muliProduct = true;
		}

		var _this = this;
		//TODO: make this call only once
		$ostk_jQuery.getScript( 'https://cdnjs.cloudflare.com/ajax/libs/flexslider/2.6.0/jquery.flexslider.min.js', function( data, textStatus, jqxhr ) {
			_this.initObject();
		});

	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var productList;
		var product;		
		var img_count = 0;
		var _this = this;

		if(this.obj.muliProduct){
			productList = this.obj.productList;
		}else{
			product = this.obj;
			productList = product.arrayOfAllProductImages;
		}

		output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(this.atts)+'>';
	        output += '<div class="ostk-element-inner">';
				output += '<div class="ostk-flexslider">';
					output += '<ul class="slides">';

						if(this.obj.muliProduct){
							for(var i = 0 ; i < productList.length ; i++){
								var product = productList[i];
								productImg = product.imgUrl_large;
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
							output += '<div class="ostk-arrow">';
								output += '<i class="fa fa-chevron-left"></i>';
							output += '</div>';
						output += '</a>';
						output += '<a href="#" class="flex-next">';
							output += '<div class="ostk-arrow">';
								output += '<i class="fa fa-chevron-right"></i>';
							output += '</div>';
						output += '</a>';
						output += '<div class="custom-controls-container"></div>';
					output += '</div>';
				}
			output += '</div>';
		output += '</div>';

		output = $ostk_jQuery(output);

		if(productList.length > 1){
			this.loadCarousel(output);
		}
		this.renderHTML(output);
		this.resizeCarousel(output);

		$ostk_jQuery(window).resize(function() {
		    clearTimeout(window.resizedFinished);
		    window.resizedFinished = setTimeout(function(){
				_this.resizeCarousel(output);
		    }, 250);
		});
	}//generateHtml

	this.getCarouselListItems = function(product, productImg){
		var output = '';
		output += '<li data-thumb="'+productImg+'">';
			output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
			    output += '<div class="ostk-element-content">';
					output += '<img src="'+productImg+'"/>';
				output += '</div>';
			    output += '<div class="element-overlay">';
						output += '<p class="title">'+product.name+'</p>';
						if(product.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+product.price+'</p>';
						output += '<img class="ostk-logo" src="http://ak1.ostkcdn.com/img/mxc/affiliate-embed-widgets-ostk-logo.png">';
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
			if( 
				// The items on either side of the current item will show 
				(index>=(currentSlide-onBothSides) && index<=(currentSlide+onBothSides) ) ||
				// If at the beginning
				(currentSlide < onBothSides && index < itemsPerPage) ||
				// If at the end
				(items.length-currentSlide <= onBothSides && items.length-index <= itemsPerPage) 
			){
				$ostk_jQuery(this).show();
			}else{
				$ostk_jQuery(this).hide();
			}
		});
	};//showThumbnails

}//ostk_Skyscraper

/* 
==================== Leaderboard ====================

Class: 			ostk_Leaderboard
Extends: 		ostk_Widget
Description: 	Lets you create a leaderboard banner for up to two products 
*/
function ostk_Leaderboard(){

	// Init Element
	this.initElement = function(){
		if(this.atts.version === 'mini' || this.atts.version === 'mobile'){
			this.atts.number_of_items = 1;
		}else if(!ostk_isset(this.atts.number_of_items)){
			this.atts.number_of_items = 2;
		}
		this.obj = new ostk_MultiProductData();

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = this.obj.getProductList();
		var output = '';
		var brand_img = 'white';

		if(ostk_isset(this.atts.event)){
			var eventName = this.atts.event.split(' ').join('-').toLowerCase();
			if(this.atts.event == 'flash_deals'){
				brand_img = 'flash-deals';
			}
		}

		if(productList[0].dealEndTime){
			this.obj.dealEndTime = productList[0].dealEndTime;
		}

		output += '<div class="item-holder item-count-'+productList.length+'">';
			for(var i = 0 ; i < productList.length ; i++){
				var product = productList[i];

			    output += '<div class="ostk-item">';
				    output += '<div class="ostk-element-content">';
						output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
							output += '<img class="product-image" src="'+product.imgUrl_large+'"/>';

						    output += '<div class="product-info">';
								output += '<p class="title">'+product.name+'</p>';

								if(ostk_isset(this.atts.event)){
									output += '<hr>';
								}else{
									if(this.atts.version !== 'mini' && this.atts.version !== 'mobile'){
										output += '<p class="description">'+product.description+'</p>';
									}
									if(product.averageReviewAsGif){
										output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
									}
								}
								if(product.price){
									output += '<p class="price">$'+product.price+'</p>';
								}
								if(product.percentOff){
									output += '<p class="savings">'+product.percentOff+'% OFF</p>';
								}
							output += '</div>';
						output += '</a>';
				output += '</div>';

			output += '</div>';
			}//for
		output += '</div>';

		if(this.atts.event == 'flash_deals' && this.atts.version == 'mini'){
			output += '<div class="dealEndTime"></div>';
		}

		output += '<div class="ostk-element-footer">';
			if(this.atts.event == 'flash_deals'){
    			output += this.getBranding('flash-deals');
				if(this.atts.version !== 'mini' && this.atts.version !== 'mobile'){
					output += '<div class="dealEndTime"></div>';
				}
    			output += this.getBranding();
			}else if(this.atts.event == 'sales' || this.atts.event == 'promotions'){
    			output += this.getBranding();
			}else{
    			output += this.getBranding('white');
			}
		output += '</div>';

		this.renderElement(output);
	}//generateHtml

}//ostk_Leaderboard

/* 
==================== Link ====================

Class: 			ostk_Link
Extends: 		ostk_Widget
Description: 	Lets you create links to any overstock page
				Specify the link_text with the link_text attribute
				Generate a link to a predefined page on Overstock.com
*/
function ostk_Link(){

	// Generate Html
	this.initElement = function(){
		var output = '';
		var link_text = ostk_isset(this.atts.link_text) ? this.atts.link_text : 'A link to Overstock.com';
		var affiliateLink = ostk_generateAffiliateLink(this.atts.url);

		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(this.atts)+'>'+link_text+'</a>';

		this.renderHTML(output);
	};//initElement

}//ostk_Link

/* 
==================== Product Details Link ====================

Class: 			ostk_ProductDetailsLink
Extends: 		ostk_Widget
Description: 	Allow users to create easy links to products they are showcasing
*/
function ostk_ProductDetailsLink(){

	// Generate Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();

		this.generateHtml();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
				switch (this.atts.display) {
					case 'name':
						output = this.obj.name;
						break;
					case "price":
						output = this.obj.price;
						break;
					case 'description':
						output = this.obj.description;
						break;
				}//switch
		output = '<a href="'+this.obj.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(this.atts)+'>'+output+'</a>';
		this.renderHTML(output);
	}//generateHtml

}//ostk_ProductLink

/* 
==================== Rectangle ====================

Class: 			ostk_Rectangle
Extends: 		ostk_Widget
Description: 	Lets you create a rectangular banner for a SINGLE product
*/
function ostk_Rectangle(){

	// Init Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var product_name = '';

		output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';

			output += '<div class="dealEndTime"></div>';

			output += '<div class="ostk-element-content">';
				output += '<img src="'+this.obj.imgUrl_large+'" class="product-image"/>';
				if(ostk_isset(this.atts.event)){
					//Sales Event
					output += '<div class="product-info">';
						output += '<p class="title">'+this.obj.name+'</p>';

						if(this.atts.event == 'flash_deals'){
							output += '<hr>';
							if(ostk_isset(this.obj.price)){
								output += '<p class="price">$'+this.obj.price+'</p>';
							}
						}else{
							output += '<p class="description">'+this.obj.discountMsg+'</p>';
							output += '<p class="savings">'+this.obj.percentOff+'% OFF</p>';
						}

					output += '</div>';
				}
			output += '</div>';

			if(!ostk_isset(this.atts.event)){
				output += '<div class="element-overlay">';
				    output += '<div class="ostk-element-content">';
						output += '<p class="title">'+this.obj.name+'</p>';
						if(this.obj.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
						}
						if(ostk_isset(this.obj.price)){
							output += '<p class="price">$'+this.obj.price+'</p>';
						}
					output += '</div>';
				output += '</div>';
			}
		output += '</a>';

		this.renderElement(output);

	}//generateHtml

}//ostk_Reactagngle

/* 
==================== Search Query ====================

Class: 			ostk_SearchQuery
Extends: 		ostk_Widget
Description: 	Takes you to search results page
				Generate a link to a search results page
				Query is link text if link_text parameter is empty
*/
function ostk_SearchQuery(){

	// Generate Html
	this.initElement = function(){
		var output = '';
		var keywords = (ostk_isset(this.atts.query) ? "keywords=" + this.atts.query.split(" ").join("%20") : null);
		var taxonomy = '';
		var taxonomyParam = '';
		var error = null;
		var sortOption = '';
		var link_text = this.atts.link_text;

		if(!error){
			if(keywords == null) {
				error = '"query" parameter cannot be empty.';
			}
		}

		if(error){
			if(ostk_isset(this.atts.category)){
				taxonomyParam = ostk_getTaxonomy(this.atts.category);
				if(!taxonomyParam){
					error = '"category" not found. Please check spelling and try again.';
				} else {
					taxonomy = "&taxonomy=" + taxonomyParam; 
				}
			}
		}

		if(error){
			if(ostk_isset(this.atts.sort_by)){
				sortOptionParam = ostk_getSortOption(this.atts.sort_by);
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
			link_text = (this.atts.link_text != null ? this.atts.link_text : this.atts.query);
			output = '<a href="'+affiliateLink+'" class="ostk-element ostk-search" '+ostk_getLinkTarget(this.atts)+'>'+link_text+'</a>';
			this.renderHTML(output);
		}
	};//initElement

}//ostk_SearchQuery

/* 
==================== Skyscraper ====================

Class: 			ostk_Skyscraper
Extends: 		ostk_Widget
Description: 	Lets you create a skyscraper banner for up to three products
*/
function ostk_Skyscraper(){

	// Init Element
	this.initElement = function(){
		if(!ostk_isset(this.atts.number_of_items)){
			this.atts.number_of_items = 2;
		}
		this.obj = new ostk_MultiProductData();
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = Array();
		var output = '';
		var product_name = '';

		productList = this.obj.getProductList();

		if(productList[0].dealEndTime){
			this.obj.dealEndTime = productList[0].dealEndTime;
		}

		output += '<div class="dealEndTime"></div>';

		output += '<div class="item-holder item-count-'+productList.length+'">';
			for(var i = 0 ; i < productList.length ; i++){
			    var product = productList[i];
			    output += '<div class="ostk-element-content">';
					output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
						output += '<img class="product-image" src="'+product.imgUrl_large+'"/>';

						output += '<div class="product-info">';

							output += '<p class="title">'+product.name+'</p>';

							if(ostk_isset(this.atts.event)){
								output += '<hr>';
							}else {
								if(product.averageReviewAsGif){
									output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
								}
							}

							if(!ostk_isset(this.atts.event) || this.atts.event == 'flash_deals'){
								if(ostk_isset(product.price)){
									output += '<p class="price">$'+product.price+'</p>';
								}
							}

						output += '</div>';
					output += '</a>';
				output += '</div>';
			}//for
		output += '</div>';

		this.renderElement(output);

	}//generateHtml

}//ostk_Skyscraper

/* 
==================== Stock Photo ====================

Class: 			ostk_Stockphoto
Extends: 		ostk_Widget
Description: 	Lets you create an image link to a product page (stock photo)
				Allow users to add stock photos to their posts (and get paid for it)
*/
function ostk_StockPhoto(){

	// Init Element
	this.initElement = function(){
		if(!ostk_isset(this.atts.image_number)){
			this.atts.image_number = 1;
		}

		if(ostk_isset(this.atts.id)){
		    this.obj = new ostk_SingleProductData();
			this.obj.multiImages = true;
		}else{
		    this.obj = new ostk_MultiProductData();
		}
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var error = null;

		if(this.atts.image_number){
			var a;
			if(this.obj.productList){
				a = this.obj.productList;
			}else{
				a = this.obj.arrayOfAllProductImages;
			}

			if(a.length < this.atts.image_number){
				error = 'Image number '+this.atts.image_number+' is not available.';
				if(a.length > 1){
					error += ' Image numbers from 1 to '+ a.length +' are available.';
				}else{
					error += ' This image only has 1 available image.';
				}
				error += ' Please change the image_number attribute and try again';
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			var product;
			if(this.obj.productList){
				product = this.obj.productList[this.atts.image_number-1];
			}else{
				product = this.obj;
			}
			output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(this.atts)+'>';
				output += '<div class="ostk-element-inner">';
					output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
					    output += '<div class="ostk-element-content">';
							output += '<img src="'+product.imgUrl_large+'" width="'+this.atts.width+'" height="'+this.atts.height+'" style="'+this.atts.custom_css+'"  class="product-image">';
							output += '</div>';
						    output += '<div class="element-overlay">';
							    output += '<div class="ostk-element-content">';
							    	if(product.name){						    		
										output += '<p class="title">'+product.name+'</p>';
							    	}
									if(product.averageReviewAsGif){
										output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
									}
									if(product.price){
										output += '<p class="price">'+product.price+'</p>';
									}
									output += '<img class="ostk-logo" src="http://ak1.ostkcdn.com/img/mxc/affiliate-embed-widgets-ostk-logo.png">';
							output += '</div>';
						output += '</div>';
					output += '</a>';
				output += '</div>';
			output += '</div>';

			this.renderHTML(output);
		}

	}//generateHtml

}//ostk_StockPhoto

/*
==================== Widget ====================

Class: 			ostk_Widget
Description: 	This is the base class for widgets. All widgets extend this class
*/
function ostk_Widget(atts, element){
	this.atts = atts;
	this.element = element;

	//Init
	this.init = function(){
		var error = null;
		if(!ostk_isset(ostk_developerId)){
			error = "LinkShare ID needs to be authenticated."; 
		}

		if(!error){
			if(this.atts.type == '' || this.atts.type == null){ 
				error = "Type parameter cannot be empty.";
			}else if(ostk_isset(this.atts.link_target) && !ostk_isValidLinkTarget(this.atts)){ 
				error = '"link_target" not found. Please check spelling and try again.';
			}
		}

		if(!error){
			var areAttsValid = ostk_areAttributesValid(this.atts)
			if(areAttsValid !== true){
				error = areAttsValid;
			}
		}

		if(!error){
			var regex = /^[1-9]\d*(px|%)/i;
			if(ostk_isset(this.atts.width) && !regex.exec(this.atts.width)){
				error = "Width requires % or px, and a value greater than 0.";
			}
		}

		if(!error){
			if(ostk_isset(atts.number_of_items)){
				if(String(atts.number_of_items) == '0'){
					error = '"number_of_items" parameter must be at least 1.';
				}
			}			
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			this.initElement();
		}
	};//init

	// Init Object
	this.initObject = function(){
		var error = null;

		if(ostk_isset(this.atts.number_of_items)){
			this.obj.limit = parseInt(this.atts.number_of_items);
		}else{
			this.obj.limit = 10;
		}

		if(this.atts.id){
			this.obj.productId = this.atts.id;
		}else if(this.atts.product_ids){
			this.obj.productIds = this.atts.product_ids;
		}else if(this.atts.event){
			this.obj.query = ostk_getEventQuery(this.atts.event);
			if(!this.obj.query){
				error = 'Invalid query attribute';
			}
		}else if(this.atts.category || this.atts.keywords){
			var taxonomy = '';
			var sortOption = '';
			var keywords = '';
			if(this.atts.category){
				taxonomy = "&taxonomy=" + ostk_getTaxonomy(this.atts.category);
				sortOption = (ostk_isset(this.atts.sort_by) ? "&sortOption=" + ostk_getSortOption(this.atts.sort_by) : '');
				if (ostk_isset(taxonomy) && ostk_getTaxonomy(this.atts.category) == false) {
					error = "category="+this.atts.category+" does not match our given categories, please check it.";
				} 
			}else if(this.atts.keywords){
				keywords = "&keywords=" + this.atts.keywords.split(' ').join('%20');
			}
			this.obj.query = "https://api.overstock.com/ads/products?developerid="+ostk_developerId+keywords+taxonomy+sortOption;
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			var _this = this;
			this.obj.init(
				//Success
				function(){
					_this.generateHtml();
				},
				// Error
				function(error){
					_this.renderHTMLError(error);
				}
			);
		}
	};//initObject

	//Set flash_deals Timer
	this.setFlashDealsTimer = function(obj){
		// var t = new Date();
		// t.setSeconds(t.getSeconds() + 5);
		// this.obj.dealEndTime = t;

		var _this = this;
		var timeDiff = ostk_getTimeDiff(this.obj.dealEndTime)

		obj.html(this.timeDiffToString(timeDiff));
		var flashDealsTimer = setInterval(function(){
			if(timeDiff <= 1000){
				clearInterval(flashDealsTimer);
				_this.initObject();
			}else{
				timeDiff -= 1000;
				obj.html(_this.timeDiffToString(timeDiff));
			}
		}, 1000, true);
	};//setFlashDealsTimer

	// Time Difference to String
	this.timeDiffToString = function(timeDiff){
		var msec = timeDiff;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		if(this.atts.type === 'skyscraper' || this.atts.type === 'leaderboard'){
			return '' + 
			'<div class="double-line">' + 
				'<p class="deliminators">' +
					'<span>:</span>' +
					'<span>:</span>' +
				'</p>' +
				'<p class="top-line">' +
					'<span>'+ostk_make_two_digits(hh)+'</span>' +
					'<span>'+ostk_make_two_digits(mm)+'</span>' +
					'<span>'+ostk_make_two_digits(ss)+'</span>' +
				'</p>' +
				'<p class="bottom-line">' +
					'<span>HR</span>' +
					'<span>MIN</span>' +
					'<span>SEC</span>'
				'</p>' +
			'</div>';	
		}else{
			return '' + 
			'<div class="single-line">' + 
				'<p class="single-line">'+ostk_make_two_digits(hh) + ' <span>HR</span> : ' + ostk_make_two_digits(mm) + ' <span>MIN</span> : ' + ostk_make_two_digits(ss) + ' <span>SEC</span>' + '</p>' +
			'</div>';	
		}
	}//timeDiffToString

	//Get Branding
	this.getBranding = function(brand){
		var output = '';
		var img_url = '';		

		if(!ostk_isset(brand)){
			brand = 'overstock';
		}

		switch(brand){
			case 'flash-deals':
				img_url = 'affiliate-embed-widgets-flash-deals-logo.png';		
				break;
			case 'white':
				img_url = 'affiliate-embed-widgets-ostk-logo-white.png';		
				break;
			default:
				img_url = 'affiliate-embed-widgets-ostk-logo.png';		
		}//switch

		output = '<div class="branding">';
			output += '<img src="http://ak1.ostkcdn.com/img/mxc/'+img_url+'"/>';
		output += '</div>';

		return output;
	};//getBranding

	this.renderElement = function(elment_contents){
		var output = '';
		var eventClass = '';
		var styles = '';

		if(ostk_isset(atts.version)){
			eventClass += ' '+atts.version;
		}
		if(ostk_isset(atts.event)){
			var eventName = atts.event.split(' ').join('-').toLowerCase();
			eventClass += ' sales-event '+eventName.split('_').join('-');
		}else{
			styles = ostk_getStyles(atts);
		}

		output += '<div class="ostk-element ostk-'+atts.type+' '+eventClass+'" '+styles+'>';
			output += '<div class="ostk-element-inner">';

				if(atts.type !== 'leaderboard'){
					output += '<div class="ostk-element-header">';
						if(ostk_isset(atts.event) && atts.event === 'flash_deals'){
							output += this.getBranding('flash-deals');
						}else{
							output += this.getBranding('white');
						}
					output += '</div>';
				}

				output += elment_contents;

				if(atts.type !== 'leaderboard'){
					if(ostk_isset(atts.event) && atts.event === 'flash_deals'){
						output += '<div class="ostk-element-footer">';
			    			output += this.getBranding();
						output += '</div>';
					}
				}
										
			output += '</div>';
		output += '</div>';

		output = $ostk_jQuery(output);

		if(ostk_isset(atts.event)){
			if(atts.event == 'flash_deals'){
				this.setFlashDealsTimer(output.find('.dealEndTime'));
			}
		}

		this.renderHTML(output);
	};//renderElement


	//Render HTML
	this.renderHTML = function(data){
		data = $ostk_jQuery(data);
		this.element.fadeOut('slow');
		this.element.replaceWith(data);
		this.element = data;
		data.hide();
		data.fadeIn('slow');
	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){
		this.renderHTML(ostk_formatError(data));
	};//renderHTMLError
}//ostk_Widget

function ostk_searchURLForParam(url, str){
	if(url.indexOf("?") > -1 && url.indexOf(str)){
		var params = url.split('?')[1];
		var param_items = params.split('&');
		for(var k = 0 ; k < param_items.length ; k++){
			var param_pieces = param_items[k].split('=');
			var key = param_pieces[0];
			var value = param_pieces[1];
			if(key == str){
				return value 
				break;
			}
		}//for
	}
	return null;
}//ostk_searchURLForParam

function ostk_getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}//ostk_getRandomInt

function ostk_addTrackingToUrl(url){
	return url + '&clickplatform='+ostk_clickPlatform + '&clickurl='+ostk_clickurl;
};//ostk_addTrackingToUrl

function ostk_getTimeDiff(dealEndTime){
	var endTime = new Date(dealEndTime);
	var currentTime = new Date();
	return endTime - currentTime;
}//ostk_getTimeDiff

function ostk_make_two_digits(int){
	if(int < 10){
		return '0' + int;
	}else{
		return int;
	}
}//ostk_make_two_digits

function ostk_generateAffiliateLink(murl){
	var symbol = '?';
	if(murl.indexOf("?") > -1){
		symbol = '&';
	}
	return 'https://api.overstock.com/ads/deeplink?id='+ostk_developerId+'&mid=38601&murl='+encodeURIComponent(murl+symbol+"utm_medium=api&utm_source=linkshare&utm_campaign=241370&CID=241370&devid="+ostk_developerId);
}//ostk_generateAffiliateLink

function ostk_getTaxonomy(input){
	if(input == null) { 
		return false;
	} else {
		switch (input) {
			case "Home & Garden":
			  return "sto1";
			  break;
			case "Jewelry & Watches":
			  return "sto4";
			  break;
			case "Sports & Toys":
			  return "sto5";
			  break;
			case "Worldstock Fair Trade":
		      return "sto6";
		      break;
		    case "Clothing & Shoes":
		      return "sto7";
		      break;
		    case "Health & Beauty":
		      return "sto8";
		      break;
		    case "Food & Gifts":
		      return "sto9";
		      break;
		    case "Office Supplies":
		      return "sto22";
		      break;
		    case "Luggage & Bags":
		      return "sto33";
		      break;
		    case "Baby":
		      return "sto35";
		      break;
		    case "Crafts & Sewing":
		      return "sto34";
		      break;
		    case "Pet Supplies":
		      return "sto37";
		      break;
		    case "Emergency Preparedness":
		      return "sto42";
		      break;
		    case "Bedding & Bath":
		      return "sto43";
		      break;
		    default:
		      return false;
		}//switch
	}
}//ostk_getTaxonomy
	
function ostk_checkTaxonomy(input, taxonomy) {
	input = strtolower(input);
	taxonomy = strtolower(taxonomy);
	if (taxonomy == input) { 
		return true; 
	}
	taxonomyArray = explode(' ', taxonomy);
	if(in_array('&', taxonomyArray)) { 
		unset(taxonomyArray[1]); 
	}
	for(var i = 0 ; i < taxonomyArray.length ; i++){
	  if(taxonomyArray[i] == input) {
	  	return true;
	  }	
	}//for
	return false;
}//ostk_checkTaxonomy

function ostk_getSortOption(input){
	switch (input.toLowerCase()) {
		case "Relevance".toLowerCase():
			return "Relevance";
			break;
		case "Recommended".toLowerCase():
			return "Recommended";
			break;
		case "Reviews".toLowerCase():
			return "Avg.%20Customer%20Review";
			break;
		case "Name".toLowerCase():
			return "Name";
			break;
		case "Lowest Price".toLowerCase():
			return "Lowest+Price";
			break;
		case "Highest Price".toLowerCase():
			return "Highest+Price";
			break;
		case "New Arrivals".toLowerCase():
			return "New+Arrivals";
			break;
		default:
			return null;
	}//switch
}//ostk_getSortOption

function ostk_getEventQuery(event){
	var query = ostk_findObjWhereKeyEqualsValue(event_list, 'event', event);
	if(query){
		return query.url;
	}else{
		return null;
	}
}//ostk_getEventQuery

function ostk_stringToList(str){
	str = str.split(' ').join(','); //Replace spaces with commas
	str = str.split(',,').join(','); //If the above replace caused ",," just make it 1 comma
	return str.split(',');
}//ostk_stringToList

function ostk_formatError(str){
	return '<p class="ostk-error">ERROR: '+str+'</p>';
}//ostk_formatError

function ostk_checkDeveloperId(){
	return (ostk_isset(ostk_developerId) ? true : false);
}//ostk_checkDeveloperId

function ostk_limitArrayCount(product_ids, num){
	if(typeof product_ids === 'string'){
		product_ids = ostk_stringToList(product_ids);
	}

	if(product_ids.length > num){
		return product_ids.splice(0, num);
	}else{
		return product_ids;
	}
}//ostk_limitArrayCount

/*
Validate that the shortcode attributes are valid. return Boolean.
*/
function ostk_areAttributesValid(atts){
	var error = null;
	var type = atts.type;

	if(!type){
		error = 'Type attribute is required';
	}

	if(!error){
		var keys = ostk_getKeyList(atts);
		var item = ostk_patterns[type];
		if(!item){
	    	error = 'Invalid type attribute';
		}else{
			var required_attributes = item['required_attributes'];
			var optional_attributes = item['optional_attributes'];
		}
	}

	//Fail if missing any required attributes
	if(!error){
		var missingRequiredAtts = ostk_lookForMissingRequiredAttributes(atts, required_attributes);
		if(missingRequiredAtts.length > 0){
			error = 'Missing required attributes: ' + ostk_array_to_list_string(missingRequiredAtts, '&');
		}
	}

	//Fail if using undefined attributes, null values, or a value that is not an option
	if(!error){
		var invalidExtraAtts = ostk_lookForInvalidAtts(atts, required_attributes, optional_attributes);
		if(invalidExtraAtts.length > 0){
			error = 'The following are not valid attributes: ' + ostk_array_to_list_string(invalidExtraAtts, '&');
		}
	}

	if(error){
		return error;
	}else{
		return true;
	}

}//areAttributesValid

/* Return an array of the required attributes that are missing.
(ostk_areAttributesValid - helper function) */
function ostk_lookForMissingRequiredAttributes(atts, required_attributes){
	var missing_atts = Array();
	//Loop through required attributes
	for (var i = 0 ; i < required_attributes.length; i++) {
		var ra = required_attributes[i];
		var key = ra['name'];
		if(!atts[key]){
			//if the missing attribute has options that are objects
			if(ra['options'] && typeof(ra['options'][0]['name']) != 'undefined'){
				var option_fulfilled = false;
				//Loop through missing attributes' options
				for(var k = 0 ; k < ra['options'].length ; k++){
					var option_key = '';
					option_key = ra['options'][k]['name'];
					if(atts[option_key]){
						option_fulfilled = true;
					}
				}//for
				if(!option_fulfilled){
					//None of the options where fullfilled
					var missing_options_list = ostk_getListByKey(ra['options'], 'name');
					var missing_options_string = ostk_array_to_list_string(missing_options_list, 'or');
					missing_atts.push('(' +  missing_options_string + ')');
				}
			}else{
				//Missing attribute doesn't have options so push it ot the missing array
				missing_atts.push(key);
			}
		}
	}//for
	return missing_atts;
}//ostk_lookForMissingRequiredAttributes

/* Return an array of attributes that are not either in the list of required or optional attributes
(ostk_areAttributesValid - helper function) */
function ostk_lookForInvalidAtts(keys, required_attributes, optional_attributes){
	var invalid_atts = Array();
	var array = $ostk_jQuery.merge($ostk_jQuery.merge([], optional_attributes), required_attributes);
	invalid_atts = ostk_lookForInvalidAttsInArray(keys, array);
	return ostk_getKeyList(invalid_atts);
}//ostk_lookForInvalidAtts

/* Return an array of attributes that are not in a given list
used for both require and optional att arrays */
function ostk_lookForInvalidAttsInArray(keys, array){
	var invalid_atts = {};
	//Loop through keys

	for(var key in keys){
		//not valid until finding that the key in the array 
		var value = keys[key];
		var is_valid = false;

		for(var k = array.length-1 ; k >= 0 ; k--){
			var a = array[k];
			var a_key = a['name'];
			//if the attribure has options dig deeper
			if(a['options']){
				if(a['options'][0]['name']){
					//options are objects not just strings
					for(var z = 0 ; z < a['options'].length ; z++){
						var a_op = a['options'][z];	
						var a_op_key = a_op['name'];	
						if(key === a_op_key){
							is_valid = true;
							break;
						}
					}//for
				}else{
					//options are just strings
					if(key === a_key){
						var found_it = false;
						for(var z = 0 ; z < a['options'].length ; z++){
							var a_op_key = a['options'][z];
							if(value === a_op_key){
								found_it = true;
								break;
							}
						}//for	
						if(found_it){
							is_valid = true;
							break;
						}else{
							is_valid = false;
						}
					}
				}
			}else{
				// att does not have options
				if(key === a_key){
					is_valid = true;
					break;
				}
			}
		}//for

		if(!is_valid){
			invalid_atts[key] = value;
			array.splice(k, 1);
		}
	}//for
	return invalid_atts
}//ostk_lookForInvalidAttsInArray

/* Return all keys of an object as an array
(ostk_areAttributesValid - helper function) */
function ostk_getKeyList(obj){
	var array = Array();
	for(var key in obj){
		array.push(key);
	}//for
	return array;
}//ostk_getKeyList

/* Iterate throught an array and return an array of the values of a specific keys
(ostk_areAttributesValid - helper function) */
function ostk_getListByKey(obj, key){
  var array = Array();
  for(var i = 0 ; i < obj.length ; i++){
  	var item = obj[i];
    array.push(item[key]);
  }//foreach
  return array;
}//ostk_getKeyList

/* Iterate throught an array and return the first item that has a specific key with a specific value
(ostk_areAttributesValid - helper function) */
function ostk_findObjWhereKeyEqualsValue(obj, key_1, value_1){
  for(var i = 0 ; i < obj.length ; i++){
  	var item = obj[i];
    if(item[key_1] == value_1){
      return item;
    }
  }//for
  return null;
}//findObjWhereKeyEquals

function ostk_getStyles(atts){
	var output = '';
	if(ostk_isset(atts.width)){
		output = 'width:'+atts.width+';';
	}
  return 'style="'+output+'"';
}//ostk_getStyles

function ostk_isValidLinkTarget(atts){
	switch(atts.link_target){
	  case 'new_tab':
	  case 'current_tab':
			return true;
	  default:
			return false;
	}//switch
}//ostk_isValidLinkTarget

function ostk_getLinkTarget(atts){
  var output = '_blank';
	if(atts.link_target){
		switch(atts.link_target){
		  case 'current_tab':
		    output = '_self';
		    break;
		}//switch
	}
	return "target='"+output+"'";
}//ostk_getLinkTarget

/* Check if defined or not link php ostk_isset() */
function ostk_isset(item){
	if(item == null){
		return false;
	}else if(typeof item === "undefined"){
		return false;
	}else{
		return true;
	}
}//ostk_isset

/* check to see if key exists like php array_key_exists() */
function ostk_array_key_exists(key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }
  return key in search;
}//ostk_array_key_exists

/* Return a string given an array that is comma seperated with an or clause */
function ostk_array_to_list_string(a, deliminator){
  switch(a.length){
    case 0:
      return '';
    case 1:
      return a[0];
    case 2:
      return a.join(' '+deliminator+' ');
    default:
      return a.slice(0, a.length-1).join(', ') + ', '+deliminator+' ' + a[a.length-1];
  }//switch
}//ostk_array_to_and_list_string

// Only load the plugin if it hasn't already been loaded. 
// Widget embeds might include the script tag multiple times.
if(typeof(ostk_plugin) == 'undefined'){
	var ostk_developerId = null;

	if(!ostk_isset(ostk_clickPlatform)){
		var ostk_clickPlatform = 'embed';
	}

	var ostk_clickurl = window.location.href;

	var ostk_api_url = 'https://rawgithub.com/overstock/wp-affiliate-links/master/api/';

	var scripts = document.getElementsByTagName('script');

	for(var i = 0 ; i < scripts.length ; i++){
		if(scripts[i].src.indexOf("overstock-embed") > -1){
			var id_value = ostk_searchURLForParam(scripts[i].src, 'id');
			if(id_value){
				ostk_developerId = id_value;
			}
		}	
	}//for

	var ostk_url = 'https://api.overstock.com';
	if(
		typeof(os) !== 'undefined' && 
		typeof(os.Otags) !== 'undefined' && 
		typeof(os.Otags.api_url) !== 'undefined'
	){
		ostk_url = os.Otags.api_url;
	}
	var event_list = [
		{
			'event': 'flash_deals',
			'url': ostk_url+'/ads/products/deals?developerid='+ostk_developerId+'&sort=lowest_price'
		},
		{
			'event': 'promotions',
			'url': ostk_url+'/ads/sales?developerid='+ostk_developerId+'&sale_type=promotion'
		},
		{
			'event': 'sales',
			'url': ostk_url+'/ads/sales?developerid='+ostk_developerId+'&sale_type=sale'
		}
	];

	var ostk_plugin = new ostk_Plugin();
}

var ostk_patterns = ostk_patterns || {};
ostk_patterns["carousel"] = {    "name": "Carousel",    "description": "Lets you create a carousel widget for up to 10 products. You will get the product ids from the product&apos;s URL on Overstock.com.",    "notes": "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008.",    "example_shortcodes": [        {            "type": "carousel",            "category": "Home & Garden",            "width": "400px"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "options": [                {                    "name": "id",                    "description": "Any product id",                    "example": "10234427"                },                {                    "name": "product_ids",                    "description": "A list of product ids separated by commas."                },                {                    "name": "category",                    "description": "Select items from a specific Overstock store.",                    "options": [                        "Home & Garden",                        "Jewelry & Watches",                        "Sports & Toys",                        "Worldstock Fair Trade",                        "Clothing & Shoes",                        "Health & Beauty",                        "Food & Gifts",                        "Office Supplies",                        "Luggage & Bags",                        "Crafts & Sewing",                        "Baby",                        "Pet Supplies",                        "Emergency Preparedness",                        "Bedding & Bath"                    ]                },                {                    "name": "keywords",                    "description": "A keyword search",                    "example": "soccer shoes"                }            ]        }    ],    "optional_attributes": [        {            "name": "number_of_items",            "description": "Choose an item limit. By default it is unlimited.",            "example": "10"        },        {            "name": "sort_by",            "description": "Choose a sort option",            "options": [                "Relevance",                 "Recommended",                "Reviews",                "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "width",            "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",            "default": "100%",            "example": "100%\" or \"300px"        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["leaderboard"] = {    "name": "Leaderboard",    "description": "Lets you create a leaderboard banner for up to two products.",    "notes": [        "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008."    ],    "example_shortcodes": [        {            "type": "leaderboard",            "category": "Home & Garden"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "options": [                {                    "name": "product_ids",                    "description": "A list of product ids separated by commas.",                    "notes": "Required to have 1 or 2 product ids"                },                {                    "name": "event",                    "description": "Sales event elements",                    "options": [                        "flash_deals"                        /*                        ,                        "sales",                        "promotions"                        */                    ]                },                {                    "name": "category",                    "description": "Select items from a specific Overstock store.",                    "options": [                        "Home & Garden",                        "Jewelry & Watches",                        "Sports & Toys",                        "Worldstock Fair Trade",                        "Clothing & Shoes",                        "Health & Beauty",                        "Food & Gifts",                        "Office Supplies",                        "Luggage & Bags",                        "Crafts & Sewing",                        "Baby",                        "Pet Supplies",                        "Emergency Preparedness",                        "Bedding & Bath"                    ]                },                {                    "name": "keywords",                    "description": "A keyword search",                    "example": "soccer shoes"                }            ]        }    ],    "optional_attributes": [        {            "name": "version",            "description": "Different sizes and designs for the leaderboard.",            "default": "standard",            "options": [                "standard",                "mini",                "mobile"            ]        },        {            "name": "sort_by",            "description": "Choose a sort option",            "options": [                "Relevance",                 "Recommended",                "Reviews",                "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "number_of_items",            "description": "Choose an item limit. By default it is unlimited.",            "default": "10"        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["link"] = {    "name": "Link",    "description": "The URL link shortcode lets you create links to any page on Overstock.com.",    "example_shortcodes": [        {            "type": "link",            "url": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"        },        {            "type": "link",            "url": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html",            "link_text": "I want to buy this for my wife"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "name": "url",            "description": "A link to an Overstock page",            "example": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"        }    ],    "optional_attributes": [        {            "name": "link_text",            "description": "The text that will show for the link",            "default": "A link to Overstock.com",            "example": "A present for my wife",            "notes": "If link_text parameter is left blank, the phrase \"A link to Overstock.com\" will be used as the link text."        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["product_link"] = {    "name": "Product Details Link",    "description": "Create simple links for a certain product. Each one will link to the product page on Overstock.com.",    "notes": "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008.",    "example_shortcodes": [        {            "type": "product_link",            "display": "name",            "id": "8859234"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "name": "id",            "example": "10234427",            "description": "Choose an attribute to display"        },        {            "name": "display",            "description": "Choose an attribute to display",            "options": [                "name",                "price",                "description"            ]        }    ],    "optional_attributes": [        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["rectangle"] = {    "name": "Rectangle",    "description": "The rectangle shortcode lets you create a rectangular banner for a SINGLE product.",    "notes": "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008.",    "example_shortcodes": [        {            "type": "rectangle",            "category": "Home & Garden",            "width": "300px"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "options": [                {                    "name": "id",                    "description": "A products id",                    "example": "8231882"                },                {                    "name": "event",                    "description": "Sales event elements",                    "options": [                        "flash_deals"                        /*                        ,                        "sales",                        "promotions"                        */                    ]                },                {                    "name": "category",                    "description": "Select items from a specific Overstock store.",                    "options": [                        "Home & Garden",                        "Jewelry & Watches",                        "Sports & Toys",                        "Worldstock Fair Trade",                        "Clothing & Shoes",                        "Health & Beauty",                        "Food & Gifts",                        "Office Supplies",                        "Luggage & Bags",                        "Crafts & Sewing",                        "Baby",                        "Pet Supplies",                        "Emergency Preparedness",                        "Bedding & Bath"                    ]                },                {                    "name": "keywords",                    "description": "A keyword search",                    "example": "soccer shoes"                }            ]        }    ],    "optional_attributes": [        {            "name": "sort_by",            "description": "Choose a sort option",            "options": [                "Relevance",                 "Recommended",                "Reviews",                "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "width",            "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",            "default": "100%",            "example": "100%\" or \"300px"        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["search"] = {    "name": "Search Query",    "description": "The Search Query shortcode will create a link that will take a user to a Search Results Page on Overstock.com.",    "example_shortcodes": [        {            "type": "search",            "query": "soccer shoes"        },        {            "type": "search",            "query": "soccer shoes",            "link_text": "Overstock has great soccer shoes"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "name": "query",            "description": "Product search terms",            "example": "soccer shoes"        }    ],    "optional_attributes": [        {            "name": "link_text",            "description": "The text that will show for the link",            "default": "query attribute text",            "example": "Click to see these soccer shoes!",            "notes": "The query will be used as the link text if the link_text parameter is empty (i.e. \"soccer shoes\")."        },        {            "name": "category",            "description": "Filter results by store",            "options": [                "Home & Garden",                "Jewelry & Watches",                "Sports & Toys",                "Worldstock Fair Trade",                "Clothing & Shoes",                "Health & Beauty",                "Food & Gifts",                "Office Supplies",                "Luggage & Bags",                "Crafts & Sewing",                "Baby",                "Pet Supplies",                "Emergency Preparedness",                "Bedding & Bath"            ]        },        {            "name": "sort_by",            "description": "Sort results in different ways",            "options": [                "Relevance",                 "Recommended",                "Reviews",                 "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["skyscraper"] = {    "name": "Skyscraper",    "description": "Lets you create a skyscraper banner for up to three products.",    "notes": "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008.",    "example_shortcodes": [        {            "type": "skyscraper",            "category": "Home & Garden",            "width": "160px"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "options": [                {                    "name": "product_ids",                    "description": "A list of product ids separated by commas.",                    "notes": "Required to have 1 or 2 product ids"                },                {                    "name": "event",                    "description": "Sales event elements",                    "options": [                        "flash_deals"                        /*                        ,                        "sales",                        "promotions"                        */                    ]                },                {                    "name": "category",                    "description": "Select items from a specific Overstock store.",                    "options": [                        "Home & Garden",                        "Jewelry & Watches",                        "Sports & Toys",                        "Worldstock Fair Trade",                        "Clothing & Shoes",                        "Health & Beauty",                        "Food & Gifts",                        "Office Supplies",                        "Luggage & Bags",                        "Crafts & Sewing",                        "Baby",                        "Pet Supplies",                        "Emergency Preparedness",                        "Bedding & Bath"                    ]                },                {                    "name": "keywords",                    "description": "A keyword search",                    "example": "soccer shoes"                }            ]        }    ],    "optional_attributes": [        {            "name": "width",            "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",            "default": "100%",            "example": "100%\" or \"300px"        },        {            "name": "number_of_items",            "description": "Choose an item limit. By default it is unlimited.",            "default": "10"        },        {            "name": "sort_by",            "description": "Choose a sort option",            "options": [                "Relevance",                 "Recommended",                "Reviews",                "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        }    ]};
ostk_patterns["stock_photo"] = {    "name": "Stock Photo",    "description": "Use Overstock&apos;s product and lifestyle photos for your blog. Each one will link to its corresponding product page on Overstock.com.",    "notes": "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/9747008/product.html\" has a product ID of 9747008.",    "example_shortcodes": [        {            "type": "stock_photo",            "category": "Home & Garden",            "width": "300px"        }    ],    "required_attributes": [        {            "name": "type"        },        {            "options": [                {                    "name": "id",                    "example": "10234427",                    "description": "Choose an attribute to display"                },                {                    "name": "category",                    "description": "Select items from a specific Overstock store.",                    "options": [                        "Home & Garden",                        "Jewelry & Watches",                        "Sports & Toys",                        "Worldstock Fair Trade",                        "Clothing & Shoes",                        "Health & Beauty",                        "Food & Gifts",                        "Office Supplies",                        "Luggage & Bags",                        "Crafts & Sewing",                        "Baby",                        "Pet Supplies",                        "Emergency Preparedness",                        "Bedding & Bath"                    ]                },                {                    "name": "keywords",                    "description": "A keyword search",                    "example": "soccer shoes"                }            ]        }    ],    "optional_attributes": [        {            "name": "image_number",            "description": "Choose an image number, images are numbered from left to right on the product page, 1,2,3, ect."        },        {            "name": "sort_by",            "description": "Choose a sort option",            "options": [                "Relevance",                 "Recommended",                "Reviews",                "Lowest Price",                 "Highest Price",                 "New Arrivals"            ]        },        {            "name": "width",            "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",            "default": "100%",            "example": "100%\" or \"300px"        },        {            "name": "height",            "description": "Height of the shortcode element. This attribute accepts \"px\"",            "notes": "The height of the image will automatically adjust according to the width. The best practice would be to only set the height if it absolutely necessary .",            "default": "auto",            "example": "300px"        },        {            "name": "link_target",            "description": "Choose how to open the link.",            "default": "new_tab",            "options": [                "new_tab",                 "current_tab"            ]        },        {            "name": "custom_css",            "description": "Add custom CSS to the image element.",            "example": "border:solid 1px red;"        }    ]};
/*
==================== Multi Product Data ====================

Class: 			ostk_MultiProductData
Description: 	Takes a list of product id's or a query and creates a productList array of ostk_SingleProductData objects. 
*/
function ostk_MultiProductData(){
	this.productIds;
	this.limit;
	this.developerId = ostk_developerId;
	this.productList = Array();
	this.error = null;
	this.product_count_down = 0;

	this.init = function(callback, errorCallback) {
		var _this = this;
		if(this.productIds){
			if(this.limit !== null){
				productIds = ostk_limitArrayCount(this.productIds, this.limit);
			}
			this.product_count_down = productIds.length;
			for(var i = 0 ; i < productIds.length ; i++){
				var item = new ostk_SingleProductData();
				item.productId = productIds[i];
				this.createSingleObjects(item, callback, errorCallback);
			}//for
		}else if(this.query){
			if(this.limit !== null){
				this.query += '&limit=' + this.limit;
			}
			this.query = ostk_addTrackingToUrl(this.query);	

			$ostk_jQuery.get( this.query, function( productData ){
				if(productData.products && productData.products.length > 0){
					productData = productData.products;
				}else if(productData.sales && productData.sales.length > 0){
					productData = productData.sales;
				}else{
					this.error = 'No available products for this query';
				}

				if(!this.error){
					_this.product_count_down = productData.length;

					for(var i = 0 ; i < productData.length ; i++){
						var item = new ostk_SingleProductData();
						item.obj =  productData[i];
						_this.createSingleObjects(item, callback, errorCallback);
					}//for
				}else{
					errorCallback(this.error);
				}

			})
			.fail(function(){
				errorCallback('Invalid query');
			});
		}
	}//init

	this.createSingleObjects = function(item, callback, errorCallback){
		var _this = this;
		item.init(
			//Success
			function(the_item){
				_this.productList.push(the_item);
				_this.checkProductCompletion(callback, errorCallback);

				//Flash deals end time
				if(the_item.dealEndTime){
					_this.dealEndTime = the_item.dealEndTime;
				}
			},
			//Error
			function(error){
				_this.error = error;
				_this.checkProductCompletion(callback, errorCallback);
			}
		);
	};//createSingleObjects

	this.checkProductCompletion = function(callback, errorCallback){
	    this.product_count_down--;
	    if(this.product_count_down === 0){
	    	if(this.error){
				errorCallback(this.error);
	    	}else{
			    callback();
	    	}
	    }
	};//checkProductCompletion

	this.getProductList = function(){

		return this.productList;
	}//getProductList
}//ostk_MultiProductData


/*
==================== Plugin ====================

Class: 			ostk_Plugin
Description: 	Everything needed to create and render ostk widgets
*/
function ostk_Plugin(){
	this.constructor = function(){
		this.ostk_check_jquery();
	};//constructor

	this.ostk_check_jquery = function(){
		var _this = this;
		if(typeof jQuery == 'undefined'){
			this.ostk_get_script('http://code.jquery.com/jquery-2.1.4.min.js', function() {
				_this.ostk_init_elements();
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
			_this.ostk_preloaders();
			_this.getPatterns();
		});
	};//ostk_init_elements

	this.getPatterns = function(){
		this.ostk_patterns =  ostk_patterns;
		this.get_elements();
	};//getPatterns

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
		  .attr('href', ostk_api_url+'dist/overstock-embed.min.css');
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
		    		src: 'http://ak1.ostkcdn.com/img/mxc/affiliate-embed-widgets-ostk-logo.png',
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

			var item;
			var is_widget = true;
			switch (data['type']) {
				case 'search':
					item = new ostk_SearchQuery();
					break;
				case 'link':
					item = new ostk_Link();
					break;
				case 'rectangle':
					item = new ostk_Rectangle();
					break;
				case 'leaderboard':
					item = new ostk_Leaderboard();
					break;
				case 'skyscraper':
					item = new ostk_Skyscraper();
					break;
				case 'carousel':
					item = new ostk_Carousel();
					break;
				case 'stock_photo':
					item = new ostk_StockPhoto();
					break;
				case 'product_link':
					item = new ostk_ProductDetailsLink();
					break;
				default:
					is_widget = false;
			}//switch

			if(is_widget){
				var object = $ostk_jQuery.extend({}, new ostk_Widget(data, element), item);	
				object.init();
			}else{
				var html = ostk_formatError('Invalid widget type')
				element.replaceWith(html);
			}

		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin
/*
==================== Single Product Data ====================

Class: 			ostk_SingleProductData
Description: 	Takes a productId or query and returns specific product details
*/ 
function ostk_SingleProductData(){
	this.productId;
	this.name;
	this.price;
	this.baseImageUrl;
	this.imgUrl_large;
	this.imgUrl_medium;
	this.imgUrl_thumbnail;
	this.affiliateUrl;
	this.averageReviewAsDecimal;
	this.averageReviewAsGif;
	this.arrayOfAllProductImages;
	this.description;
	this.multiImages = false;

	this.init = function(callback, errorCallback){
		var _this = this;
		var url = '';

		if(this.obj){
			_this.processData(this.obj, callback, errorCallback);
		}else{
			if(this.productId){
				url = "https://api.overstock.com/ads/products?developerid="+ostk_developerId+"&product_ids=" + this.productId;
				if(this.multiImages){
					url +=	"&fetch_all_images=true";
				}
			}else if(this.query){
				url = this.query;
			}
			url = ostk_addTrackingToUrl(url);	
			$ostk_jQuery.get( url, function( productData ){
				var error = null;

				if(productData.products && productData.products.length > 0){
					var randInt = ostk_getRandomInt(0, productData.products.length-1);
					productData = productData.products[randInt];
				}else if(productData.sales && productData.sales.length > 0){
					productData = productData.sales[0];
				}else{
					error = 'Invalid product id: ' + _this.productId;
				}

				if(error){
					errorCallback(error);
				}else{
					_this.processData(productData, callback, errorCallback);
				}
			})
			.fail(function(){
				errorCallback('Invalid product id: ' + _this.productId);
			});
		}
	}//init

	this.processData = function(productData, callback, errorCallback){
		this.name = this.setName(productData);
		this.productId = productData.id;
		this.developerId = ostk_developerId;

		this.imgUrl_large = (ostk_isset(productData.largeImageURL)) ? productData.largeImageURL: productData.imageURL;
		this.imgUrl_medium = productData.imageURL;
		this.imgUrl_thumbnail = productData.smallImageURL;

		if(productData.description){
			this.description = productData.description;
		}

		if(productData.price){
			this.price = productData.price;
		}

		if(productData.discountMsg){
			this.discountMsg = productData.discountMsg;
		}

		if(productData.url){
			this.affiliateUrl = productData.url;
		}else if(productData.saleURL){
			this.affiliateUrl = productData.saleURL;
		}

		if(productData.review){
			if(productData.review.stars){
			    this.averageReviewAsDecimal = productData.review.stars;
			    this.averageReviewAsGif = this.getStars(productData.review.stars);
			}
		}

		if(productData.dealEndTime){
			this.dealEndTime = productData.dealEndTime;
		}

		if('percentOff' in productData){
			this.percentOff = productData.percentOff !== null ? productData.percentOff : 0;
		}

		if(productData.images){
		    this.arrayOfAllProductImages = this.getImageList(productData.images);
		}

		callback(this);
	};//processData

	this.getImageList = function(images){
		var a = Array();
		for(var i = 0 ; i < images.length ; i++){
			a.push(images[i]['scaledImages'][1].url);
		}//for
		if(!a.length){
			a.push(this.imgUrl_thumbnail);
		}
		return a;
	}

	//Return star gif from float value
	this.getStars = function(stars){
    	//Add trailing ".0" if it doesn't alreay have it
    	if(ostk_isset(stars)){
    	    if(stars % 1 === 0){
		    	stars = stars+'.0';
		    }
		    stars = String(stars);
		    stars = stars.split('.').join('_');
		    return "http://ak1.ostkcdn.com/img/mxc/stars"+stars+'.gif';
    	}else{
    		return null;
    	}
	}

	this.isValidProductID = function(){
		return this.validProductID;
	}

	this.setName = function(productData){
		if(ostk_isset(productData.name)){
			return productData.name;
		}else if(ostk_isset(productData.detailMsg)){
			return productData.detailMsg;
		}
	}

	this.getAffiliateUrl = function(){
		return (ostk_isset(this.affiliateUrl) ? this.affiliateUrl : '' );
	}

	this.getAverageReviewAsDecimal = function(){
		return (ostk_isset(this.averageReviewAsDecimal) ? this.averageReviewAsDecimal : '' );
	}

	this.getAverageReviewAsGif = function(){
		return (ostk_isset(this.averageReviewAsGif) ? this.averageReviewAsGif : '' );
	}

	this.getImageAtIndex = function(index){
		return this.arrayOfAllProductImages[index];
	}

}//ostk_SingleProductData
