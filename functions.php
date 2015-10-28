<?php
/**
 * Helper functions make all of our lives easier. :)
 * 
**/

add_filter('widget_text', 'do_shortcode');

function generateAffiliateLink($murl) {
	$developerId = $GLOBALS['developerId'];
	$symbol = '?';
	if(strpos($murl, '?') !== false){
		$symbol = '&';
	}
	return 'https://api.overstock.com/ads/deeplink?id='.$developerId.'&mid=38601&murl='.urlencode($murl.$symbol."utm_medium=api&utm_source=linkshare&utm_campaign=241370&CID=241370&devid=".$developerId);
}//generateAffiliateLink

function checkForMissingCommas($string){
	return (strpos($string, " ") === false ? false : true);
}//checkForMissingCommas

function getTaxonomy($input){
	if(is_null($input)) { 
		return formatError("category input was null");
	} else {
		switch ($input) {
			case (checkTaxonomy($input, "Home & Garden") ? true : false):
			  return "sto1";
			  break;
			case (checkTaxonomy($input, "Jewelry & Watches") ? true : false):
			  return "sto4";
			  break;
			case (checkTaxonomy($input, "Sports & Toys") ? true : false):
			  return "sto5";
			  break;
			case (checkTaxonomy($input, "Worldstock Fair Trade") ? true : false):
		      return "sto6";
		      break;
		    case (checkTaxonomy($input, "Clothing & Shoes") ? true : false):
		      return "sto7";
		      break;
		    case (checkTaxonomy($input, "Health & Beauty") ? true : false):
		      return "sto8";
		      break;
		    case (checkTaxonomy($input, "Food & Gifts") ? true : false):
		      return "sto9";
		      break;
		    case (checkTaxonomy($input, "Office Supplies") ? true : false):
		      return "sto22";
		      break;
		    case (checkTaxonomy($input, "Luggage & Bags") ? true : false):
		      return "sto33";
		      break;
		    case (checkTaxonomy($input, "Crafts & Sewing") ? true : false):
		      return "sto34";
		      break;
		    case (checkTaxonomy($input, "Baby") ? true : false):
		      return "sto35";
		      break;
		    case (checkTaxonomy($input, "Crafts & Sewing") ? true : false):
		      return "sto34";
		      break;
		    case (checkTaxonomy($input, "Pet Supplies") ? true : false):
		      return "sto37";
		      break;
		    case (checkTaxonomy($input, "Emergency Preparedness") ? true : false):
		      return "sto42";
		      break;
		    case (checkTaxonomy($input, "Bedding & Bath") ? true : false):
		      return "sto43";
		      break;
		    default :
		      return false;
		}
	}
}//getTaxonomy
	
function checkTaxonomy($input, $taxonomy) {
	$input = strtolower($input);
	$taxonomy = strtolower($taxonomy);
	if ($taxonomy == $input) { 
		return true; 
	}
	$taxonomyArray = explode(' ', $taxonomy);
	if(in_array('&', $taxonomyArray)) { 
		unset($taxonomyArray[1]); 
	}
	foreach ($taxonomyArray as $string) {
	  if($string == $input) {
	  	return true;
	  }	
	}//foreach
	return false;
}//checkTaxonomy

function getSortOption($input){
	switch (strtolower($input)) {
		case strtolower("Relevance"):
			return "Relevance";
			break;
		case strtolower("Recommended"):
			return "Recommended";
			break;
		case strtolower("Reviews"):
			return "Avg.%20Customer%20Review";
			break;
		case strtolower("Name"):
			return "Name";
			break;
		case strtolower("Lowest Price"):
			return "Lowest+Price";
			break;
		case strtolower("Highest Price"):
			return "Highest+Price";
			break;
		case strtolower("New Arrivals"):
			return "New+Arrivals";
			break;
	}//switch
}//getSortOption

function generateLeaderboardHtmlOutput($products, $atts){
  $productList = $products->getProductList();
  $output;
  foreach ($productList as $product){
    $output .= '<div class="element-content">';
		$output .= '<a href="'.$product->getAffiliateUrl().'" '.getLinkTarget($atts).'>';
			$output .= '<img class="product-image" src="'.$product->getImage_Large().'"/>';
			$output .= '<p class="title">'.$product->getName().'</p>';
			$output .= '<p class="description">'.$product->description.'</p>';
			if($product->averageReviewAsGif){
				$output .= '<img src="'.$product->getAverageReviewAsGif().'"/>';
			}
			$output .= '<p class="price">'.$product->getPrice().'</p>';
		$output .= '</a>';
	$output .= '</div>';
  }//foreach
  return $output;
}//generateLeaderboardHtmlOutput

function generateSkyscraperHtmlOutput($products, $atts){
  $productList = $products->getProductList();
  $output;
  foreach ($productList as $product){
    $output .= '<div class="element-content">';
		$output .= '<a href="'.$product->getAffiliateUrl().'" '.getLinkTarget($atts).'>';
			$output .= '<img class="product-image" src="'.$product->getImage_Large().'"/>';
			$output .= '<p class="title">'.$product->getName().'</p>';
			if($product->averageReviewAsGif){
				$output .= '<img src="'.$product->getAverageReviewAsGif().'"/>';
			}
			$output .= '<p class="price">'.$product->getPrice().'</p>';
		$output .= '</a>';
	$output .= '</div>';
  }//foreach
  return $output;
}//generateSkyscraperHtmlOutput

function generateRectangleHtmlOutput($product, $atts){
	$output = '<div class="element-content">';
		$output .= '<img src="'.$product->getImage_Large().'"/>';
	$output .= '</div>';
	$output .= '<div class="element-overlay">';
	    $output .= '<div class="element-content">';
			$output .= '<a href="'.$product->getAffiliateUrl().'" '.getLinkTarget($atts).'>';
				$output .= '<p class="title">'.$product->getName().'</p>';
				if($product->averageReviewAsGif){
					$output .= '<img class="ostk-rating" src="'.$product->getAverageReviewAsGif().'"/>';
				}
				$output .= '<p class="price">'.$product->getPrice().'</p>';
			$output .= '</a>';
		$output .= '</div>';
	$output .= '</div>';
  return $output;
}//generateRectangleHtmlOutput

function generateStockPhotoHtmlOutput($product, $atts){
	$custom_css = $atts['custom_css']; 
	$image_number = $atts['image_number'];
	$image_height = $atts['height'];
	$image_width = $atts['width'];

	$output ="";
    $output .= '<div class="element-content">';
    $custom_css = '';
	$output .= '<img src="'.$product->getImageAtIndex($image_number).'" style="'.$atts['custom_css'].'">';
	$output .= '</div>';
    $output .= '<div class="element-overlay">';
	    $output .= '<div class="element-content">';
			$output .= '<a href="'.$product->getAffiliateUrl().'" '.getLinkTarget($atts).'>';
				$output .= '<p class="title">'.$product->getName().'</p>';
				if($product->averageReviewAsGif){
					$output .= '<img class="ostk-rating" src="'.$product->getAverageReviewAsGif().'"/>';
				}
				$output .= '<p class="price">'.$product->getPrice().'</p>';
				$output .= '<img class="ostk-logo" src="'.plugin_dir_url( __FILE__ ).'images/overstock-logo.png">';
			$output .= '</a>';
		$output .= '</div>';
	$output .= '</div>';
  return $output;
}//generateStockPhotoHtmlOutput

function formatError($str){
	return '<p class="ostk-error">ERROR: '.$str.'</p>';
}//formatError

function checkDeveloperId(){
	return (isset($GLOBALS['developerId']) ? true : false);
}//checkDeveloperId

function generateCarouselHTML($carousel_type, $obj, $atts){
	if($carousel_type == 'carousel'){
		$productList = $obj;
	}else if($carousel_type == 'product_carousel'){
		$product = $obj;
		$productList = $product->getArrayOfAllProductImages();
	}
	if($atts['number_of_items'] !== null){
		$productList = limitArrayCount($productList, $atts['number_of_items']);
	}
	$output .= '<div class="ostk-flexslider">';
		$output .= '<ul class="slides">';
			if($carousel_type == 'carousel'){
				foreach($productList as $product){
					$productImg = $product->getImage_Large();
					$output .= getCarouselListItems($product, $productImg, $atts);
				}//foreach
			}else if($carousel_type == 'product_carousel'){
				foreach($productList as $productImg){
					$output .= getCarouselListItems($product, $productImg, $atts);
				}//foreach
			}
		$output .= '</ul>';
	$output .= '</div>';
	if(count($productList) > 1){
		//only show thumbnail navigation if more than 1 item
		$output .=  '<div class="custom-navigation">';
			$output .= '<a href="#" class="flex-prev">';
				$output .= '<div class="ostk-arrow ostk-arrow-left"></div>';
			$output .= '</a>';
			$output .= '<a href="#" class="flex-next">';
				$output .= '<div class="ostk-arrow  ostk-arrow-right"></div>';
			$output .= '</a>';
			$output .= '<div class="custom-controls-container"></div>';
		$output .= '</div>';
	}
	return $output;
}//generateCarouselHTML

function getCarouselListItems($product, $productImg, $atts){
	$output;
	$output .= '<li data-thumb="'.$productImg.'">';
		    $output .= '<div class="element-content">';
			$output .= '<img src="'.$productImg.'"/>';
		$output .= '</div>';
	    $output .= '<div class="element-overlay">';
			$output .= '<a href="'.$product->getAffiliateUrl().'" '.getLinkTarget($atts).'>';
				$output .= '<p class="title">'.$product->getName().'</p>';
				if($product->averageReviewAsGif){
					$output .= '<img class="ostk-rating" src="'.$product->getAverageReviewAsGif().'"/>';
				}
				$output .= '<p class="price">'.$product->getPrice().'</p>';
				$output .= '<img class="ostk-logo" src="'.plugin_dir_url( __FILE__ ).'images/overstock-logo.png">';
			$output .= '</a>';
		$output .= '</div>';
	$output .= '</li>';
	return $output;
}//getCarouselListItems

function limitArrayCount($product_ids, $num){
	if(count($product_ids) > $num){
		return array_slice($product_ids, 0, $num);
	}else{
		return $product_ids;
	}
}//limitArrayCount

/*
Validate that the shortcode attributes are valid. return Boolean.
*/
function areAttributesValid($atts){
  global $patterns;
  $validShortCode = true;
  $errorStr = '';

  $type = $atts['type'];
  $keys = getKeyList($atts);
  $item = findObjWhereKeyEqualsValue($patterns, 'slug', $type);
  $required_attributes = getListByKey($item['required_attributes'], 'name');
  $optional_attributes = getListByKey($item['optional_attributes'], 'name');

  //Fail if missing any required attributes
  $missingRequiredAtts = lookForMissingRequiredAttributes($keys, $required_attributes);
  if(count($missingRequiredAtts) > 0){
    $validShortCode = false;
    $errorStr = formatError('Missing required attributes: '.implode(', ', $missingRequiredAtts));
  }

  //Fail if using undefined attributes
  if($validShortCode){
    $invalidExtraAtts = lookForInvalidExtraAtts($keys, $required_attributes, $optional_attributes);
    if(count($invalidExtraAtts) > 0){
      $validShortCode = false;
      $errorStr = formatError('The following are not valid attributes: '.implode(', ', $invalidExtraAtts));
    }
  }

  //Fail if any null attributes
  if($validShortCode){
    $nullAtts = lookForNullAtts($atts);
    if(count($nullAtts) > 0){
      $validShortCode = false;
      $errorStr = formatError('The following atts cannot be null: '.implode(', ', $nullAtts));
    }
  }

  if($validShortCode){
    return true;
  }else{
    echo $errorStr;
    return false;
  }

}//areAttributesValid

/* Return a list of the attribute names that have a null value 
(areAttributesValid - helper function) */
function lookForNullAtts($obj){
  $array = array();
  foreach ($obj as $key=>$value) {
    if(empty($value) || is_null($value)){
      array_push($array, $key);
    }
  }//foreach
  return $array;
}//lookForNullAtts

/* Return an array of attributes that are not either in the list of required or optional attributes
(areAttributesValid - helper function) */
function lookForInvalidExtraAtts($keys, $required_attributes, $optional_attributes){
  return array_diff($keys, $required_attributes, $optional_attributes);
}//lookForInvalidExtraAtts

/* Return an array of the required attributes that are missing.
(areAttributesValid - helper function) */
function lookForMissingRequiredAttributes($keys, $required_attributes){
  return array_diff($required_attributes, $keys);
}//lookForMissingRequiredAttributes

/* Return all keys of an object as an array
(areAttributesValid - helper function) */
function getKeyList($obj){
  $array = array();
  foreach ($obj as $key=>$value) {
    array_push($array, $key);
  }//foreach
  return $array;
}//getKeyList

/* Iterate throught an array and return an array of the values of a specific keys
(areAttributesValid - helper function) */
function getListByKey($obj, $key){
  $array = array();
  foreach ($obj as $item) {
    array_push($array, $item[$key]);
  }//foreach
  return $array;
}//getKeyList

/* Iterate throught an array and return the first item that has a specific key with a specific value
(areAttributesValid - helper function) */
function findObjWhereKeyEqualsValue($obj, $key_1, $value_1){
  foreach($obj as $item){
    if($item[$key_1] == $value_1){
      return $item;
    }
  }//foreach
  return null;
}//findObjWhereKeyEquals


function getBranding(){
  $output = '<div class="branding">';
    $output .= '<img src="'.plugin_dir_url( __FILE__ ).'images/overstock-logo-white.png" width="110" height="30"/>';
  $output .= '</div>';
  return $output;
}//getBranding

function getStyles($atts){
  $output;
  if(isset($atts['width'])){
    $output .= 'width:'.$atts['width'].';';
  }
  return 'style="'.$output.'"';
}//getStyles

function getLinkTarget($atts){
  $output;
  if(isset($atts['link_target'])){
    $link_target = $atts['link_target'];
    switch($link_target){
      case 'current_tab':
        $output = '_self';
        break;
      case 'new_window':
        $output = '_parent';
        break;
      default:
        $output = '_blank';
    }//switch
  }else{
    $output = '_blank';
  }
  return "target='".$output."'";
}//getLinkTarget
?>