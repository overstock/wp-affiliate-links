/**
 * SINGLE Product Data Class
 * takes a productId and returns specific product details
 * Usage:
 * 	 item = new ProductData(productId);
 *   name = item.getName();
 *   price = item.getPrice():
 *   ...
 * 
 *   IMPORTANT! - You should call item.isDeveloperIdSet()
 *                each time you generate an embed, and display something to the
 *                affiliate if it returns false, this will help them to debug. 
**/ 

var ostk_SingleProductData = function(){
	this.productId;
	this.name;
	this.price;
	this.baseImageUrl;
	this.imgUrl_large;
	this.imgUrl_medium;
	this.imgUrl_thumbnail;
	this.developerId;
	this.affiliateUrl;
	this.averageReviewAsDecimal;
	this.averageReviewAsGif;
	this.numImages;
	this.arrayOfAllProductImages;
	this.description;
	this.validProductID;

  this.__construct = function(productId, callback) {
	var url = "https://api.overstock.com/ads/products?developerid="+developerId+"&product_ids=" + productId;
	var _this = this;
	$ostk_jQuery.get( url, function( productData ) {
		productData = productData['products'][0];
		if(ostk_isset(productData['id'])){
			_this.validProductID = true;
			_this.name = productData['name'];
			_this.productId = productData['id'];
			_this.developerId = developerId;
			_this.description = productData['description'];
			_this.price = productData['price'];
/*

			_this.imgUrl_large = productData['imageURL'];
*/
			if(productData['largeImageURL'] != null){
				_this.imgUrl_large = productData['largeImageURL'];
			}else if(productData['imageURL'] != null){
				_this.imgUrl_large = productData['imageURL'];
			}else if(productData['smallImageURL'] != null){
				_this.imgUrl_large = productData['smallImageURL'];
			}

			_this.affiliateUrl = productData['url'];
		    _this.averageReviewAsDecimal = productData['review']['stars'];
		    if(productData['review']['stars']){
			    _this.averageReviewAsGif = "http://ak1.ostkcdn.com/img/mxc/stars"+String(productData['review']['stars']).split('.').join('_')+'.gif';
		    }
		}else{
			_this.validProductID = false;
		}
		callback(_this);
	});
  }//__construct


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
  
}

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

var ostk_MultiProductDataFromArray = function(){
	this.productList = Array();
	this.invalidProductIDs = Array();
	this.allValidProductIDs = true;

	/* hoki - js isn't liking the default null value. Make sure ok without it */
	// this.__construct(productArray, limit = null) {
	this.__construct = function(productArray, limit, callback) {
		if(limit !== null){
			productArray = ostk_limitArrayCount(productArray, limit);
		}
		var _this = this;
		var _product_count_down = productArray.length;
		for(var i = 0 ; i < productArray.length ; i++){
			var product = productArray[i];
			var item = new ostk_SingleProductData();
			item.__construct(product, function(the_item){
			    if(the_item.validProductID){
					_this.productList.push(the_item);
			    }else{
					_this.invalidProductIDs.push(the_item['productId']);
					allValidProductIDs = false;
			    }
			    _product_count_down--;
			    if(_product_count_down === 0){
				    callback();
			    }
			});
		}//for
	}//__construct

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
	var productList;
	var invalidProductIDs = array();
	var allValidProductIDs = true;

	this.__construct = function(query, type, limit, callback) {
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
		  this.productList[i] = new ostk_SingleProductData(productData[products][products][i][id]);
		}//for
	}//__construct
   
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
