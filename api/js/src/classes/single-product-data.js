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