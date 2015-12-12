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

