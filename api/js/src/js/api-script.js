var developerId = 'FKAJQ7bUdyM';

function shortcode_atts(obj, atts){
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
}//shortcode_atts

/**
 * Overstock Widget Generator
 * consumes a single param . 'type'
 * then passes the rest of atts to other functions.
 * Example usage:
 * 1) [overstock type="search" query="book of Mormon"]
 * 2) [overstock type="carousel" category="Pets" number_of_items="5"]
**/
function ostk_generateShortcodeWidgets(atts, _this, callback){
  console.log('-- ostk_generateShortcodeWidgets --');
  var error = null;
  if(developerId == '' || developerId == null){
    error = ostk_formatError("Linkshare ID needs to be authenticated."); 
  }

  switch(atts['type']){
    case 'stock_photo':
    case 'product_carousel':
      error = ostk_formatError("Invalid type parameter");
      break;
  }//switch

  if(ostk_areAttributesValid(atts) !== true){
    callback(_this, ostk_areAttributesValid(atts));
  }
  if(atts['type'] == '' || atts['type'] == null){ 
    error = ostk_formatError("Type parameter cannot be empty.");
  }else if(ostk_isset(atts['link_target']) && !ostk_isValidLinkTarget(atts)){ 
    error = ostk_formatError('"link_target" not found. Please check spelling and try again.');
  }
  // hoki - check to make sure that this pregmatch is working
  var regex = /^[1-9]\d*(px|%)/i;
  if(ostk_isset(atts['width']) && !regex.exec(atts['width'])){
  // if(ostk_isset(atts['width']) && !preg_match("/^[1-9]\d*(px|%)/i", atts['width'])){
      error = ostk_formatError("Width requires % or px, and a value greater than 0.");
  }
  if(error === null){
  	switch (atts['type']) {
  		case 'search':
  			ostk_generateLinktoSearchPage(atts, _this, callback);
  			break;
  		case 'link':
  			ostk_generateLinktoAnyPage(atts, _this, callback);
  			break;
  		case 'rectangle':
  			ostk_generateRectangleWidget(atts, _this, callback);
  			break;
  		case 'leaderboard':
  			ostk_generateLeaderboardWidget(atts, _this, callback);
  			break;
  		case 'skyscraper':
  			ostk_generateSkyscraperWidget(atts, _this, callback);
  			break;
  		case 'carousel':
  			ostk_generateCarouselWidget(atts, _this, callback);
  			break;
  		case 'stock_photo':
  			ostk_generateStockPhoto(atts, _this, callback);
  			break;
  		case 'product_link':
  			ostk_generateProductLinks(atts, _this, callback);
  			break;
  		case 'product_carousel':
  			ostk_generateProductCarouselWidget(atts, _this, callback);
  			break;
  	}//switch
  }else{
    callback(_this, error);
  }
}//ostk_generateShortcodeWidgets


/**
 * Pattern 1 - Search query: takes you to search results page
 * Generate a link to a search results page
 * Query is link text if link_text parameter is empty
 * Usage example 
 * 1) [overstock type="search" query="soccer shoes"]
 * 2) [overstock type="search" query="soccer shoes" link_text="Overstock has great soccer shoes"]
**/
function ostk_generateLinktoSearchPage(atts, _this, elementGenerationCallback){
	var output = '';
	var keywords = (ostk_isset(atts['query']) ? "keywords=" + atts['query'].split(" ").join("%20") : null);
  var taxonomy = '';
  if(keywords == null) {
    return ostk_formatError('"query" parameter cannot be empty.');
  }

  if(ostk_isset(atts['category'])){
    var taxonomyParam = ostk_getTaxonomy(atts['category']);
    if(empty(taxonomyParam)) {
      return ostk_formatError('"category" not found. Please check spelling and try again.');
    } else {
      taxonomy = "&taxonomy=" + taxonomyParam; 
    }
  }

  if(ostk_isset(atts['sort_by'])){
    sortOptionParam = ostk_getSortOption(atts['sort_by']);
    if(empty(sortOptionParam)) {
      return ostk_formatError('"sort_by" not found. Please check spelling and try again.');
    } else {
      sortOption = "&sortOption=" + sortOptionParam; 
    }
  }

  var affiliateLink = ostk_generateAffiliateLink("http://www.overstock.com/search?{keywords}{taxonomy}{sortOption}");
  link_text = (atts['link_text'] != null ? atts['link_text'] : atts['query']);
 	output = '<a href="'+affiliateLink+'" class="ostk-element ostk-search" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';
  elementGenerationCallback(_this, output);
}//ostk_generateLinktoSearchPage

/**
 * Pattern 2 - URL: lets you create links to any overstock page
 * Generate a link to a predefined page on Overstock.com
 * Specify the link_text with the link_text attribute
 * Usage example 
 * 1) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"]
 * 2) [overstock type="link" url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html" link_text="I want to buy this for my wife"]
**/
function ostk_generateLinktoAnyPage(atts, _this, elementGenerationCallback){
	var output = '';
  atts = shortcode_atts(
    {
      'type': null,
      'url': 'http://www.overstock.com/', 
      'link_text': 'A link to Overstock.com',
      'link_target': 'new_tab'
    }, atts);
    var link_text = atts['link_text'];
		var affiliateLink = ostk_generateAffiliateLink(atts['url']);
		output = '<a href="'+affiliateLink+'" class="ostk-element ostk-link" '+ostk_getLinkTarget(atts)+'>'+link_text+'</a>';
    elementGenerationCallback(_this, output);
}//ostk_generateLinktoAnyPage

/**
 * Pattern 3 - Rectangle: Lets you create a rectangular banner for a SINGLE product
 * Usage example 
 * 1) [overstock type="rectangle" id="10234427"]
 * 
**/
function ostk_generateRectangleWidget(atts, _this, elementGenerationCallback){
	var output = '';
  atts = shortcode_atts(
    {
      'type': null,
      'id': null,
      'width': null,
      'link_target': 'new_tab'
    }, atts);
  var productId = (ostk_isset(atts['id']) ? atts['id'] : null);
  var item = new ostk_SingleProductData();
  item.__construct(productId, function(){
	  if(item.isValidProductID()){
	    output += '<div class="ostk-element ostk-'+atts['type']+'" '+ostk_getStyles(atts)+'>';
	      output += ostk_getBranding();
	      output += ostk_generateRectangleHtmlOutput(item, atts);
	    output += '</div>';
	  }else{
	    output += ostk_formatError('Invalid product ID');
	  }
    elementGenerationCallback(_this, output);
  });
}//ostk_generateRectangleWidget


/**
 * Pattern 4 - Leaderboard: Lets you create a leaderboard banner for up to two products
 * Usage Example
 * 1) [overstock type="leaderboard" product_ids="8641092"]
 * 2) [overstock type="leaderboard" product_ids="8641092, 9547029"]
 * 
**/
function ostk_generateLeaderboardWidget(atts, _this, elementGenerationCallback){
	var output = '';
  atts = shortcode_atts(
    {
      'type': null,
      'product_ids': null,
      'link_target': 'new_tab'
    }, atts);

	//hoki make sure this is working     
  // var product_ids = (ostk_isset(atts['product_ids']) ? array_map('trim', explode(',', atts['product_ids'])) : null);
  var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);
	for(id in product_ids) {
  	if(ostk_checkForMissingCommas(id) == true) {
  		return ostk_formatError("Commas missing between ids, returning...");
  	}
  }//for
  var product_ids = ostk_limitArrayCount(product_ids, 2);
  var products = new ostk_MultiProductDataFromArray();
  products.__construct(product_ids, 2, function(){
    if(products.isAllValidProductIDs()){
      output += '<div class="ostk-element ostk-leaderboard">';
        output += ostk_getBranding();
        output += '<div class="item-holder item-count-'+product_ids.length+'">';
          output += ostk_generateLeaderboardHtmlOutput(products, atts);
        output += '</div>';
      output += '</div>';
    }else{
      output = ostk_formatError('Invalid product ID');
    }
    elementGenerationCallback(_this, output);
  });
}//ostk_generateLeaderboardWidget

/**
 * Pattern 5 - Skyscraper: Lets you create a skyscraper banner for up to three products
 * Usage Example
 * 1) [overstock type="skyscraper" product_ids="8641092"]
 * 2) [overstock type="skyscraper" product_ids="8641092, 9547029"]
 * 3) [overstock type="skyscraper" product_ids="8641092, 9547029, 9547023"]
*/
function ostk_generateSkyscraperWidget(atts, _this, elementGenerationCallback){
	var output = '';
  atts = shortcode_atts(
    {
      'type': null,
      'product_ids': null,
      'width': null,
      'link_target': 'new_tab'
    }, atts);
  var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);
		for(id in product_ids) {
     if(ostk_checkForMissingCommas(id) == true) {
       return ostk_formatError("Commas missing between ids, return ing...");
     }
    }//for
  var product_ids = ostk_limitArrayCount(product_ids, 3);
  var products = new ostk_MultiProductDataFromArray(product_ids);
  products.__construct(product_ids, 3, function(){
    if(products.isAllValidProductIDs()){
      output += '<div class="ostk-element ostk-skyscraper" '+ostk_getStyles(atts)+'>';
        output += ostk_getBranding();
        output += ostk_generateSkyscraperHtmlOutput(products, atts);
      output += '</div>';
    }else{
      output = ostk_formatError('Invalid product ID');
    }
    elementGenerationCallback(_this, output);
  });
}//ostk_generateSkyscraperWidget

/**
 * Pattern 6 - carousel: Lets you create a carousel banner for up to five products
 * Generate a carousel viewer for a number_of_products
 * Usage Example
 * 1) [overstock type="carousel" product_ids="8641092, 9547029, 9547023"]
 * 2) [overstock type="carousel" category="Pets" sort_by="Top Sellers"]
 * 3) [overstock type="carousel" keywords="soccer shoes" number_of_items="6"]
**/
function ostk_generateCarouselWidget(atts, _this, elementGenerationCallback){
	var output = '';
  var isValid = true;
  var products;
  atts = shortcode_atts(
    {
      'type': null,
      'category': null, 
      'number_of_items': 10,
      'sort_by': null, 
      'keywords': null,
      'product_ids': null,
      'width': null,
      'link_target': 'new_tab'
    }, atts);
  
  var taxonomy = (ostk_isset(atts['category']) ? "&taxonomy=" + ostk_getTaxonomy(atts['category']) : null);
  var sortOption = (ostk_isset(atts['sort_by']) ? "&sortOption=" + ostk_getSortOption(atts['sort_by']) : '');
  var keywords = (ostk_isset(atts['keywords']) ? "keywords=" + str_replace(' ', '%20', atts['keywords']) : null);
  var product_ids = (ostk_isset(atts['product_ids']) ? atts['product_ids'].split(',') : null);

  if (ostk_isset(taxonomy) && ostk_getTaxonomy(atts['category']) == false) {
  	output = ostk_formatError("category=\"{atts['category']}\" does not match our given categories, please check it.");
    isValid = false;
  } else if (taxonomy == null && keywords == null && product_ids == null) {
  	output = ostk_formatError("Some required fields are missing, (category or keywords) or (a list of product_ids)");
    isValid = false;
  } else if (ostk_isset(product_ids)) {
		for(id in product_ids) {
    	if(ostk_checkForMissingCommas(id) == true) {
    		output = ostk_formatError("Commas missing between ids, return ing...");
        isValid = false;
    	}
    }//for
	  products = new ostk_MultiProductDataFromArray();
    products.__construct(product_ids, atts['number_of_items'], function(){
      if(products.isAllValidProductIDs()){
        output = ostk_generateCarouselHTML('carousel', products.getProductList(), atts);
        output = '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>'+output+'</div>';
      }else{
        output = ostk_formatError('Invalid product ID');
      }
      elementGenerationCallback(_this, output);

    });
  } else {
    console.log('4');
	  var query = "http://www.overstock.com/api/search.json?{keywords}{taxonomy}{sortOption}";
    products = new ostk_MultiProductDataFromQuery();
    products.__construct(query, atts['number_of_items'], function(){
      if(products.isAllValidProductIDs()){
        output = ostk_generateCarouselHTML('carousel', products.getProductList(), atts);
        output = '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>'+output+'</div>';
      }else{
        output = ostk_formatError('Invalid product ID');
      }
      elementGenerationCallback(_this, output);
    });
  }


  if(!isValid){
    elementGenerationCallback(_this, output);
  }

}//ostk_generateCarouselWidget

/**
 * Pattern 7 - Stock Photo: lets you create an image link to a product page (stock photo)
 * Allow users to add stock photos to their posts (and get paid for it).
 * Example Usage:
 * 1) [overstock type="stock_photo" id="8859234"]
**/
function ostk_generateStockPhoto(atts, _this, elementGenerationCallback){
	var output = '';
	atts = shortcode_atts(
  	  {
        'type': null,
        'id': null, 
        'height': null, 
        'width': null, 
        'image_number': '1', 
        'custom_css': null,
        'link_target': 'new_tab'
      }, atts);
    var id = (ostk_isset(atts['id']) ? atts['id'] : null);
    var item = new ostk_SingleProductData();
    item.__construct(id, function(){
      if(item.isValidProductID()){
        if(atts['image_number'] <= item.numImages){
            output += ostk_generateStockPhotoHtmlOutput(item, atts);
            return '<div class="ostk-element ostk-stock-photo" '+ostk_getStyles(atts)+'>'+output+'</div>';
        }else{
          imageNumberError = 'Image number '+atts['image_number']+' is not available.';
          if(item.numImages > 1){
            imageNumberError += ' Image numbers from 1 to '+ item.numImages +' are available.';
          }else{
            imageNumberError += ' This image only has 1 available image.';
          }
          imageNumberError += ' Please change the image_number attribute and try again';
          output = ostk_formatError(imageNumberError);
        }
      }else{
        output = ostk_formatError('Invalid product ID');
      }
      elementGenerationCallback(_this, output);
    });
}//ostk_generateStockPhoto

/**
 * Pattern 8 - Product Details Link
 * Allow users to create easy links to products they are showcasing.
 * Example Usage:
 * 1) [overstock type="product_link" id="8859234"]
**/
function ostk_generateProductLinks(atts, _this, elementGenerationCallback){
	var output = '';
	atts = shortcode_atts(
  	  {
        'id': null,
        'display': null,
        'link_target': 'new_tab'
      }, atts);
  var item = new ostk_SingleProductData();
  item.__construct(atts['id'], atts['type'], function(){
    if(item.isValidProductID()){
      var display = atts['display'];
      output;
      switch (display) {
        case 'name':
        output = item.getName();
  	    break;
  	  case "price":
  	  	output = item.getPrice();
    	  break;
  	  case 'description':
        output = item.getDescription();
  	    break;
  	  default:
  	  	return ostk_formatError('We do not recognize your display input, please check it.');
      }//switch
      output = '<a href="'+item.getAffiliateUrl()+'" class="ostk-element ostk-product-link" '+ostk_getLinkTarget(atts)+'>'+output+'</a>';
    }else{
  		output = ostk_formatError('Invalid product ID');
    }
    elementGenerationCallback(_this, output);
  });
}//ostk_generateProductLinks

/**
 * Pattern 9 : product_carousel 
 * Lets you create a carousel for a single product, it shows all product photos
 * Usage Example
 * 1) [overstock type="product_carousel" id="6143359"]
**/
function ostk_generateProductCarouselWidget(atts, _this, elementGenerationCallback){
	var output = '';
  atts = shortcode_atts(
    {
    'id': null,
    'width': null,
    'link_target': 'new_tab',
    'number_of_items': null
  }, atts);
  var item = new ostk_SingleProductData();
  item.__construct(atts['id'], atts['type'], function(){
    if(item.isValidProductID()){
      output = ostk_generateCarouselHTML('product_carousel', item, atts);
      output = '<div class="ostk-element ostk-carousel" '+ostk_getStyles(atts)+'>'+output+'</div>';
    }else{
  		output = ostk_formatError('Invalid product ID');
    }
    elementGenerationCallback(_this, output);
  });
}//ostk_generateProductCarouselWidget

/**
 * Sample Widget takes productId returns ProductData object
**/
function ostk_sampleWidget(atts, _this, elementGenerationCallback) {
	var output = '';
  atts = shortcode_atts(
  	  {
        'id': ''
      }, atts);
      
  var productId = atts['id'];
  var item = new ostk_SingleProductData();
  item.__construct(atts['id'], atts['type'], function(){
    output += '<p> The name is <b>'+item.getName()+'</b></p>';
    output += '<p> The price is <b>'+item.getPrice()+'</b></p>';
    output += '<p> The rating (as decimal is) <b>'+item.getAverageReviewAsDecimal()+'</b></p>';
    output += '<p> The rating (as gif is)... see below</p>';
    output += '<img src= "'+item.getAverageReviewAsGif()+'"/>';
    output += '<p> <b>Large image:</b></p>';
    output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Large()+' /></a>';
    output += '<p> <b>Medium image:</b></p>';
    output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Medium()+' /></a>';
    output += '<p> <b>Small image:</b></p>';
    output += '<a href="'+item.getAffiliateUrl()+'"><img src= '+item.getImage_Thumbnail()+' /></a>';
    output += '<p>The url link is <a href="'+item.getAffiliateUrl()+'"><b>here, click me!</b></a></p>';
    output += '<p>Also, all photos are clickable.<p>';
    elementGenerationCallback(_this, output);
  });
}//ostk_sampleWidget