/* 
==================== Link ====================

Class: 			ostk_Link
Extends: 		ostk_Widget
Description: 	Lets you create links to any overstock page
				Specify the link_text with the link_text attribute
				Generate a link to a predefined page on Overstock.com
*/
function ostk_Link(atts, element){
	//Extend Widget Class
	ostk_Widget.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		atts = ostk_shortcode_atts(
	    {
	      'type': null,
	      'url': 'http://www.overstock.com/', 
	      'link_text': 'A link to Overstock.com',
	      'link_target': 'new_tab'
	    }, atts);

		var output = '';
		var link_text = atts.link_text;
		var affiliateLink = ostk_generateAffiliateLink(atts.url);

		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';

		this.renderHTML(output);
	};//initElement

	this.init();
}//ostk_Link
