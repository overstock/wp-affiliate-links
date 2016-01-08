/*
==================== Carousel ====================

Class: 			ostk_Carousel
Extends: 		ostk_Widget
Description: 	Lets you create a carousel banner
*/
function ostk_Carousel(){

	// Init Element
	this.initElement = function(){
		if(!ostk_isset(this.atts.number_of_items)){
			this.atts.number_of_items = 10;
		}

		if(this.atts.id){
			this.obj = new ostk_SingleProductData();
			this.obj.multiImages = true;
		}else{
			this.obj = new ostk_MultiProductData();
			this.obj.muliProduct = true;
		}

		this.initObject();

	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		var productList;
		var product;		
		var img_count = 0;
		var _this = this;

		if(this.obj.muliProduct){
			productList = this.obj.productList;
		}else{
			product = this.obj;
			productList = product.arrayOfAllProductImages;
		}

		output += '<div class="ostk-element ostk-carousel" '+ostk_getStyles(this.atts)+'>';
	        output += '<div class="ostk-element-inner">';
				output += '<div class="ostk-flexslider">';
					output += '<ul class="slides">';

						if(this.obj.muliProduct){
							for(var i = 0 ; i < productList.length ; i++){
								var product = productList[i];
								productImg = product.imgUrl_large;
								output += this.getCarouselListItems(product, productImg);
							}//foreach
						}else{
							for(var i = 0 ; i < productList.length ; i++){
								var productImg = productList[i];
								output += this.getCarouselListItems(product, productImg);
							}//foreach
						}

					output += '</ul>';
				output += '</div>';

				if(productList.length > 1){
					//only show thumbnail navigation if more than 1 item
					output +=  '<div class="custom-navigation count-'+productList.length+'">';
						output += '<a href="#" class="flex-prev">';
							output += '<div class="ostk-arrow">';
								output += '<i class="fa fa-chevron-left"></i>';
							output += '</div>';
						output += '</a>';
						output += '<a href="#" class="flex-next">';
							output += '<div class="ostk-arrow">';
								output += '<i class="fa fa-chevron-right"></i>';
							output += '</div>';
						output += '</a>';
						output += '<div class="custom-controls-container"></div>';
					output += '</div>';
				}
			output += '</div>';
		output += '</div>';

		output = $ostk_jQuery(output);

		if(productList.length > 1){
			this.loadCarousel(output);
		}
		this.renderHTML(output);
		this.resizeCarousel(output);

		$ostk_jQuery(window).resize(function() {
		    clearTimeout(window.resizedFinished);
		    window.resizedFinished = setTimeout(function(){
				_this.resizeCarousel(output);
		    }, 250);
		});
	}//generateHtml

	this.getCarouselListItems = function(product, productImg){
		var output = '';
		output += '<li data-thumb="'+productImg+'">';
			output += '<a href="'+product.getAffiliateUrl()+'" '+ostk_getLinkTarget(this.atts)+'>';
			    output += '<div class="ostk-element-content">';
					output += '<img src="'+productImg+'"/>';
				output += '</div>';
			    output += '<div class="element-overlay">';
						output += '<p class="title">'+product.name+'</p>';
						if(product.averageReviewAsGif){
							output += '<img class="ostk-rating" src="'+product.getAverageReviewAsGif()+'"/>';
						}
						output += '<p class="price">'+product.price+'</p>';
						output += '<img class="ostk-logo" src="dev/devImages/affiliate-embed-widgets-ostk-logo.png">';
				output += '</div>';
			output += '</a>';
		output += '</li>';
		return output;
	};//getCarouselListItems

	// Load Carousel
	this.loadCarousel = function(carousel){
		var _this = this;

		carousel.find('.ostk-flexslider').flexslider({
			animation: "slide",
			controlNav: "thumbnails",
			customDirectionNav: carousel.find(".custom-navigation a"),
			controlsContainer: carousel.find(".custom-controls-container"),
			touch: true,
			slideshow: false,
			start: function(carousel){
				//Call on load
				_this.showThumbnails(carousel, this);
			},
			after: function(carousel){
				//Call after changing the current img
				_this.showThumbnails(carousel, this);
			}
		});
	};//loadCarousel

	// Resize Flexslider
	this.resizeCarousel = function(carousel){
		var ostk_mobile_breakpoint = 500;
		var carousel_inner = carousel.find('.ostk-element-inner');
		if(carousel.outerWidth() > ostk_mobile_breakpoint){
			carousel_inner.addClass('desktop-size');
			carousel_inner.removeClass('mobile-size');
		}else{
			carousel_inner.removeClass('desktop-size');
			carousel_inner.addClass('mobile-size');
		}
	};//resizeCarousel

	// Show Thumbnails
	this.showThumbnails = function(carousel, flexslider){
		var itemsPerPage = 5;
		var currentSlide = carousel.currentSlide;
		var items = carousel.controlsContainer.find("ol li");
		var onBothSides = (itemsPerPage-1)/2;

		items.each(function(index){
			if( 
				// The items on either side of the current item will show 
				(index>=(currentSlide-onBothSides) && index<=(currentSlide+onBothSides) ) ||
				// If at the beginning
				(currentSlide < onBothSides && index < itemsPerPage) ||
				// If at the end
				(items.length-currentSlide <= onBothSides && items.length-index <= itemsPerPage) 
			){
				$ostk_jQuery(this).show();
			}else{
				$ostk_jQuery(this).hide();
			}
		});
	};//showThumbnails

}//ostk_Skyscraper
