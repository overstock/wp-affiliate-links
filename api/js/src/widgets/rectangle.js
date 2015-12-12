/* 
==================== Rectangle ====================

Class: 			ostk_Rectangle
Extends: 		ostk_Widget
Description: 	Lets you create a rectangular banner for a SINGLE product
*/
function ostk_Rectangle(atts, element){
	//Extend Widget Class
	ostk_Widget.call(this, atts, element);

	// Init Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();

		if(this.atts.id){
			this.obj.productId = this.atts.id;
		}else if(this.atts.event){
			var query = ostk_getEventQuery(this.atts.event);
			this.obj.query = query;
		}

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var product_name = '';

		output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';

			output += '<div class="dealEndTime"></div>';

			output += '<div class="ostk-element-content">';
				output += '<img src="'+this.obj.getImage_Large()+'" class="product-image"/>';
				if(ostk_isset(atts.event)){
					//Sales Event
					output += '<div class="product-info">';
						output += '<p class="title">'+this.obj.getName()+'</p>';
						if(atts.event == 'Flash Deals'){
							output += '<p class="price">$'+this.obj.price+'</p>';
							output += '<p class="savings">Save: '+this.obj.percentOff+'%</p>';
						}else{
							output += '<p class="savings">'+this.obj.percentOff+'% OFF</p>';
						}

					output += '</div>';
				}
			output += '</div>';

			if(!ostk_isset(atts.event)){
				output += '<div class="element-overlay">';
				    output += '<div class="ostk-element-content">';
						output += '<p class="title">'+this.obj.getName()+'</p>';
						if(this.obj.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+this.obj.getPrice()+'</p>';
					output += '</div>';
				output += '</div>';
			}
		output += '</a>';

		this.renderElement(output);

	}//generateHtml

	this.init();
}//ostk_Reactagngle
