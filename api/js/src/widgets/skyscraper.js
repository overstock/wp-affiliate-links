/* 
==================== Skyscraper ====================

Class: 			ostk_Skyscraper
Extends: 		ostk_Widget
Description: 	Lets you create a skyscraper banner for up to three products
*/
function ostk_Skyscraper(){

	// Init Element
	this.initElement = function(){
		var error = '';
		this.atts.number_of_items = (parseInt(this.atts.number_of_items) > 3) ? 3 : this.atts.number_of_items;

		if(ostk_isset(this.atts.event)){
			this.atts.number_of_items = 2;
		}

		this.obj = new ostk_MultiProductData();
		this.obj.limit = this.atts.number_of_items;

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = Array();
		var output = '';
		var product_name = '';

		productList = this.obj.getProductList();

		output += '<div class="dealEndTime"></div>';

		for(var i = 0 ; i < productList.length ; i++){
		    var product = productList[i];
		    output += '<div class="ostk-element-content">';
				output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
					output += '<img class="product-image" src="'+product.imgUrl_large+'"/>';

					output += '<div class="product-info">';

						output += '<p class="title">'+product.name+'</p>';

						if(!ostk_isset(this.atts.event)){
							if(product.averageReviewAsGif){
								output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
							}
						}

						if(!ostk_isset(this.atts.event) || this.atts.event == 'Flash Deals'){
							output += '<p class="price">$'+product.price+'</p>';
						}

						if(ostk_isset(this.atts.event)){
							if(this.atts.event == 'flash-deals'){
								output += '<p class="savings">Save: '+product.percentOff+'%</p>';
							}else{
								output += '<p class="savings">'+product.percentOff+'% OFF</p>';
							}
						}

					output += '</div>';
				output += '</a>';
			output += '</div>';
		}//for

		this.renderElement(output);

	}//generateHtml

}//ostk_Skyscraper
