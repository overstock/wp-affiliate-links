/* 
==================== Product Details Link ====================

Class: 			ostk_ProductDetailsLink
Extends: 		ostk_Widget
Description: 	Allow users to create easy links to products they are showcasing
*/
function ostk_ProductDetailsLink(atts, element){
	//Extend Widget Class
	ostk_Widget.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		atts = ostk_shortcode_atts(
		{
			'id': null,
			'display': null,
			'link_target': 'new_tab'
		}, atts);

		this.obj = new ostk_SingleProductData();
		this.obj.productId = atts.id

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
				switch (atts.display) {
					case 'name':
						output = this.obj.getName();
						break;
					case "price":
						output = this.obj.getPrice();
						break;
					case 'description':
						output = this.obj.getDescription();
						break;
				}//switch
		output = '<a href="'+this.obj.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(atts)+'>'+output+'</a>';
		this.renderHTML(output);
	}//generateHtml

	this.init();
}//ostk_ProductLink
