var ostk_SingleProductData = function(){
	/*
	SINGLE Product Data Class
	takes a productId or query and returns specific product details
	*/ 
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
				url = "https://api.test.overstock.com/ads/products?developerid="+ostk_developerId+"&product_ids=" + this.productId;
				if(this.multiImages){
					url +=	"&fetch_all_images=true";
				}
			}else if(this.query){
				url = this.query;
			}
			url = ostk_addTrackingToUrl(url);	
			$ostk_jQuery.get( url, function( productData ){
				if(productData.products){
					var randInt = ostk_getRandomInt(0, productData.products.length-1);
					productData = productData.products[randInt];
				}else if(productData.sales){
					productData = productData.sales[0];
				}
				_this.processData(productData, callback, errorCallback);
			})
			.fail(function(){
				errorCallback('Invalid product id: ' + _this.productId);
			});
		}
	}//init

	this.processData = function(productData, callback, errorCallback){
		if(productData.images){
		    this.arrayOfAllProductImages = this.getImageList(productData.images);
		}
		this.name = this.setName(productData);
		this.productId = productData.id;
		this.developerId = ostk_developerId;
		this.description = productData.description;

		if(productData.price){
			this.price = productData.price;
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

		this.imgUrl_large = (ostk_isset(productData.largeImageURL)) ? productData.largeImageURL: productData.imageURL;
		this.imgUrl_medium = productData.imageURL;
		this.imgUrl_thumbnail = productData.smallImageURL;

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

	this.isValidProductID = function(){
		return this.validProductID;
	}

	this.getProductId = function(){
		return (ostk_isset(this.productId) ? this.productId : '' );
	}

	this.getName = function(){
		return (ostk_isset(this.name) ? this.name : '' );
	}

	this.setName = function(productData){
		if(ostk_isset(productData.name)){
			return productData.name;
		}else if(ostk_isset(productData.detailMsg)){
			return productData.detailMsg;
		}
	}

	this.getPrice = function(){
		return (ostk_isset(this.price) ? this.price : '' );
	}

	this.getImageBaseUrl = function(){
		return (ostk_isset(this.baseImageUrl) ? this.baseImageUrl : '' );
	}

	this.getImage_Thumbnail = function(){
		return (ostk_isset(this.imgUrl_thumbnail) ? this.imgUrl_thumbnail : '' );
	}

	this.getImage_Medium = function(){
		return (ostk_isset(this.imgUrl_medium) ? this.imgUrl_medium : '' );
	}

	this.getImage_Large = function(){
		return (ostk_isset(this.imgUrl_large) ? this.imgUrl_large : '' );
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

	this.getArrayOfAllProductImages = function(){
		return this.arrayOfAllProductImages;
	}

	this.getDescription = function(){
		return this.description;
	}
}//ostk_SingleProductData

var ostk_MultiProductData = function(){
	/*
	MULTIPLE Product Data Class
	takes query (a API call on the search.json API . https://confluence.overstock.com/display/EP/Search)
	& num (the number of ostk_SingleProductData objects to return)
		   
	Each item in the productList array is a ostk_SingleProductData object, so you can call those instance methods on them.
	Writing a class that generated the url dynamically would just increase complexity, instead the url is generated on a widget-by-widget basis
	and the class supports the general API call. 
	*/

	this.productIds;
	this.limit;
	this.developerId = ostk_developerId;
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
			this.query = ostk_addTrackingToUrl(this.query);	
			$ostk_jQuery.get( this.query, function( productData ){
				if(productData.products){
					productData = productData.products;
				}else if(productData.sales){
					productData = productData.sales;
				}

				_this.product_count_down = productData.length;

				for(var i = 0 ; i < productData.length ; i++){
					var item = new ostk_SingleProductData();
					item.obj =  productData[i];
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

				//Flash deals end time
				if(the_item.dealEndTime){
					_this.dealEndTime = the_item.dealEndTime;
				}
			},
			//Error
			function(error){
				_this.invalidProductIDs.push('hoki');
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

