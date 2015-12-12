/* 
==================== Stock Photo ====================

Class: 			ostk_Stockphoto
Extends: 		ostk_Widget
Description: 	Lets you create an image link to a product page (stock photo)
				Allow users to add stock photos to their posts (and get paid for it)
*/
function ostk_Stockphoto(){

	// Init Element
	this.initElement = function(){
		var output = '';
		var _this = this;
		this.atts = ostk_shortcode_atts(
		{
			'type': null,
			'id': null, 
			'height': null, 
			'width': null, 
			'image_number': '1', 
			'custom_css': null,
			'link_target': 'new_tab'
		}, this.atts);

	    this.obj = new ostk_SingleProductData();
	    this.obj.productId = this.atts.id;
		this.obj.multiImages = true;

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var error = null;

		if(this.atts.image_number){
			if(this.obj.arrayOfAllProductImages.length < this.atts.image_number){
				error = 'Image number '+this.atts.image_number+' is not available.';
				if(this.obj.arrayOfAllProductImages.length > 1){
					error += ' Image numbers from 1 to '+ this.obj.arrayOfAllProductImages.length +' are available.';
				}else{
					error += ' This image only has 1 available image.';
				}
				error += ' Please change the image_number attribute and try again';
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(this.atts)+'>';
				output += '<div class="ostk-element-inner">';
					output += '<a href="'+this.obj.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
					    output += '<div class="ostk-element-content">';
							output += '<img src="'+this.obj.getImageAtIndex(this.atts.image_number-1)+'" width="'+this.atts.width+'" height="'+this.atts.height+'" style="'+this.atts.custom_css+'">';
							output += '</div>';
						    output += '<div class="element-overlay">';
							    output += '<div class="ostk-element-content">';
									output += '<p class="title">'+this.obj.getName()+'</p>';
									if(this.obj.averageReviewAsGif){
										output += '<img class="ostk-rating" src="'+this.obj.getAverageReviewAsGif()+'"/>';
									}
									output += '<p class="price">'+this.obj.getPrice()+'</p>';
									output += '<img class="ostk-logo" src="'+ostk_api_url+'images/overstock-logo.png">';
							output += '</div>';
						output += '</div>';
					output += '</a>';
				output += '</div>';
			output += '</div>';
		}

		this.renderHTML(output);
	}//generateHtml

}//ostk_Stockphoto
