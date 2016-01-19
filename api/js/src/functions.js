function ostk_searchURLForParam(url, str){
	if(url.indexOf("?") > -1 && url.indexOf(str)){
		var params = url.split('?')[1];
		var param_items = params.split('&');
		for(var k = 0 ; k < param_items.length ; k++){
			var param_pieces = param_items[k].split('=');
			var key = param_pieces[0];
			var value = param_pieces[1];
			if(key == str){
				return value 
				break;
			}
		}//for
	}
	return null;
}//ostk_searchURLForParam

function ostk_getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}//ostk_getRandomInt

function ostk_getTimeDiff(dealEndTime){
	var endTime = new Date(dealEndTime);
	var currentTime = new Date();
	return endTime - currentTime;
}//ostk_getTimeDiff

function ostk_make_two_digits(int){
	if(int < 10){
		return '0' + int;
	}else{
		return int;
	}
}//ostk_make_two_digits

function ostk_generateAffiliateLink(murl){
	console.log('-- ostk_generateAffiliateLink --');
	var symbol = '?';
	if(murl.indexOf("?") > -1){
		symbol = '&';
	}
	return 'https://api.test.overstock.com/ads/deeplink'
	+ '?id='+ostk_developerId
	+ '&clickplatform='+ostk_clickPlatform + '&clickurl='+ostk_clickurl
	+ '&mid=38601&murl='+encodeURIComponent(murl+symbol+"utm_medium=api&utm_source=linkshare&utm_campaign=241370&CID=241370&devid="+ostk_developerId);

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
	var query = ostk_findObjWhereKeyEqualsValue(event_list, 'event', event);
	if(query){
		return query.url;
	}else{
		return null;
	}
}//ostk_getEventQuery

function ostk_stringToList(str){
	str = str.split(' ').join(','); //Replace spaces with commas
	str = str.split(',,').join(','); //If the above replace caused ",," just make it 1 comma
	return str.split(',');
}//ostk_stringToList

function ostk_formatError(str){
	return '<p class="ostk-error">ERROR: '+str+'</p>';
}//ostk_formatError

function ostk_checkDeveloperId(){
	return (ostk_isset(ostk_developerId) ? true : false);
}//ostk_checkDeveloperId

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
	var type = atts.type;

	if(!type){
		error = 'Type attribute is required';
	}

	if(!error){
		var keys = ostk_getKeyList(atts);
		var item = ostk_patterns[type];
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
			error = 'Missing required attributes: ' + ostk_array_to_list_string(missingRequiredAtts, '&');
		}
	}

	//Fail if using undefined attributes, null values, or a value that is not an option
	if(!error){
		var invalidExtraAtts = ostk_lookForInvalidAtts(atts, required_attributes, optional_attributes);
		if(invalidExtraAtts.length > 0){
			error = 'The following are not valid attributes: ' + ostk_array_to_list_string(invalidExtraAtts, '&');
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
			//if the missing attribute has options that are objects
			if(ra['options'] && typeof(ra['options'][0]['name']) != 'undefined'){
				var option_fulfilled = false;
				//Loop through missing attributes' options
				for(var k = 0 ; k < ra['options'].length ; k++){
					var option_key = '';
					option_key = ra['options'][k]['name'];
					if(atts[option_key]){
						option_fulfilled = true;
					}
				}//for
				if(!option_fulfilled){
					//None of the options where fullfilled
					var missing_options_list = ostk_getListByKey(ra['options'], 'name');
					var missing_options_string = ostk_array_to_list_string(missing_options_list, 'or');
					missing_atts.push('(' +  missing_options_string + ')');
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
	invalid_atts = ostk_lookForInvalidAttsInArray(keys, array);
	return ostk_getKeyList(invalid_atts);
}//ostk_lookForInvalidAtts

/* Return an array of attributes that are not in a given list
used for both require and optional att arrays */
function ostk_lookForInvalidAttsInArray(keys, array){
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
}//ostk_lookForInvalidAttsInArray

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

function ostk_getStyles(atts){
	var output = '';
	if(ostk_isset(atts.width)){
		output = 'width:'+atts.width+';';
	}
  return 'style="'+output+'"';
}//ostk_getStyles

function ostk_isValidLinkTarget(atts){
	switch(atts.link_target){
	  case 'new_tab':
	  case 'current_tab':
			return true;
	  default:
			return false;
	}//switch
}//ostk_isValidLinkTarget

function ostk_getLinkTarget(atts){
  var output = '_blank';
	if(atts.link_target){
		switch(atts.link_target){
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

/* Return a string given an array that is comma seperated with an or clause */
function ostk_array_to_list_string(a, deliminator){
  switch(a.length){
    case 0:
      return '';
    case 1:
      return a[0];
    case 2:
      return a.join(' '+deliminator+' ');
    default:
      return a.slice(0, a.length-1).join(', ') + ', '+deliminator+' ' + a[a.length-1];
  }//switch
}//ostk_array_to_and_list_string
