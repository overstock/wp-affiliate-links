function setDeveloperID(){
	developerId = 'FKAJQ7bUdyM';
}//setDeveloperID

function ostk_shortcode_atts(obj, atts){
  var output = Array();
  /* hoki make sure this is working */
  // foreach(pairs as name => default) {
  for(var key in obj){
  	var value = obj[key];
    if (ostk_array_key_exists(key, atts)){
      output[key] = atts[key];
    }else{
      output[key] = value;
		}
  }//for
  return output;
}//ostk_shortcode_atts

function ostk_generateAffiliateLink(murl){
	var symbol = '?';
	if(murl.indexOf("?") > -1){
		symbol = '&';
	}
	return 'https://api.overstock.com/ads/deeplink?id='+developerId+'&mid=38601&murl='+encodeURIComponent(murl+symbol+"utm_medium=api&utm_source=linkshare&utm_campaign=241370&CID=241370&devid="+developerId);
}//ostk_generateAffiliateLink

function ostk_getTaxonomy(input){
	if(input == null) { 
		return false;
	} else {
		switch (input) {
			case "Home & Garden":
			  return "sto1";
			  break;
			case "Jewelry & Watches":
			  return "sto4";
			  break;
			case "Sports & Toys":
			  return "sto5";
			  break;
			case "Worldstock Fair Trade":
		      return "sto6";
		      break;
		    case "Clothing & Shoes":
		      return "sto7";
		      break;
		    case "Health & Beauty":
		      return "sto8";
		      break;
		    case "Food & Gifts":
		      return "sto9";
		      break;
		    case "Office Supplies":
		      return "sto22";
		      break;
		    case "Luggage & Bags":
		      return "sto33";
		      break;
		    case "Baby":
		      return "sto35";
		      break;
		    case "Crafts & Sewing":
		      return "sto34";
		      break;
		    case "Pet Supplies":
		      return "sto37";
		      break;
		    case "Emergency Preparedness":
		      return "sto42";
		      break;
		    case "Bedding & Bath":
		      return "sto43";
		      break;
		    default:
		      return false;
		}//switch
	}
}//ostk_getTaxonomy
	
function ostk_checkTaxonomy(input, taxonomy) {
	input = strtolower(input);
	taxonomy = strtolower(taxonomy);
	if (taxonomy == input) { 
		return true; 
	}
	taxonomyArray = explode(' ', taxonomy);
	if(in_array('&', taxonomyArray)) { 
		unset(taxonomyArray[1]); 
	}
	for(var i = 0 ; i < taxonomyArray.length ; i++){
	  if(taxonomyArray[i] == input) {
	  	return true;
	  }	
	}//for
	return false;
}//ostk_checkTaxonomy

function ostk_getSortOption(input){
	switch (input.toLowerCase()) {
		case "Relevance".toLowerCase():
			return "Relevance";
			break;
		case "Recommended".toLowerCase():
			return "Recommended";
			break;
		case "Reviews".toLowerCase():
			return "Avg.%20Customer%20Review";
			break;
		case "Name".toLowerCase():
			return "Name";
			break;
		case "Lowest Price".toLowerCase():
			return "Lowest+Price";
			break;
		case "Highest Price".toLowerCase():
			return "Highest+Price";
			break;
		case "New Arrivals".toLowerCase():
			return "New+Arrivals";
			break;
		default:
			return null;
	}//switch
}//ostk_getSortOption

function ostk_getEventQuery(event){
	var output = '';
	switch(event){
		case "Flash Deals":
			output = 'https://api.overstock.com/ads/products?developerid=test&taxonomy=sto1'
			break;
		case "Product Chooser":
			output = 'https://api.overstock.com/ads/products?developerid=test&taxonomy=sto4'
			break;
		case "Promotions":
			output = 'https://api.overstock.com/ads/products?developerid=test&taxonomy=sto5'
			break;
	}//switch
	return output;
}//ostk_getEventQuery


function ostk_stringToList(str){
	str = str.split(' ').join(','); //Replace spaces with commas
	str = str.split(',,').join(','); //If the above replace caused ",," just make it 1 comma
	return str.split(',');
}//ostk_stringToList

function ostk_generateRectangleHtmlOutput(product, atts){
	var output = '';
	output += '<div class="ostk-element ostk-'+atts['type']+'" '+ostk_getStyles(atts)+'>';
		output += '<div class="ostk-element-inner">';
			output += ostk_getBranding();
			output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
				output += '<div class="element-content">';
					output += '<img src="'+product.getImage_Large()+'"/>';
				output += '</div>';
				output += '<div class="element-overlay">';
				    output += '<div class="element-content">';
						output += '<p class="title">'+product.getName()+'</p>';
						if(product.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+product.getPrice()+'</p>';
					output += '</div>';
				output += '</div>';
			output += '</a>';
		output += '</div><!-- ostk-element-inner -->';
	output += '</div><!-- ostk-element -->';
	return output;
}//ostk_generateRectangleHtmlOutput

function ostk_generateLeaderboardHtmlOutput(products, atts){
  var productList = products.getProductList();
  var output = '';
	output += '<div class="ostk-element ostk-leaderboard">';
		output += '<div class="ostk-element-inner">';
			output += ostk_getBranding();
			output += '<div class="item-holder item-count-'+productList.length+'">';
				for(var i = 0 ; i < productList.length ; i++){
					var product = productList[i];
				    output += '<div class="element-content">';
						output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
							output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';
							output += '<p class="title">'+product.getName()+'</p>';
							output += '<p class="description">'+product.description+'</p>';
							if(product.averageReviewAsGif){
								output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
							}
							output += '<p class="price">'+product.getPrice()+'</p>';
						output += '</a>';
					output += '</div>';
				}//for
			output += '</div>';
		output += '</div><!-- ostk-element-inner -->';
	output += '</div><!-- ostk-element -->';
	return output;
}//ostk_generateLeaderboardHtmlOutput

function ostk_generateSkyscraperHtmlOutput(products, atts){
	var productList = products.getProductList();
	var output = '';
	output += '<div class="ostk-element ostk-skyscraper" '+ostk_getStyles(atts)+'>';
		output += '<div class="ostk-element-inner">';
			output += ostk_getBranding();

			for(var i = 0 ; i < productList.length ; i++){
		    var product = productList[i];
		    output += '<div class="element-content">';
				output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
					output += '<img class="product-image" src="'+product.getImage_Large()+'"/>';
					output += '<p class="title">'+product.getName()+'</p>';
					if(product.averageReviewAsGif){
						output += '<img src="'+product.getAverageReviewAsGif()+'"/>';
					}
					output += '<p class="price">'+product.getPrice()+'</p>';
				output += '</a>';
			output += '</div>';
		  }//for

		output += '</div><!-- ostk-element-inner -->';
	output += '</div><!-- ostk-element -->';
	return output;
}//ostk_generateSkyscraperHtmlOutput

function ostk_generateStockPhotoHtmlOutput(product, atts){
	var output = '';
	output += '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(atts)+'>';
		output += '<div class="ostk-element-inner">';
			output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
			    output += '<div class="element-content">';
					output += '<img src="'+product.getImageAtIndex(atts['image_number']-1)+'" width="'+atts['width']+'" height="'+atts['height']+'" style="'+atts['custom_css']+'">';
					output += '</div>';
				    output += '<div class="element-overlay">';
					    output += '<div class="element-content">';
							output += '<p class="title">'+product.getName()+'</p>';
							if(product.averageReviewAsGif){
								output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
							}
							output += '<p class="price">'+product.getPrice()+'</p>';
							output += '<img class="ostk-logo" src="'+ostk_api_url+'images/overstock-logo.png">';
					output += '</div>';
				output += '</div>';
			output += '</a>';
		output += '</div><!-- ostk-element-inner -->';
	output += '</div><!-- ostk-element -->';
  return output;
}//ostk_generateStockPhotoHtmlOutput

function ostk_formatError(str){
	return '<p class="ostk-error">ERROR: '+str+'</p>';
}//ostk_formatError

function ostk_checkDeveloperId(){
	return (ostk_isset(developerId) ? true : false);
}//ostk_checkDeveloperId

function ostk_generateCarouselHTML(obj, atts, muliProduct){
	var output = '';
	var productList;
	var product;
	if(muliProduct){
		productList = obj.productList;
	}else{
		product = obj;
		productList = product.getArrayOfAllProductImages();
	}

	if(atts['number_of_items'] !== null){
		productList = ostk_limitArrayCount(productList, atts['number_of_items']);
	}

	output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>';
        output += '<div class="ostk-element-inner">';

			output += '<div class="ostk-flexslider">';
				output += '<ul class="slides">';

					if(muliProduct){
						for(var i = 0 ; i < productList.length ; i++){
							var product = productList[i];
							productImg = product.getImage_Large();
							output += ostk_getCarouselListItems(product, productImg, atts);
						}//foreach
					}else{
						for(var i = 0 ; i < productList.length ; i++){
							var productImg = productList[i];
							output += ostk_getCarouselListItems(product, productImg, atts);
						}//foreach
					}

				output += '</ul>';
			output += '</div>';

			if(productList.length > 1){
				//only show thumbnail navigation if more than 1 item
				output +=  '<div class="custom-navigation count-'+productList.length+'">';
					output += '<a href="#" class="flex-prev">';
						output += '<div class="ostk-arrow ostk-arrow-left"></div>';
					output += '</a>';
					output += '<a href="#" class="flex-next">';
						output += '<div class="ostk-arrow  ostk-arrow-right"></div>';
					output += '</a>';
					output += '<div class="custom-controls-container"></div>';
				output += '</div>';
			}

		output += '</div><!-- ostk-element-inner -->';
	output += '</div><!-- ostk-element -->';

	return output;
}//ostk_generateCarouselHTML

function ostk_getCarouselListItems(product, productImg, atts){
	var output = '';
	output += '<li data-thumb="'+productImg+'">';
		output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
		    output += '<div class="element-content">';
				output += '<img src="'+productImg+'"/>';
			output += '</div>';
		    output += '<div class="element-overlay">';
					output += '<p class="title">'+product.getName()+'</p>';
					if(product.averageReviewAsGif){
						output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
					}
					output += '<p class="price">'+product.getPrice()+'</p>';
					output += '<img class="ostk-logo" src="'+ostk_api_url+'images/overstock-logo.png">';
			output += '</div>';
		output += '</a>';
	output += '</li>';
	return output;
}//ostk_getCarouselListItems

function ostk_limitArrayCount(product_ids, num){
	if(typeof product_ids === 'string'){
		product_ids = ostk_stringToList(product_ids);
	}

	if(product_ids.length > num){
		return product_ids.splice(0, num);
	}else{
		return product_ids;
	}
}//ostk_limitArrayCount

/*
Validate that the shortcode attributes are valid. return Boolean.
*/
function ostk_areAttributesValid(atts){
	var error = null;
	var type = atts['type'];

	if(!type){
		error = 'Type attribute is required';
	}

	if(!error){
		var keys = ostk_getKeyList(atts);
		var item = ostk_findObjWhereKeyEqualsValue(ostk_patterns, 'slug', type);
		if(!item){
	    	error = 'Invalid type attribute';
		}else{
			var required_attributes = item['required_attributes'];
			var optional_attributes = item['optional_attributes'];
		}
	}

	//Fail if missing any required attributes
	if(!error){
		var missingRequiredAtts = ostk_lookForMissingRequiredAttributes(atts, required_attributes);
		if(missingRequiredAtts.length > 0){
			error = 'Missing required attributes: ' + missingRequiredAtts.join(', ');
		}
	}

	//Fail if using undefined attributes, null values, or a value that is not an option
	if(!error){
		var invalidExtraAtts = ostk_lookForInvalidAtts(atts, required_attributes, optional_attributes);
		if(invalidExtraAtts.length > 0){
			error = 'The following are not valid attributes: ' + invalidExtraAtts.join(', ');
		}
	}

	if(error){
		return error;
	}else{
		return true;
	}

}//areAttributesValid

/* Return an array of the required attributes that are missing.
(ostk_areAttributesValid - helper function) */
function ostk_lookForMissingRequiredAttributes(atts, required_attributes){
	var missing_atts = Array();
	//Loop through required attributes
	for (var i = 0 ; i < required_attributes.length; i++) {
		var ra = required_attributes[i];
		var key = ra['name'];
		if(!atts[key]){
			//if the missing attribute has options
			if(ra['options']){
				var option_fulfilled = false;
				//Loop through missing attributes' options
				for(var k = 0 ; k < ra['options'].length ; k++){
					var option_key = ra['options'][k]['name'];
					//if one of the options is included in the atts
					if(atts[option_key]){
						option_fulfilled = true;
					}
				}//for
				if(!option_fulfilled){
					//None of the options where fullfilled
					missing_atts.push('(' + ostk_getListByKey(ra['options'], 'name').join(' or ') + ')');
				}
			}else{
				//Missing attribute doesn't have options so push it ot the missing array
				missing_atts.push(key);
			}
		}
	}//for
	return missing_atts;
}//ostk_lookForMissingRequiredAttributes

/* Return an array of attributes that are not either in the list of required or optional attributes
(ostk_areAttributesValid - helper function) */
function ostk_lookForInvalidAtts(keys, required_attributes, optional_attributes){
	var invalid_atts = Array();
	var array = $ostk_jQuery.merge($ostk_jQuery.merge([], optional_attributes), required_attributes);
	invalid_atts = ostk_lookFoInvalidAttsInArray(keys, array);
	return ostk_getKeyList(invalid_atts);
}//ostk_lookForInvalidAtts

/* Return an array of attributes that are not in a given list
used for both require and optional att arrays */
function ostk_lookFoInvalidAttsInArray(keys, array){
	var invalid_atts = {};
	//Loop through keys

	for(var key in keys){
		//not valid until finding that the key in the array 
		var value = keys[key];
		var is_valid = false;

		for(var k = array.length-1 ; k >= 0 ; k--){
			var a = array[k];
			var a_key = a['name'];
			//if the attribure has options dig deeper
			if(a['options']){
				if(a['options'][0]['name']){
					//options are objects not just strings
					for(var z = 0 ; z < a['options'].length ; z++){
						var a_op = a['options'][z];	
						var a_op_key = a_op['name'];	
						if(key === a_op_key){
							is_valid = true;
							break;
						}
					}//for
				}else{
					//options are just strings
					if(key === a_key){
						var found_it = false;
						for(var z = 0 ; z < a['options'].length ; z++){
							var a_op_key = a['options'][z];
							if(value === a_op_key){
								found_it = true;
								break;
							}
						}//for	
						if(found_it){
							is_valid = true;
							break;
						}else{
							is_valid = false;
						}
					}
				}
			}else{
				// att does not have options
				if(key === a_key){
					is_valid = true;
					break;
				}
			}
		}//for

		if(!is_valid){
			invalid_atts[key] = value;
			array.splice(k, 1);
		}
	}//for
	return invalid_atts
}//ostk_lookFoInvalidAttsInArray


/* Return all keys of an object as an array
(ostk_areAttributesValid - helper function) */
function ostk_getKeyList(obj){
	var array = Array();
	for(var key in obj){
		array.push(key);
	}//for
	return array;
}//ostk_getKeyList

/* Iterate throught an array and return an array of the values of a specific keys
(ostk_areAttributesValid - helper function) */
function ostk_getListByKey(obj, key){
  var array = Array();
  for(var i = 0 ; i < obj.length ; i++){
  	var item = obj[i];
    array.push(item[key]);
  }//foreach
  return array;
}//ostk_getKeyList

/* Iterate throught an array and return the first item that has a specific key with a specific value
(ostk_areAttributesValid - helper function) */
function ostk_findObjWhereKeyEqualsValue(obj, key_1, value_1){
  for(var i = 0 ; i < obj.length ; i++){
  	var item = obj[i];
    if(item[key_1] == value_1){
      return item;
    }
  }//for
  return null;
}//findObjWhereKeyEquals

function ostk_getBranding(){
	var output = '';
	output = '<div class="branding">';
		output += '<img src="'+ostk_api_url+'images/overstock-logo-white.png" width="110" height="30"/>';
	output += '</div>';
	return output;
}//ostk_getBranding

function ostk_getStyles(atts){
	var output = '';
	if(ostk_isset(atts['width'])){
		output = 'width:'+atts['width']+';';
	}
  return 'style="'+output+'"';
}//ostk_getStyles

function ostk_isValidLinkTarget(atts){
	switch(atts['link_target']){
	  case 'new_tab':
	  case 'current_tab':
			return true;
	  default:
			return false;
	}//switch
}//ostk_isValidLinkTarget

function ostk_getLinkTarget(atts){
  var output = '_blank';
	if(atts['link_target']){
		switch(atts['link_target']){
		  case 'current_tab':
		    output = '_self';
		    break;
		}//switch
	}
	return "target='"+output+"'";
}//ostk_getLinkTarget

/* Check if defined or not link php ostk_isset() */
function ostk_isset(item){
	if(item == null){
		return false;
	}else if(typeof item === "undefined"){
		return false;
	}else{
		return true;
	}
}//ostk_isset

/* check to see if key exists like php array_key_exists() */
function ostk_array_key_exists(key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }
  return key in search;
}//ostk_array_key_exists