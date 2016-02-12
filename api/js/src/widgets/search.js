/* 
==================== Search Query ====================

Class: 			ostk_SearchQuery
Extends: 		ostk_Widget
Description: 	Takes you to search results page
				Generate a link to a search results page
				Query is link text if link_text parameter is empty
*/
function ostk_SearchQuery(){

	// Generate Html
	this.initElement = function(){
		var output = '';
		var keywords = (ostk_isset(this.atts.query) ? "keywords=" + this.atts.query.split(" ").join("%20") : null);
		var taxonomy = '';
		var taxonomyParam = '';
		var error = null;
		var sortOption = '';
		var link_text = this.atts.link_text;

		if(!error){
			if(keywords === null) {
				error = '"query" parameter cannot be empty.';
			}
		}

		if(error){
			if(ostk_isset(this.atts.category)){
				taxonomyParam = ostk_getTaxonomy(this.atts.category);
				if(!taxonomyParam){
					error = '"category" not found. Please check spelling and try again.';
				} else {
					taxonomy = "&taxonomy=" + taxonomyParam; 
				}
			}
		}

		if(error){
			if(ostk_isset(this.atts.sort_by)){
				sortOptionParam = ostk_getSortOption(this.atts.sort_by);
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
			link_text = (this.atts.link_text !== null ? this.atts.link_text : this.atts.query);
			output = '<a href="'+affiliateLink+'" class="ostk-element ostk-search" '+ostk_getLinkTarget(this.atts)+'>'+link_text+'</a>';
			this.renderHTML(output);
		}
	};//initElement

}//ostk_SearchQuery
