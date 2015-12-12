/* 
==================== Search Query ====================

Class: 			ostk_SearchQuery
Extends: 		ostk_Widget
Description: 	Takes you to search results page
				Generate a link to a search results page
				Query is link text if link_text parameter is empty
*/
function ostk_SearchQuery(atts, element){
	//Extend Widget Class
	ostk_Widget.call(this, atts, element);

	// Generate Html
	this.initElement = function(){
		var output = '';
		var keywords = (ostk_isset(atts.query) ? "keywords=" + atts.query.split(" ").join("%20") : null);
		var taxonomy = '';
		var taxonomyParam = '';
		var error = null;
		var sortOption = '';
		var link_text = atts.link_text;

		if(!error){
			if(keywords == null) {
				error = '"query" parameter cannot be empty.';
			}
		}

		if(error){
			if(ostk_isset(atts.category)){
				taxonomyParam = ostk_getTaxonomy(atts.category);
				if(!taxonomyParam){
					error = '"category" not found. Please check spelling and try again.';
				} else {
					taxonomy = "&taxonomy=" + taxonomyParam; 
				}
			}
		}

		if(error){
			if(ostk_isset(atts.sort_by)){
				sortOptionParam = ostk_getSortOption(atts.sort_by);
				if(!sortOptionParam){
					error = '"sort_by" not found. Please check spelling and try again.';
				} else {
					sortOption = "&sortOption=" + sortOptionParam; 
				}
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			var affiliateLink = ostk_generateAffiliateLink("http://www.overstock.com/search?"+keywords+taxonomy+sortOption);
			link_text = (atts.link_text != null ? atts.link_text : atts.query);
			output = '<a href="'+affiliateLink+'" class="ostk-element ostk-search" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';
			this.renderHTML(output);
		}
	};//initElement

	this.init();
}//ostk_SearchQuery
