var ostk_SingleProductData = function(productId){
	/**
	* SINGLE Product Data Class
	* takes a productId and returns specific product details
	*
	* Usage:
	* 	 item = new ProductData(productId);
	*   name = item.getName();
	*   price = item.getPrice():
	**/ 
	this.productId = productId;
	this.name;
	this.price;
	this.baseImageUrl;
	this.imgUrl_large;
	this.imgUrl_medium;
	this.imgUrl_thumbnail;
	this.affiliateUrl;
	this.averageReviewAsDecimal;
	this.averageReviewAsGif;
	this.numImages;
	this.arrayOfAllProductImages;
	this.description;

	this.init = function(callback, errorCallback) {
		var url = "https://api.overstock.com/ads/products?developerid="+developerId+"&product_ids=" + this.productId;
		var _this = this;
		$ostk_jQuery.get( url, function( productData ) {
			productData = productData['products'][0];
			_this.name = productData['name'];
			_this.productId = productData['id'];
			_this.developerId = developerId;
			_this.description = productData['description'];
			_this.price = productData['price'];
			_this.affiliateUrl = productData['url'];
		    _this.averageReviewAsDecimal = productData['review']['stars'];
		    if(productData['review']['stars']){
			    _this.averageReviewAsGif = "http://ak1.ostkcdn.com/img/mxc/stars"+String(productData['review']['stars']).split('.').join('_')+'.gif';
		    }
			_this.imgUrl_large = _this.getClosestImg(productData, 'largeImageURL');
			_this.imgUrl_medium = _this.getClosestImg(productData, 'imageURL');
			_this.imgUrl_thumbnail = _this.getClosestImg(productData, 'smallImageURL');
			callback(_this);
		})
		.fail(function() {
			errorCallback('Invalid product id: ' + _this.productId);
		});
	}//init

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
		if(index == 1) {
			return this.getImage_Large(); 
		}
		else {
	  index = index - 1;
		  return this.arrayOfAllProductImages[index];
		}
	}

	this.getArrayOfAllProductImages = function(){
		return this.arrayOfAllProductImages;
	}

	this.getDescription = function(){
		return this.description;
	}
}//ostk_SingleProductData

var ostk_MultiProductDataFromArray = function(){
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
	 * 
	 * num limit is 10
	 * 
	**/
	this.developerId = developerId;
	this.productList = Array();
	this.invalidProductIDs = Array();
	this.product_count_down = 0;

	this.init = function(productArray, limit, callback, errorCallback) {
		if(limit !== null){
			productArray = ostk_limitArrayCount(productArray, limit);
		}
		var _this = this;
		this.product_count_down = productArray.length;
		for(var i = 0 ; i < productArray.length ; i++){
			var product = productArray[i];
			var item = new ostk_SingleProductData(product);
			item.init(
				//Success
				function(the_item){
					_this.productList.push(the_item);
					_this.checkProductCompletion(callback, errorCallback);
				},
				//Error
				function(error){
					_this.invalidProductIDs.push(the_item['productId']);
					_this.checkProductCompletion(callback, errorCallback);
				}
			);

		}//for
	}//init

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
}//ostk_MultiProductDataFromArray

var ostk_MultiProductDataFromQuery = function(){
	this.productList;
	this.invalidProductIDs = array();
	this.allValidProductIDs = true;

	this.constructor = function(query, type, limit, callback) {
		url = query;
		json = file_get_contents(url);
		productData = json_decode(json, true);
		numResults = (count(productData[products][products]) > 0) ? count(productData[products][products]) : 0;
		if (numResults == 0){
		  return ostk_formatError("There were no results for your query. Try filtering by a category, or refining your search term. i.e. diamond bracelet instead of diamond.");
		}
		temp = numResults;
		if(numResults > limit){
			temp = limit;
		}
		for (i = 0; i < temp; i++) {
		  this.productList[i] = new ostk_SingleProductData();
		}//for
	}//constructor
   
     this.getProductList = function(){
  	   return this.productList;
    }//getProductList


	this.isAllValidProductIDs = function(){
	    if(count(this.invalidProductIDs) > 0){
	    	multiMarker = '';
		    if(count(this.invalidProductIDs) > 1){
		    	multiMarker = 's';
	    	}
	    	return false;
    	}else{
	    	return true;
    	}
	}//isAllValidProductIDs
}//ostk_MultiProductDataFromQuery
