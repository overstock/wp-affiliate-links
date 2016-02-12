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

	};//generateHtml

}//ostk_Skyscraper
