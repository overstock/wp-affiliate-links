var ostk_developerId;
// var ostk_api_url = 'https://cdn.rawgit.com/overstock/wp-affiliate-links/master/api/';
var ostk_api_url = 'http://localhost/~thoki/overstock-affiliate-links/trunk/api/';
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

var ostk_SingleProductData = function(){
	/**
	* SINGLE Product Data Class
	* takes a productId and returns specific product details
	*
	* Usage:
	* 	 item = new ProductData(productId);
	*   name = item.getName();
	*   price = item.getPrice():
	**/ 
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
				url = "https://api.test.overstock.com/ads/products?developerid="+developerId+"&product_ids=" + this.productId;
				if(this.multiImages){
					url +=	"&fetch_all_images=true";
				}
			}else if(this.query){
				url = this.query;
			}

			$ostk_jQuery.get( url, function( productData ){
				productData = productData['products'][0];
				_this.processData(productData, callback, errorCallback);
			})
			.fail(function(){
				errorCallback('Invalid product id: ' + _this.productId);
			});
		}
	}//init

	this.processData = function(productData, callback, errorCallback){
		if(productData['images']){
		    this.arrayOfAllProductImages = this.getImageList(productData['images']);
		}
		this.name = productData['name'];
		this.productId = productData['id'];
		this.developerId = developerId;
		this.description = productData['description'];
		this.price = productData['price'];
		this.affiliateUrl = productData['url'];
	    this.averageReviewAsDecimal = productData['review']['stars'];
	    this.averageReviewAsGif = this.getStars(productData['review']['stars']);
		this.imgUrl_large = this.getClosestImg(productData, 'largeImageURL');
		this.imgUrl_medium = this.getClosestImg(productData, 'imageURL');
		this.imgUrl_thumbnail = this.getClosestImg(productData, 'smallImageURL');
		callback(this);
	};//processData

	this.getImageList = function(images){
		var a = Array();
		for(var i = 0 ; i < images.length ; i++){
			a.push(images[i]['scaledImages'][3]['url']);
		}//for
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

	this.getClosestImg = function(obj, str){
		//Array in order of largest to smallest images
		var imgArr = ['largeImageURL', 'imageURL', 'smallImageURL'];
		//Find the index of the requested image size
		var greatestIndex = imgArr.indexOf(str);
		//Loop through the array of images
		for(var i = greatestIndex ; i < imgArr.length ; i++){
			//Return the value of the largest image possible that is not null
			if(obj[imgArr[i]] !== null){
			return obj[imgArr[i]];
			}
		}//for
		//If none of the images have a value return null
		return null;
	}

	this.isValidProductID = function(){
		return this.validProductID;
	}

	this.getProductId = function(){
	return (ostk_isset(this.productId) ? this.productId : ostk_formatError("\productId is not set") );
	}

	this.getName = function(){
	return (ostk_isset(this.name) ? this.name : ostk_formatError("\name is not set") );
	}

	this.getPrice = function(){
	return (ostk_isset(this.price) ? this.price : ostk_formatError("\price is not set") );
	}

	this.getImageBaseUrl = function(){
	return (ostk_isset(this.baseImageUrl) ? this.baseImageUrl : ostk_formatError("\baseImageUrl is not set") );
	}

	this.getImage_Thumbnail = function(){
	return (ostk_isset(this.imgUrl_thumbnail) ? this.imgUrl_thumbnail : ostk_formatError("\imgUrl_thumbnail is not set") );
	}

	this.getImage_Medium = function(){
	return (ostk_isset(this.imgUrl_medium) ? this.imgUrl_medium : ostk_formatError("\imgUrl_medium is not set") );
	}

	this.getImage_Large = function(){
	return (ostk_isset(this.imgUrl_large) ? this.imgUrl_large : ostk_formatError("\imgUrl_large is not set") );
	}

	this.getAffiliateUrl = function(){
	return (ostk_isset(this.affiliateUrl) ? this.affiliateUrl : ostk_formatError("\affiliateUrl is not set") );
	}

	this.getAverageReviewAsDecimal = function(){
		return (ostk_isset(this.averageReviewAsDecimal) ? this.averageReviewAsDecimal : ostk_formatError("\averageReviewAsDecimal is not set") );
	}

	this.getAverageReviewAsGif = function(){
		return (ostk_isset(this.averageReviewAsGif) ? this.averageReviewAsGif : ostk_formatError("\averageReviewAsGif is not set") );
	}

	this.getImageAtIndex = function(index){
	  return this.arrayOfAllProductImages[index];
	}

	this.getArrayOfAllProductImages = function(){
		return this.arrayOfAllProductImages;
	}

	this.getDescription = function(){
		return this.description;
	}
}//ostk_SingleProductData

var ostk_MultiProductData = function(){
	/**
	 * MULTIPLE Product Data Class
	 * takes query (a API call on the search.json API . https://confluence.overstock.com/display/EP/Search)
	 * & num (the number of ostk_SingleProductData objects to return)
	 * 	   
	 * Each item in the productList array is a ostk_SingleProductData object, so you can call those instance methods on them.
	 * Writing a class that generated the url dynamically would just increase complexity, instead the url is generated on a widget-by-widget basis
	 * and the class supports the general API call. 
	**/

	this.productIds;
	this.limit;
	this.developerId = developerId;
	this.productList = Array();
	this.invalidProductIDs = Array();
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
			$ostk_jQuery.get( this.query, function( productData ){
				_this.product_count_down = _this.limit;
				for(var i = 0 ; i < productData['products'].length ; i++){
					var item = new ostk_SingleProductData();
					item.obj =  productData['products'][i];
					_this.createSingleObjects(item, callback, errorCallback);
				}//for

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
			},
			//Error
			function(error){
				_this.invalidProductIDs.push(['hoki']);
				_this.checkProductCompletion(callback, errorCallback);
			}
		);
	};//createSingleObjects

	this.checkProductCompletion = function(callback, errorCallback){
	    this.product_count_down--;
	    if(this.product_count_down === 0){
	    	if(this.invalidProductIDs.length > 0){
				errorCallback();
	    	}else{
			    callback();
	    	}
	    }
	};//checkProductCompletion

	this.isAllValidProductIDs = function(){
	    if(this.invalidProductIDs.length > 0){
	    	multiMarker = '';
		    if(this.invalidProductIDs.length > 1){
		    	multiMarker = 's';
	    	}
	    	return false;
    	}else{
	    	return true;
    	}
	}//isAllValidProductIDs

	this.getProductList = function(){

		return this.productList;
	}//getProductList
}//ostk_MultiProductData



