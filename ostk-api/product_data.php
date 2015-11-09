<?php
include_once('functions.php');
/**
 * SINGLE Product Data Class
 * takes a $productId and returns specific product details
 * Usage:
 * 	 $item = new ProductData($productId);
 *   $name = $item->getName();
 *   $price = $item->getPrice():
 *   ...
 * 
 *   IMPORTANT! - You should call $item->isDeveloperIdSet()
 *                each time you generate an embed, and display something to the
 *                affiliate if it returns false, this will help them to debug. 
**/ 

class SingleProductData {
	var $productId;
	var $name;
	var $price;
	var $baseImageUrl;
	var $imgUrl_large;
	var $imgUrl_medium;
	var $imgUrl_thumbnail;
	var $developerId;
	var $affiliateUrl;
	var $averageReviewAsDecimal;
	var $averageReviewAsGif;
	var $numImages;
	var $arrayOfAllProductImages;
	var $description;
	var $validProductID;
	
  function __construct($productId) {
  	//make the api call using product details api
    //https://confluence.overstock.com/display/WIIP/Bridge2Solutions+-+Product+Details+API
	$url = "http://www.overstock.com/api/product.json?prod_id=" . $productId;
	$json = file_get_contents($url);
	$productData = json_decode($json, True);

	if(isset($productData['id'])){
		$this->validProductID = True;
	}else{
		$this->validProductID = False;
	}

	$taxonomyStore = $productData[taxonomy][store][id];
	$this->name = $productData[name];
	$this->productId = $productData[id];
	$this->developerId = $GLOBALS['developerId'];
	if($taxonomyStore == 2 || $taxonomyStore == 3) {
		return ostk_formatError("Our apologies we do not offer <b>'$this->name'</b> for affiliate sale. Product ID is '$productId'");
	} else {
	//we have dynamic pricing types, including COMPARISON_PRICE, DISCOUNTED_AMOUNT, CURRENT_PRICE
	//return only the CURRENT_PRICE (formatted)
		$numPriceSets = count($productData[priceSet]);
		for($i = 0; $i < $numPriceSets; $i++) {
			if ($productData[priceSet][$i][priceType] == "CURRENT_PRICE") {
				$this->price = $productData[priceSet][$i][formattedPrice];
				if($this->price >= 1500) {
				  return ostk_formatError("Maximum price for affiliate items is $1500.");
				}
			}
		}
		$this->baseImageUrl = $productData[meta][imageBaseUrl];

	    $this->numImages = count($productData[oViewerImages]);
	    //we must populate the $arrayOfAllProductImages dynamically based on $numImages
	    $this->arrayOfAllProductImages = array();
	    for($j = 1; $j <= $this->numImages; $j++){ 
	      $imageSizeCount = count($productData[oViewerImages][$j-1][imageSizes]); //each oViewerImage has a dynamic number of sizes, fetch the biggest one
	      $imagePath = $productData[oViewerImages][$j-1][imageSizes][$imageSizeCount-1][imagePath]; //last img in array is the biggest one.
	      $imageUrl = $this->baseImageUrl . $imagePath;
	      array_push($this->arrayOfAllProductImages, $imageUrl);
    	}
    	$this->description = $productData[shortDescription];
		if(empty($this->arrayOfAllProductImages)){
			$this->imgUrl_large = $this->baseImageUrl . $productData[imageLarge];
		}else{
			$this->imgUrl_large = $this->arrayOfAllProductImages[0];
		}
		$this->imgUrl_medium = $this->baseImageUrl . $productData[imageMedium1];
		$this->imgUrl_thumbnail = $this->baseImageUrl . $productData[imageThumbnail];
		$murl = "http%3A%2F%2Fwww.overstock.com%2F" . $this->productId . "%2Fproduct.html";
		$this->affiliateUrl = ostk_generateAffiliateLink($murl);
	    $this->averageReviewAsDecimal = $productData[reviews];

	    if(!empty($productData[rating])){
		    $this->averageReviewAsGif = "http://ak1.ostkcdn.com/" . $productData[rating];
	    }
	}
  }


  function isValidProductID(){
	if(isset($this->productId)){
		return True;
	}else{
		echo ostk_formatError('Invalid product ID');
		return False;
	}
  }

  function getProductId(){
	return (isset($this->productId) ? $this->productId : ostk_formatError("\$productId is not set") );
  }

  function getName() {
    return (isset($this->name) ? $this->name : ostk_formatError("\$name is not set") );
  }

  function getPrice() {
    return (isset($this->price) ? $this->price : ostk_formatError("\$price is not set") );
  }

  function getImageBaseUrl() {
    return (isset($this->baseImageUrl) ? $this->baseImageUrl : ostk_formatError("\$baseImageUrl is not set") );
  }

  function getImage_Thumbnail() {
    return (isset($this->imgUrl_thumbnail) ? $this->imgUrl_thumbnail : ostk_formatError("\$imgUrl_thumbnail is not set") );
  }

  function getImage_Medium() {
    return (isset($this->imgUrl_medium) ? $this->imgUrl_medium : ostk_formatError("\$imgUrl_medium is not set") );
  }

  function getImage_Large() {
    return (isset($this->imgUrl_large) ? $this->imgUrl_large : ostk_formatError("\$imgUrl_large is not set") );
  }

  function getAffiliateUrl(){
	return (isset($this->affiliateUrl) ? $this->affiliateUrl : ostk_formatError("\$affiliateUrl is not set") );
  }
  
  function getAverageReviewAsDecimal(){
  	return (isset($this->averageReviewAsDecimal) ? $this->averageReviewAsDecimal : ostk_formatError("\$averageReviewAsDecimal is not set") );
  }
  
  function getAverageReviewAsGif(){
  	return (isset($this->averageReviewAsGif) ? $this->averageReviewAsGif : ostk_formatError("\$averageReviewAsGif is not set") );
  }
  
  function getImageAtIndex($index){
  	if($index == 1) {
  		return $this->getImage_Large(); 
  	}
  	else {
      $index = $index - 1;
  	  return $this->arrayOfAllProductImages[$index];
  	}
  }
  
  function getArrayOfAllProductImages(){
  	return $this->arrayOfAllProductImages;
  }
  
  function getDescription(){
  	return $this->description;
  }
  
}

/**
 * MULTIPLE Product Data Class
 * takes $query (a API call on the search.json API -> https://confluence.overstock.com/display/EP/Search)
 * & $num (the number of SingleProductData objects to return)
 * Usage:
 *     $products = new MultiProductData("http://www.overstock.com/api/search.json?moretop_sellers=Top+Sellers&taxonomy=sto4", 5);
 *     $productList = $products->getProductList();
 * 	   <img src= <? echo $productList[0]->getImage_Medium(); ?> />
 * 	   
 * Each item in the $productList array is a SingleProductData object, so you can call those instance methods on them.
 * Writing a class that generated the url dynamically would just increase complexity, instead the url is generated on a widget-by-widget basis
 * and the class supports the general API call. 
 * 
 * $num limit is 10
 * 
**/

class MultiProductDataFromArray {
	var $productList = array();
	var $invalidProductIDs = array();
	var $allValidProductIDs = True;

	function __construct($productArray, $limit = null) {
		if($limit !== null){
			$productArray = ostk_limitArrayCount($productArray, $limit);
		}
		foreach ($productArray as $product) {
			$item = new SingleProductData($product);
		    if($item->validProductID){
				array_push($this->productList, $item);
		    }else{
				array_push($this->invalidProductIDs, $product);
				$allValidProductIDs = False;
		    }
		}//foreach
	}//__construct

	function isAllValidProductIDs(){
	    if(count($this->invalidProductIDs) > 0){
	    	$multiMarker = '';
		    if(count($this->invalidProductIDs) > 1){
		    	$multiMarker = 's';
	    	}
	    	echo ostk_formatError('Invalid product ID'.$multiMarker.': '.implode(', ', $this->invalidProductIDs));
	    	return False;
    	}else{
	    	return True;
    	}
	}//isAllValidProductIDs

	function getProductList(){
		return $this->productList;
	}//getProductList
}//MultiProductDataFromArray

class MultiProductDataFromQuery {
	var $productList;
	var $invalidProductIDs = array();
	var $allValidProductIDs = True;

	function __construct($query, $limit) {
		$url = $query;
		$json = file_get_contents($url);
		$productData = json_decode($json, true);
		$numResults = (count($productData[products][products]) > 0) ? count($productData[products][products]) : 0;
		if ($numResults == 0){
		  return ostk_formatError("There were no results for your query. Try filtering by a category, or refining your search term. i.e. diamond bracelet instead of diamond.");
		}
		$temp = $numResults;
		if($numResults > $limit){
			$temp = $limit;
		}
		for ($i = 0; $i < $temp; $i++) {
		  $this->productList[$i] = new SingleProductData($productData[products][products][$i][id]);
		}//for
	}//__construct
   
     function getProductList(){
  	   return $this->productList;
    }//getProductList


	function isAllValidProductIDs(){
	    if(count($this->invalidProductIDs) > 0){
	    	$multiMarker = '';
		    if(count($this->invalidProductIDs) > 1){
		    	$multiMarker = 's';
	    	}
	    	echo ostk_formatError('Invalid product ID'.$multiMarker.': '.implode(', ', $this->invalidProductIDs));
	    	return False;
    	}else{
	    	return True;
    	}
	}//isAllValidProductIDs

}//MultiProductDataFromQuery
?>
