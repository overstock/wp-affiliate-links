/* 
==================== Leaderboard ====================

Class: 			ostk_Leaderboard
Extends: 		ostk_Widget
Description: 	Lets you create a leaderboard banner for up to two products 
*/
function ostk_Leaderboard(){

	// Init Element
	this.initElement = function(){
		this.atts = ostk_shortcode_atts(
		{
			'type': null,
			'product_ids': null,
			'event': null,
			'link_target': 'new_tab',
			'number_of_items': 2,
			'version': 'v1'
		}, this.atts);

		var output = '';
		var error = null;
		var _this = this;

		if(ostk_isset(this.atts.version) && this.atts.version !== 'v1'){
			this.atts.number_of_items = 1;
		}

		var limit = (parseInt(this.atts.number_of_items) < 2) ? this.atts.number_of_items : 2;

		this.obj = new ostk_MultiProductData();
		this.obj.limit = limit;

		if(this.atts.product_ids){
			this.obj.productIds = this.atts.product_ids;
		}else if(this.atts.event){
			this.obj.query = ostk_getEventQuery(this.atts.event);
		}

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = this.obj.getProductList();
		var output = '';

		output += '<div class="item-holder item-count-'+productList.length+'">';
			for(var i = 0 ; i < productList.length ; i++){
				var product = productList[i];

			    output += '<div class="ostk-item">';
				    output += '<div class="ostk-element-content">';
						output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
							output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';

						    output += '<div class="product-info">';
								output += '<p class="title">'+product.getName()+'</p>';
								if(!ostk_isset(this.atts.event)){
									output += '<p class="description">'+product.description+'</p>';
									if(product.averageReviewAsGif){
										output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
									}
								}

								output += '<p class="price">$'+product.getPrice()+'</p>';
								if(ostk_isset(this.atts.event)){
									if(this.atts.event == 'Flash Deals'){
										output += '<p class="savings">Save: '+product.percentOff+'%</p>';
									}else{
										output += '<p class="savings">'+product.percentOff+' OFF</p>';
									}
								}
							output += '</div>';
						output += '</a>';
				output += '</div>';

			output += '</div>';
			}//for
		output += '</div>';

		this.renderElement(output);
	}//generateHtml

}//ostk_Leaderboard
