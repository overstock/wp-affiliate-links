$ostk_jQuery = jQuery.noConflict();
$ostk_jQuery(window).load(function() {

	ostk_load_carousels();

	/* Resize Window
	-----------------------------------------------------*/
	$ostk_jQuery(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
			resizeCarousel($ostk_jQuery(this));
	    }, 250);
	});

});

function ostk_load_carousels(){
	if($ostk_jQuery('.ostk-carousel').length > 0){
		$ostk_jQuery('.ostk-carousel').each(function(){
			var _this = $ostk_jQuery(this);
			resizeCarousel(_this);
			_this.children('.ostk-flexslider').flexslider({
				animation: "slide",
				controlNav: "thumbnails",
				customDirectionNav: _this.find(".custom-navigation a"),
				controlsContainer: _this.find(".custom-controls-container"),
				touch: true,
				slideshow: false,
				start: function(carousel){
					//Call on load
					showThumbnails(_this, carousel);
				},
				after: function(carousel){
					//Call after changing the current img
					showThumbnails(_this, carousel);
				}
			});
		});
	}
}//ostk_load_carousels


/* Resize Flexslider
-----------------------------------------------------*/
function resizeCarousel(carousel){
	var ostk_mobile_breakpoint = 500;
	$ostk_jQuery('.ostk-carousel').each(function(){
		if(carousel.outerWidth() > ostk_mobile_breakpoint){
			carousel.addClass('desktop-size');
			carousel.removeClass('mobile-size');
		}else{
			carousel.removeClass('desktop-size');
			carousel.addClass('mobile-size');
		}
	});
}

/* Show Thumbnails
-----------------------------------------------------*/
function showThumbnails(carousel, flexslider){
	var itemsPerPage = 5;
	var currentSlide = flexslider.currentSlide;
	var totalItems = carousel.find("ol li").length;
	var onBothSides = (itemsPerPage-1)/2;
	carousel.find("ol li").each(function(index){
		if( (index>=(currentSlide-onBothSides) && index<=(currentSlide+onBothSides) ) ||
			// The items on either side of the current item will show 
			(currentSlide < onBothSides && index < itemsPerPage) ||
			// If at the beginning
			(totalItems-currentSlide <= onBothSides && totalItems-index <= itemsPerPage) ){
			// If at the end
			$ostk_jQuery(this).show();
		}else{
			$ostk_jQuery(this).hide();
		}
	});
}















