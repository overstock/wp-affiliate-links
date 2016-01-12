/* 
==================== Rectangle ====================

Class: 			ostk_Rectangle
Extends: 		ostk_Widget
Description: 	Lets you create a rectangular banner for a SINGLE product
*/
function ostk_Rectangle(){

	// Init Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var product_name = '';

		output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';

			output += '<div class="dealEndTime"></div>';

			output += '<div class="ostk-element-content">';
				output += '<img src="'+this.obj.imgUrl_large+'" class="product-image"/>';
				if(ostk_isset(this.atts.event)){
					//Sales Event
					output += '<div class="product-info">';
						output += '<p class="title">'+this.obj.name+'</p>';

						if(this.atts.event == 'flash_deals'){
							output += '<hr>';
							if(ostk_isset(this.obj.price)){
								output += '<p class="price">$'+this.obj.price+'</p>';
							}
						}else{
							output += '<p class="description">'+this.obj.discountMsg+'</p>';
							output += '<p class="savings">'+this.obj.percentOff+'% OFF</p>';
						}

					output += '</div>';
				}
			output += '</div>';

			if(!ostk_isset(this.atts.event)){
				output += '<div class="element-overlay">';
				    output += '<div class="ostk-element-content">';
						output += '<p class="title">'+this.obj.name+'</p>';
						if(this.obj.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
						}
						if(ostk_isset(this.obj.price)){
							output += '<p class="price">$'+this.obj.price+'</p>';
						}
					output += '</div>';
				output += '</div>';
			}
		output += '</a>';

		this.renderElement(output);

	}//generateHtml

}//ostk_Reactagngle
