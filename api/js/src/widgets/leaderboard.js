/* 
==================== Leaderboard ====================

Class: 			ostk_Leaderboard
Extends: 		ostk_Widget
Description: 	Lets you create a leaderboard banner for up to two products 
*/
function ostk_Leaderboard(){

	// Init Element
	this.initElement = function(){
		var limit = 2;
		if(ostk_isset(this.atts.version) && this.atts.version !== 'standard'){
			limit = 1;
		}else{
			limit = (parseInt(this.atts.number_of_items) < 2) ? this.atts.number_of_items : 2;
		}

		this.obj = new ostk_MultiProductData();
		this.obj.limit = limit;

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = this.obj.getProductList();
		var output = '';
		var brand_img = 'white';

		if(ostk_isset(this.atts.event)){
			var eventName = this.atts.event.split(' ').join('-').toLowerCase();
			// eventClass += ' sales-event '+eventName.split('_').join('-');
			if(this.atts.event == 'flash_deals'){
				brand_img = 'flash-deals';
			}
		}

		if(productList[0].dealEndTime){
			this.obj.dealEndTime = productList[0].dealEndTime;
		}

		output += '<div class="item-holder item-count-'+productList.length+'">';
			for(var i = 0 ; i < productList.length ; i++){
				var product = productList[i];

			    output += '<div class="ostk-item">';
				    output += '<div class="ostk-element-content">';
						output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
							output += '<img class="product-image" src="'+product.imgUrl_large+'"/>';

						    output += '<div class="product-info">';
								output += '<p class="title">'+product.name+'</p>';
								if(!ostk_isset(this.atts.event)){
									output += '<p class="description">'+product.description+'</p>';
									if(product.averageReviewAsGif){
										output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
									}
								}
								if(product.price){
									output += '<p class="price">$'+product.price+'</p>';
								}
								if(product.percentOff){
									output += '<p class="savings">'+product.percentOff+'% OFF</p>';
								}
							output += '</div>';
						output += '</a>';
				output += '</div>';

			output += '</div>';
			}//for
		output += '</div>';

		if(this.atts.event == 'flash_deals' && this.atts.version == 'mini'){
			output += '<div class="dealEndTime"></div>';
		}

		output += '<div class="ostk-element-footer">';
			if(this.atts.event == 'flash_deals'){
    			output += this.getBranding('flash-deals');
				if(this.atts.version !== 'mini' || this.atts.version !== 'mobile'){
					output += '<div class="dealEndTime"></div>';
				}
    			output += this.getBranding();
			}else if(this.atts.event == 'sales' || this.atts.event == 'promotions'){
    			output += this.getBranding();
			}else{
    			output += this.getBranding('white');
			}
		output += '</div>';

		this.renderElement(output);
	}//generateHtml

}//ostk_Leaderboard
