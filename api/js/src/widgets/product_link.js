/* 
==================== Product Details Link ====================

Class: 			ostk_ProductDetailsLink
Extends: 		ostk_Widget
Description: 	Allow users to create easy links to products they are showcasing
*/
function ostk_ProductDetailsLink(){

	// Generate Html
	this.initElement = function(){
		this.atts = ostk_shortcode_atts(
		{
			'id': null,
			'display': null,
			'link_target': 'new_tab'
		}, this.atts);

		this.obj = new ostk_SingleProductData();
		this.obj.productId = this.atts.id

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
				switch (this.atts.display) {
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
		output = '<a href="'+this.obj.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(this.atts)+'>'+output+'</a>';
		this.renderHTML(output);
	}//generateHtml

}//ostk_ProductLink
