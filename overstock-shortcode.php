<?php
/*
* Plugin Name: Overstock Affiliate Shortcode Plugin
* Description: Create monetized links to millions of products in seconds. We support 9 different SHORTCODE types including carousel, rectangle and skyscraper. 
* Version: 1.1
* Author: reiftauati and travishoki
* Author URI: http://www.overstock.com/affiliate-portal-homepage
*/

include_once('product_data.php');
include_once('admin_page.php');
include_once('functions.php');

/* Patterns */
include_once('patterns.php');

/* include Pages */
include_once('home_page.php');
include_once('sandbox_page.php');
include_once('doc_page.php');
include_once('contact_page.php');

/* Patterns */
$GLOBALS['developerId'] = get_option('ostk_settings');

add_shortcode('overstock', 'ostk_generateShortcodeWidgets');
add_shortcode('sample_widget', 'ostk_sampleWidget');
add_action( 'wp_enqueue_scripts', 'ostk_load_css' );
add_action( 'wp_enqueue_scripts', 'ostk_load_js' );

/**
 * Overstock Widget Generator
 * consumes a single param -> 'type'
 * then passes the rest of $atts to other functions.
 * Example usage:
 * 1) [overstock type="search" query="book of Mormon"]
 * 2) [overstock type="carousel" category="Pets" number_of_items="5"]
**/
function ostk_generateShortcodeWidgets($atts){
  if($GLOBALS['developerId'] == '' || is_null($GLOBALS['developerId'])){
    return ostk_formatError("Linkshare ID needs to be authenticated."); 
  }
  if(ostk_areAttributesValid($atts) !== True){
    return ostk_areAttributesValid($atts);
  }
  if(is_array($atts) && !in_array($atts['type'], $atts)){ 
    return ostk_formatError("Type parameter cannot be empty.");
  }else if(isset($atts['link_target']) && !ostk_isValidLinkTarget($atts)){ 
    return ostk_formatError('"link_target" not found. Please check spelling and try again.');
  }
  if(isset($atts['width']) && !preg_match("/^[1-9]\d*(px|%)$/i", $atts['width'])){
      return ostk_formatError("Width requires % or px, and a value greater than 0.");
  }
	$type = (is_array($atts) ? $atts['type'] : null);
		switch ($type) {
			case 'search':
				return ostk_generateLinktoSearchPage($atts);
				break;
			case 'link':
				return ostk_generateLinktoAnyPage($atts);
				break;
			case 'rectangle':
				return ostk_generateRectangleWidget($atts);
				break;
			case 'leaderboard':
				return ostk_generateLeaderboardWidget($atts);
				break;
			case 'skyscraper':
				return ostk_generateSkyscraperWidget($atts);
				break;
			case 'carousel':
				return ostk_generateCarouselWidget($atts);
				break;
			case 'stock_photo':
				return ostk_generateStockPhoto($atts);
			case 'product_link':
				return ostk_generateProductLinks($atts);
			case 'product_carousel':
				return ostk_generateProductCarouselWidget($atts);
				break;
			default:
        return ostk_formatError('Shortcode may have been malformed, check the syntax and try again. Refer to our cheat sheet if you have questions.');
		}//switch
}//ostk_generateShortcodeWidgets


/**
 * Pattern 1 - Search query: takes you to search results page
 * Generate a link to a search results page
 * Query is link text if link_text parameter is empty
 * Usage example 
 * 1) [overstock type="search" query="soccer shoes"]
 * 2) [overstock type="search" query="soccer shoes" link_text="Overstock has great soccer shoes"]
**/
function ostk_generateLinktoSearchPage($atts){
	$developerId = $GLOBALS['developerId'];  
	$keywords = (isset($atts['query']) ? "keywords=" . str_replace(" ", "%20", $atts['query']) : null);
  if(empty($keywords)) {
    return ostk_formatError('"query" parameter cannot be empty.');
  }

  if(isset($atts['category'])){
    $taxonomyParam = ostk_getTaxonomy(htmlspecialchars_decode($atts['category']));
    if(empty($taxonomyParam)) {
      return ostk_formatError('"category" not found. Please check spelling and try again.');
    } else {
      $taxonomy = "&taxonomy=" . $taxonomyParam; 
    }
  }

  if(isset($atts['sort_by'])){
    $sortOptionParam = ostk_getSortOption($atts['sort_by']);
    if(empty($sortOptionParam)) {
      return ostk_formatError('"sort_by" not found. Please check spelling and try again.');
    } else {
      $sortOption = "&sortOption=" . $sortOptionParam; 
    }
  }

	$murl = "http://www.overstock.com/search?{$keywords}{$taxonomy}{$sortOption}";
  $affiliateLink = ostk_generateAffiliateLink($murl);
  $link_text = ($atts['link_text'] != null ? $atts['link_text'] : $atts['query']);
  return '<a href="'.$affiliateLink.'" class="ostk-element ostk-search" '.ostk_getLinkTarget($atts).'>'.$link_text.'</a>';
}//ostk_generateLinktoSearchPage

/**
 * Pattern 2 - URL: lets you create links to any overstock page
 * Generate a link to a predefined page on Overstock.com
 * Specify the link_text with the link_text attribute
 * Usage example 
 * 1) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"]
 * 2) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html" link_text="I want to buy this for my wife"]
**/
function ostk_generateLinktoAnyPage($atts){
  $atts = shortcode_atts(
      array(
        'url' => 'http://www.overstock.com/', 
        'link_text' => 'A link to Overstock.com',
        'link_target' => 'new_tab'
      ), $atts);
    $affiliateLink = ostk_generateAffiliateLink($atts['url']);
    $link_text = $atts['link_text'];
    return '<a href="'.$affiliateLink.'" class="ostk-element ostk-link" '.ostk_getLinkTarget($atts).'>'.$link_text.'</a>';
}//ostk_generateLinktoAnyPage

/**
 * Pattern 3 - Rectangle: Lets you create a rectangular banner for a SINGLE product
 * Usage example 
 * 1) [overstock type="rectangle" id="10234427"]
 * 
**/
function ostk_generateRectangleWidget($atts){
  $atts = shortcode_atts(
    array(
      'type' => null,
      'id' => null,
      'width' => null,
      'link_target' => 'new_tab'
    ), $atts);
  $productId = (isset($atts['id']) ? $atts['id'] : null);
  $item = new SingleProductData($productId);
  if($item->isValidProductID()){
    $output = '<div class="ostk-element ostk-'.$atts['type'].'" '.ostk_getStyles($atts).'>';
      $output .= ostk_getBranding();
      $output .= ostk_generateRectangleHtmlOutput($item, $atts);
    $output .= '</div>';
    return $output;
  }
}//ostk_generateRectangleWidget


/**
 * Pattern 4 - Leaderboard: Lets you create a leaderboard banner for up to two products
 * Usage Example
 * 1) [overstock type="leaderboard" product_ids="8641092"]
 * 2) [overstock type="leaderboard" product_ids="8641092, 9547029"]
 * 
**/
function ostk_generateLeaderboardWidget($atts){
  $atts = shortcode_atts(
    array(
      'product_ids' => null,
      'link_target' => 'new_tab'
    ), $atts);
     
  $product_ids = (isset($atts['product_ids']) ? array_map('trim', explode(',', $atts['product_ids'])) : null);
	foreach($product_ids as $ids) {
  	if(ostk_checkForMissingCommas($id) == true) {
  		return ostk_formatError("Commas missing between ids, returning...");
  	}
  }//foreach
  $product_ids = ostk_limitArrayCount($product_ids, 2);
  $products = new MultiProductDataFromArray($product_ids);
  if($products->isAllValidProductIDs()){
    $output = '<div class="ostk-element ostk-leaderboard">';
      $output .= ostk_getBranding();
      $output .= '<div class="item-holder item-count-'.count($product_ids).'">';
        $output .= ostk_generateLeaderboardHtmlOutput($products, $atts);
      $output .= '</div>';
    $output .= '</div>';
  }
  return $output;
}//ostk_generateLeaderboardWidget

/**
 * Pattern 5 - Skyscraper: Lets you create a skyscraper banner for up to three products
 * Usage Example
 * 1) [overstock type="skyscraper" product_ids="8641092"]
 * 2) [overstock type="skyscraper" product_ids="8641092, 9547029"]
 * 3) [overstock type="skyscraper" product_ids="8641092, 9547029, 9547023"]
**/
function ostk_generateSkyscraperWidget($atts){
  $atts = shortcode_atts(
    array(
      'product_ids' => null,
      'width' => null,
      'link_target' => 'new_tab'
    ), $atts);
  $product_ids = (isset($atts['product_ids']) ? array_map('trim', explode(',', $atts['product_ids'])) : null);
   foreach($product_ids as $ids) {
     if(ostk_checkForMissingCommas($id) == true) {
       return ostk_formatError("Commas missing between ids, return ing...");
     }
    }//foreach
  $product_ids = ostk_limitArrayCount($product_ids, 3);
  $products = new MultiProductDataFromArray($product_ids);
  if($products->isAllValidProductIDs()){
    $output = '<div class="ostk-element ostk-skyscraper" '.ostk_getStyles($atts).'>';
      $output .= ostk_getBranding();
      $output .= ostk_generateSkyscraperHtmlOutput($products, $atts);
    $output .= '</div>';
    return $output;
  }
}//ostk_generateSkyscraperWidget

/**
 * Pattern 6 - carousel: Lets you create a carousel banner for up to five products
 * Generate a carousel viewer for a $number_of_products
 * Usage Example
 * 1) [overstock type="carousel" product_ids="8641092, 9547029, 9547023"]
 * 2) [overstock type="carousel" category="Pets" sort_by="Top Sellers"]
 * 3) [overstock type="carousel" keywords="soccer shoes" number_of_items="6"]
**/
function ostk_generateCarouselWidget($atts){
  $atts = shortcode_atts(
    array(
    'category' => null, 
    'number_of_items' => 10,
    'sort_by' => null, 
    'keywords' => null,
    'product_ids' => null,
    'width' => null,
    'link_target' => 'new_tab'
  ), $atts);
  
  $taxonomy = (isset($atts['category'], $atts) ? "&taxonomy=" . ostk_getTaxonomy(htmlspecialchars_decode($atts['category'])) : null);
  $sortOption = (isset($atts['sort_by'], $atts) ? "&sortOption=" . ostk_getSortOption($atts['sort_by']) : '');
  $keywords = (isset($atts['keywords'], $atts) ? "keywords=" . str_replace(' ', '%20', $atts['keywords']) : null);
  $product_ids = (isset($atts['product_ids']) ? array_map('trim', explode(',', $atts['product_ids'])) : null);

  if (isset($taxonomy) && ostk_getTaxonomy(htmlspecialchars_decode($atts['category'])) == false) {
  	return ostk_formatError("category=\"{$atts['category']}\" does not match our given categories, please check it.");
  } else if ($taxonomy == null && $keywords == null && $product_ids == null) {
  	return ostk_formatError("Some required fields are missing, (category or keywords) or (a list of product_ids)");
  } else if (isset($product_ids)) {
  	  foreach($product_ids as $ids) {
      	if(ostk_checkForMissingCommas($id) == true) {
      		return ostk_formatError("Commas missing between ids, return ing...");
      	}
      }//foreach
	  $products = new MultiProductDataFromArray($product_ids);
  } else {
	  $query = "http://www.overstock.com/api/search.json?{$keywords}{$taxonomy}{$sortOption}";
    $products = new MultiProductDataFromQuery($query, $atts['number_of_items']);
  }
  if($products->isAllValidProductIDs()){
    $output = ostk_generateCarouselHTML('carousel', $products->getProductList(), $atts);
    $styles = ostk_getStyles($atts);
    return '<div class="ostk-element ostk-carousel" '.$styles.'>'.$output.'</div>';
  }
}//ostk_generateCarouselWidget

/**
 * Pattern 7 - Stock Photo: lets you create an image link to a product page (stock photo)
 * Allow users to add stock photos to their posts (and get paid for it).
 * Example Usage:
 * 1) [overstock type="stock_photo" id="8859234"]
**/
function ostk_generateStockPhoto($atts){
	$atts = shortcode_atts(
  	  array(
        'id' => null, 
        'height'=> null, 
        'width' => null, 
        'image_number' => '1', 
        'custom_css' => null,
        'link_target' => 'new_tab'
      ), $atts);
    $id = (isset($atts['id']) ? $atts['id'] : null);
    $item = new SingleProductData($id);
    if($item->isValidProductID()){
      if($atts['image_number'] <= $item->numImages){
          $output .= ostk_generateStockPhotoHtmlOutput($item, $atts);
          return '<div class="ostk-element ostk-stock-photo" '.ostk_getStyles($atts).'>'.$output.'</div>';
      }else{
        $imageNumberError = 'Image number '.$atts['image_number'].' is not available.';
        if($item->numImages > 1){
          $imageNumberError .= ' Image numbers from 1 to '. $item->numImages .' are available.';
        }else{
          $imageNumberError .= ' This image only has 1 available image.';
        }
        $imageNumberError .= ' Please change the image_number attribute and try again';
        return ostk_formatError($imageNumberError);
      }
    }
}//ostk_generateStockPhoto

/**
 * Pattern 8 - Product Details Link
 * Allow users to create easy links to products they are showcasing.
 * Example Usage:
 * 1) [overstock type="product_link" id="8859234"]
**/
function ostk_generateProductLinks($atts){
	$atts = shortcode_atts(
  	  array(
        'id' => null,
        'display' => null,
        'link_target' => 'new_tab'
      ), $atts);
  $item = new SingleProductData($atts['id']);
  if($item->isValidProductID()){
    $display = trim($atts['display']);
    $output;
    switch ($display) {
      case 'name':
      $output = $item->getName();
	    break;
	  case "price":
	  	$output = $item->getPrice();
  	  break;
	  case 'description':
      $output = $item->getDescription();
	    break;
	  default:
	  	return ostk_formatError('We do not recognize your display input, please check it.');
    }//switch
    return '<a href="'.$item->getAffiliateUrl().'" class="ostk-element ostk-product-link" '.ostk_getLinkTarget($atts).'>'.$output.'</a>';
  }
}//ostk_generateProductLinks

/**
 * Pattern 9 : product_carousel 
 * Lets you create a carousel for a single product, it shows all product photos
 * Usage Example
 * 1) [overstock type="product_carousel" id="6143359"]
**/
function ostk_generateProductCarouselWidget($atts){
  $atts = shortcode_atts(
    array(
    'id' => null,
    'width' => null,
    'link_target' => 'new_tab',
    'number_of_items' => null
  ), $atts);
  $item = new SingleProductData($atts['id']);
  if($item->isValidProductID()){
    $output = ostk_generateCarouselHTML('product_carousel', $item, $atts);
    return '<div class="ostk-element ostk-carousel" '.ostk_getStyles($atts).'>'.$output.'</div>';
  }
}//ostk_generateProductCarouselWidget

/**
 * Sample Widget takes $productId returns ProductData object
**/
function ostk_sampleWidget($atts) {
  $atts = shortcode_atts(
  	  array(
        'id' => ''
      ), $atts);
      
  $productId = $atts['id'];
  $item = new SingleProductData($productId);
  $output =
<<<HTML
  <p> The name is <b>{$item->getName()}</b></p>
  <p> The price is <b>{$item->getPrice()}</b></p>
  <p> The rating (as decimal is) <b>{$item->getAverageReviewAsDecimal()}</b></p>
  <p> The rating (as gif is)... see below</p>
  <img src= "{$item->getAverageReviewAsGif()}"/>
  <p> <b>Large image:</b></p>
  <a href="{$item->getAffiliateUrl()}"><img src= {$item->getImage_Large()} /></a>
  <p> <b>Medium image:</b></p>
  <a href="{$item->getAffiliateUrl()}"><img src= {$item->getImage_Medium()} /></a>
  <p> <b>Small image:</b></p>
  <a href="{$item->getAffiliateUrl()}"><img src= {$item->getImage_Thumbnail()} /></a>
  <p>The url link is <a href="{$item->getAffiliateUrl()}"><b>here, click me!</b></a></p>
  <p>Also, all photos are clickable.<p>
HTML;
  return $output;
}//ostk_sampleWidget
?>