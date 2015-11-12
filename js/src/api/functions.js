function ostk_generateAffiliateLink(murl){
	var symbol = '?';
	if(murl.indexOf("?") > -1){
		symbol = '&';
	}
	return 'https://api.overstock.com/ads/deeplink?id='+developerId+'&mid=38601&murl='+encodeURIComponent(murl+symbol+"utm_medium=api&utm_source=linkshare&utm_campaign=241370&CID=241370&devid="+developerId);
}//ostk_generateAffiliateLink


function ostk_checkForMissingCommas(string){
	return string.indexOf(" ") === -1 ? false : true;
}//ostk_checkForMissingCommas

function ostk_getTaxonomy(input){
	if(input == null) { 
		return ostk_formatError("category input was null");
	} else {
		switch (input) {
			case (ostk_checkTaxonomy(input, "Home Garden") ? true : false):
			  return "sto1";
			  break;
			case (ostk_checkTaxonomy(input, "Jewelry Watches") ? true : false):
			  return "sto4";
			  break;
			case (ostk_checkTaxonomy(input, "Sports Toys") ? true : false):
			  return "sto5";
			  break;
			case (ostk_checkTaxonomy(input, "Worldstock Fair Trade") ? true : false):
		      return "sto6";
		      break;
		    case (ostk_checkTaxonomy(input, "Clothing Shoes") ? true : false):
		      return "sto7";
		      break;
		    case (ostk_checkTaxonomy(input, "Health Beauty") ? true : false):
		      return "sto8";
		      break;
		    case (ostk_checkTaxonomy(input, "Food Gifts") ? true : false):
		      return "sto9";
		      break;
		    case (ostk_checkTaxonomy(input, "Office Supplies") ? true : false):
		      return "sto22";
		      break;
		    case (ostk_checkTaxonomy(input, "Luggage Bags") ? true : false):
		      return "sto33";
		      break;
		    case (ostk_checkTaxonomy(input, "Crafts Sewing") ? true : false):
		      return "sto34";
		      break;
		    case (ostk_checkTaxonomy(input, "Baby") ? true : false):
		      return "sto35";
		      break;
		    case (ostk_checkTaxonomy(input, "Crafts Sewing") ? true : false):
		      return "sto34";
		      break;
		    case (ostk_checkTaxonomy(input, "Pet Supplies") ? true : false):
		      return "sto37";
		      break;
		    case (ostk_checkTaxonomy(input, "Emergency Preparedness") ? true : false):
		      return "sto42";
		      break;
		    case (ostk_checkTaxonomy(input, "Bedding Bath") ? true : false):
		      return "sto43";
		      break;
		    default :
		      return false;
		}
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
	}//switch
}//ostk_getSortOption

function ostk_generateLeaderboardHtmlOutput(products, atts){
  var productList = products.getProductList();
  var output = '';
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
  return output;
}//ostk_generateLeaderboardHtmlOutput

function ostk_generateSkyscraperHtmlOutput(products, atts){
  var productList = products.getProductList();
  var output = '';
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
  return output;
}//ostk_generateSkyscraperHtmlOutput

function ostk_generateRectangleHtmlOutput(product, atts){
	var output = '';
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
  return output;
}//ostk_generateRectangleHtmlOutput

function ostk_generateStockPhotoHtmlOutput(product, atts){
	var output = '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(atts)+'>';
	    output += '<div class="element-content">';
			output += '<img src="'+product.getImageAtIndex(atts['image_number'])+'" width="'+atts['width']+'" height="'+atts['height']+'" style="'+atts['custom_css']+'">';
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
  return output;
}//ostk_generateStockPhotoHtmlOutput

function ostk_formatError(str){
	return '<p class="ostk-error">ERROR: '+str+'</p>';
}//ostk_formatError

function ostk_checkDeveloperId(){
	return (ostk_isset(developerId) ? true : false);
}//ostk_checkDeveloperId

function ostk_generateCarouselHTML(carousel_type, obj, atts){
	var output = '';
	var productList;
	var product;
	if(carousel_type == 'carousel'){
		productList = obj;
	}else if(carousel_type == 'product_carousel'){
		product = obj;
		productList = product.getArrayOfAllProductImages();
	}
	if(atts['number_of_items'] !== null){
		productList = ostk_limitArrayCount(productList, atts['number_of_items']);
	}
	output += '<div class="ostk-flexslider">';
		output += '<ul class="slides">';
			if(carousel_type == 'carousel'){
				for(var i = 0 ; i < productList.length ; i++){
					var product = productList[i];
					productImg = product.getImage_Large();
					output += ostk_getCarouselListItems(product, productImg, atts);
				}//foreach
			}else if(carousel_type == 'product_carousel'){
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
	if(product_ids.length > num){
		return array_slice(product_ids, 0, num);
	}else{
		return product_ids;
	}
}//ostk_limitArrayCount

/*
Validate that the shortcode attributes are valid. return Boolean.
*/
function ostk_areAttributesValid(atts){
  var validShortCode = true;
  var errorStr = '';

  var type = atts['type'];
  var keys = ostk_getKeyList(atts);
  var item = ostk_findObjWhereKeyEqualsValue(ostk_patterns, 'slug', type);
  var required_attributes = ostk_getListByKey(item['required_attributes'], 'name');
  var optional_attributes = ostk_getListByKey(item['optional_attributes'], 'name');

  //Fail if missing any required attributes
  var missingRequiredAtts = ostk_lookForMissingRequiredAttributes(keys, required_attributes);
  if(missingRequiredAtts.length > 0){
    validShortCode = false;
    return ostk_formatError('Missing required attributes: '.implode(', ', missingRequiredAtts));
  }

  //Fail if using undefined attributes
  if(validShortCode){
    invalidExtraAtts = ostk_lookForInvalidExtraAtts(keys, required_attributes, optional_attributes);
    if(invalidExtraAtts.length > 0){
      validShortCode = false;
      return ostk_formatError('The following are not valid attributes: '.implode(', ', invalidExtraAtts));
    }
  }

  //Fail if any null attributes
  if(validShortCode){
    nullAtts = ostk_lookForNullAtts(atts);
    if(nullAtts.length > 0){
      validShortCode = false;
      return ostk_formatError('The following atts cannot be null: '.implode(', ', nullAtts));
    }
  }

	return true;
}//areAttributesValid


/* Return a list of the attribute names that have a null value 
(ostk_areAttributesValid - helper function) */
function ostk_lookForNullAtts(obj){
  var array = Array();
  for(var key in obj){
  	var value = obj[key];
    if(value == '' || value == null){
    	array.push(key);
    }
  }//for
  return array;
}//ostk_lookForNullAtts

/* Return an array of attributes that are not either in the list of required or optional attributes
(ostk_areAttributesValid - helper function) */
function ostk_lookForInvalidExtraAtts(keys, required_attributes, optional_attributes){
  return ostk_array_diff(keys, required_attributes, optional_attributes);
}//ostk_lookForInvalidExtraAtts

/* Return an array of the required attributes that are missing.
(ostk_areAttributesValid - helper function) */
function ostk_lookForMissingRequiredAttributes(keys, required_attributes){
  return ostk_array_diff(required_attributes, keys);
}//ostk_lookForMissingRequiredAttributes

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
}

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

/* Find difference between arrays like php diff() */
function ostk_array_diff(arr1) {
  var retArr = {},
    argl = arguments.length,
    k1 = '',
    i = 1,
    k = '',
    arr = {};
  arr1keys: for (k1 in arr1) {
    for (i = 1; i < argl; i++) {
      arr = arguments[i];
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys;
        }
      }
      retArr[k1] = arr1[k1];
    }
  }
  return retArr;
}//ostk_array_diff

/* check to see if key exists like php array_key_exists() */
function ostk_array_key_exists(key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }
  return key in search;
}//ostk_array_key_exists