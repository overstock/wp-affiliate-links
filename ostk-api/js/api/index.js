var developerId = 'FKAJQ7bUdyM';

function ostk_generateShortcodeWidgets(atts){
	console.log('-- ostk_generateShortcodeWidgets --');
	console.dir(atts);
/*
	if(developerId == '' || developerId == null){
		return ostk_formatError("Linkshare ID needs to be authenticated."); 
	}
	if(ostk_areAttributesValid(atts) !== true){
		return ostk_areAttributesValid(atts);
	}
	if(is_array(atts) && !in_array(atts['type'], atts)){ 
		return ostk_formatError("Type parameter cannot be empty.");
	}else if(isset(atts['link_target']) && !ostk_isValidLinkTarget(atts)){ 
		return ostk_formatError('"link_target" not found. Please check spelling and try again.');
	}

	if(isset(atts['width']) && !preg_match("/^[1-9]\d*(px|%)$/i", atts['width'])){
		return ostk_formatError("Width requires % or px, and a value greater than 0.");
	}
	var type = (is_array(atts) ? atts['type'] : null);
		switch ($type) {
			case 'search':
				return ostk_generateLinktoSearchPage(atts);
				break;
			case 'link':
				return ostk_generateLinktoAnyPage(atts);
				break;
			case 'rectangle':
				return ostk_generateRectangleWidget(atts);
				break;
			case 'leaderboard':
				return ostk_generateLeaderboardWidget(atts);
				break;
			case 'skyscraper':
				return ostk_generateSkyscraperWidget(atts);
				break;
			case 'carousel':
				return ostk_generateCarouselWidget(atts);
				break;
			case 'stock_photo':
				return ostk_generateStockPhoto(atts);
			case 'product_link':
				return ostk_generateProductLinks(atts);
			case 'product_carousel':
				return ostk_generateProductCarouselWidget(atts);
				break;
			default:
	    return ostk_formatError('Shortcode may have been malformed, check the syntax and try again. Refer to our cheat sheet if you have questions.');
		}//switch
*/
};