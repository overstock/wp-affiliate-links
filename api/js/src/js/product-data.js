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

			// console.log(url);
			$ostk_jQuery.get( url, function( productData ){
				// console.log('jquery return success');
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
	 * Usage:
	 *     products = new MultiProductData("http://www.overstock.com/api/search.json?moretop_sellers=Top+Sellers&taxonomy=sto4", 5);
	 *     productList = products.getProductList();
	 * 	   <img src= <? echo productList[0].getImage_Medium(); ?> />
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
		console.log('-- ostk_MultiProductData - init --');
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
			$ostk_jQuery.get( this.query, function( productData ){
				console.log('query');

				console.log('productData');
				console.dir(productData['products']);

				console.log('_this.limit: ' + _this.limit);

				if(_this.limit !== null){
					productData['products'] = ostk_limitArrayCount(productData['products'], _this.limit);
				}
				console.log('product_count_down: ' + _this.product_count_down);
				_this.product_count_down = _this.limit;
				for(var i = 0 ; i < productData['products'].length ; i++){
					console.log('for');
					var item = new ostk_SingleProductData();
					item.obj =  productData['products'][0];
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
				console.log('single success');
				_this.productList.push(the_item);
				_this.checkProductCompletion(callback, errorCallback);
			},
			//Error
			function(error){
				console.log('error success');
				_this.invalidProductIDs.push(['hoki']);
				_this.checkProductCompletion(callback, errorCallback);
			}
		);
	};//createSingleObjects

	this.checkProductCompletion = function(callback, errorCallback){
		console.log('checkProductCompletion');
		console.log(this.product_count_down);
	    this.product_count_down--;
	    if(this.product_count_down === 0){
	    	if(this.invalidProductIDs.length > 0){
				console.log('done with fail');
				errorCallback();
	    	}else{
				console.log('done with success');
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