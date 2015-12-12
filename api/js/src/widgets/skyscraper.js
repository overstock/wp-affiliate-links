/* 
==================== Skyscraper ====================

Class: 			ostk_Skyscraper
Extends: 		ostk_Widget
Description: 	Lets you create a skyscraper banner for up to three products
*/
function ostk_Skyscraper(atts, element){
	//Extend Widget Class
	ostk_Widget.call(this, atts, element);

	// Init Element
	this.initElement = function(){
		atts = ostk_shortcode_atts(
		{
			'type': null,
			'event': null,
			'product_ids': null,
			'width': null,
			'link_target': 'new_tab',
			'number_of_items': 3,
		}, atts);

		var error = '';
		atts.number_of_items = (parseInt(atts.number_of_items) > 3) ? 3 : atts.number_of_items;

		if(ostk_isset(atts.event)){
			atts.number_of_items = 2;
		}

		if(atts.number_of_items > 1){
			this.obj = new ostk_MultiProductData();
		}else{
			this.obj = new ostk_SingleProductData();
		}
		this.obj.limit = atts.number_of_items;

		if(this.atts.product_ids){
			this.obj.productIds = atts.product_ids;
		}else if(this.atts.event){
			this.obj.query = ostk_getEventQuery(this.atts.event);
		}

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var productList = Array();
		var output = '';
		var product_name = '';

		if(atts.number_of_items > 1){
			productList = this.obj.getProductList();
		}else{
			productList.push(this.obj);
		}

		output += '<div class="dealEndTime"></div>';

		for(var i = 0 ; i < productList.length ; i++){
		    var product = productList[i];
		    output += '<div class="ostk-element-content">';
				output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
					output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';

					output += '<div class="product-info">';

						output += '<p class="title">'+product.getName()+'</p>';

						if(!ostk_isset(atts.event)){
							if(product.averageReviewAsGif){
								output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
							}
						}

						if(!ostk_isset(atts.event) || atts.event == 'Flash Deals'){
							output += '<p class="price">$'+product.getPrice()+'</p>';
						}

						if(ostk_isset(atts.event)){
							if(atts.event == 'flash-deals'){
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

	this.init();
}//ostk_Skyscraper
