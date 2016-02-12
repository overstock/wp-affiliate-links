/* 
==================== Product Details Link ====================

Class: 			ostk_ProductDetailsLink
Extends: 		ostk_Widget
Description: 	Allow users to create easy links to products they are showcasing
*/
function ostk_ProductDetailsLink(){

	// Generate Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();

		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		switch (this.atts.display) {
			case 'name':
				output = this.obj.name;
				break;
			case "price":
				output = this.obj.price;
				break;
			case 'description':
				output = this.obj.description;
				break;
		}//switch
		output = '<a href="'+this.obj.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(this.atts)+'>'+output+'</a>';
		this.renderHTML(output);
	};//generateHtml

}//ostk_ProductLink
