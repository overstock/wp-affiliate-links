/*
==================== Single Product Data ====================

Class: 			ostk_SingleProductData
Description: 	Takes a productId or query and returns specific product details
*/ 
function ostk_SingleProductData(){
	this.productId = null;
	this.name = null;
	this.price = null;
	this.baseImageUrl = null;
	this.imgUrl_large = null;
	this.imgUrl_medium = null;
	this.imgUrl_thumbnail = null;
	this.affiliateUrl = null;
	this.averageReviewAsDecimal = null;
	this.averageReviewAsGif = null;
	this.arrayOfAllProductImages = null;
	this.description = null;
	this.multiImages = false;

	this.init = function(callback, errorCallback){
		var _this = this;
		var url = '';

		if(this.obj){
			_this.processData(this.obj, callback, errorCallback);
		}else{
			if(this.productId){
				url = ostk_url+"/ads/products?developerid="+ostk_developerId+"&product_ids=" + this.productId;
				if(this.multiImages){
					url +=	"&fetch_all_images=true";
				}
			}else if(this.query){
				url = this.query;
			}
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
	};//init

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
		this.affiliateUrl += '&clickplatform='+ostk_clickPlatform + '&clickurl='+ostk_clickurl;

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
			a.push(images[i].scaledImages[1].url);
		}//for
		if(!a.length){
			a.push(this.imgUrl_thumbnail);
		}
		return a;
	};//getImageList

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
	};//getStars

	this.isValidProductID = function(){
		return this.validProductID;
	};//isValidProductID

	this.setName = function(productData){
		if(ostk_isset(productData.name)){
			return productData.name;
		}else if(ostk_isset(productData.detailMsg)){
			return productData.detailMsg;
		}
	};//setName

	this.getAffiliateUrl = function(){
		return (ostk_isset(this.affiliateUrl) ? this.affiliateUrl : '' );
	};//getAffiliateUrl

	this.getAverageReviewAsDecimal = function(){
		return (ostk_isset(this.averageReviewAsDecimal) ? this.averageReviewAsDecimal : '' );
	};//getAverageReviewAsDecimal

	this.getAverageReviewAsGif = function(){
		return (ostk_isset(this.averageReviewAsGif) ? this.averageReviewAsGif : '' );
	};//getAverageRevewAsGif

	this.getImageAtIndex = function(index){
		return this.arrayOfAllProductImages[index];
	};//getImageAtIndex

}//ostk_SingleProductData
