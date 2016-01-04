/* 
==================== Link ====================

Class: 			ostk_Link
Extends: 		ostk_Widget
Description: 	Lets you create links to any overstock page
				Specify the link_text with the link_text attribute
				Generate a link to a predefined page on Overstock.com
*/
function ostk_Link(){

	// Generate Html
	this.initElement = function(){
		var output = '';
		var link_text = ostk_isset(this.atts.link_text) ? this.atts.link_text : 'A link to Overstock.com';
		var affiliateLink = ostk_generateAffiliateLink(this.atts.url);

		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(this.atts)+'>'+link_text+'</a>';

		this.renderHTML(output);
	};//initElement

}//ostk_Link
