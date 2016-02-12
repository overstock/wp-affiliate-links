/* 
==================== Stock Photo ====================

Class: 			ostk_Stockphoto
Extends: 		ostk_Widget
Description: 	Lets you create an image link to a product page (stock photo)
				Allow users to add stock photos to their posts (and get paid for it)
*/
function ostk_StockPhoto(){

	// Init Element
	this.initElement = function(){
		if(!ostk_isset(this.atts.image_number)){
			this.atts.image_number = 1;
		}

		if(ostk_isset(this.atts.id)){
		    this.obj = new ostk_SingleProductData();
			this.obj.multiImages = true;
		}else{
		    this.obj = new ostk_MultiProductData();
		}
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var error = null;

		if(this.atts.image_number){
			var a;
			if(this.obj.productList){
				a = this.obj.productList;
			}else{
				a = this.obj.arrayOfAllProductImages;
			}

			if(a.length < this.atts.image_number){
				error = 'Image number '+this.atts.image_number+' is not available.';
				if(a.length > 1){
					error += ' Image numbers from 1 to '+ a.length +' are available.';
				}else{
					error += ' This image only has 1 available image.';
				}
				error += ' Please change the image_number attribute and try again';
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			var product;
			if(this.obj.productList){
				product = this.obj.productList[this.atts.image_number-1];
			}else{
				product = this.obj;
			}
			output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(this.atts)+'>';
				output += '<div class="ostk-element-inner">';
					output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
					    output += '<div class="ostk-element-content">';
							output += '<img src="'+product.imgUrl_large+'" width="'+this.atts.width+'" height="'+this.atts.height+'" style="'+this.atts.custom_css+'"  class="product-image">';
							output += '</div>';
						    output += '<div class="element-overlay">';
							    output += '<div class="ostk-element-content">';
							    	if(product.name){						    		
										output += '<p class="title">'+product.name+'</p>';
							    	}
									if(product.averageReviewAsGif){
										output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
									}
									if(product.price){
										output += '<p class="price">'+product.price+'</p>';
									}
									output += '<img class="ostk-logo" src="dev/devImages/affiliate-embed-widgets-ostk-logo.png">';
							output += '</div>';
						output += '</div>';
					output += '</a>';
				output += '</div>';
			output += '</div>';

			this.renderHTML(output);
		}

	};//generateHtml

}//ostk_StockPhoto
