var ostk_api_url = '../ostk-api/';

ostk_init();

function ostk_init(){
	ostk_check_jquery();
}//ostk_init

function ostk_check_jquery(){
	if (typeof jQuery == 'undefined') {
		ostk_get_script('http://code.jquery.com/jquery-2.1.4.min.js', function() {
			if (typeof jQuery=='undefined') {
				// Super failsafe - still somehow failed...
			} else {
				ostk_init_elements();
			}
		});
	} else { // jQuery was already loaded	
		ostk_init_elements();
	};
}

function ostk_get_script(url, success) {
	var script = document.createElement('script');
     script.src = url;
	var head = document.getElementsByTagName('head')[0],
	done = false;
	// Attach handlers for all browser
	script.onload = script.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		done = true;
			// callback function provided as param
			success();
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);	
		};
	};
	head.appendChild(script);
};

function ostk_init_elements(){
	$ostk_jQuery = jQuery.noConflict();
	$ostk_jQuery(document).ready(function() {
		ostk_load_css();
		ostk_load_js();
	});
}//ostk_init_elements

function ostk_preloaders(){
	$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
		var _this = $ostk_jQuery(this);

		var attrs = _this[0].attributes;
		for(var i = 0 ; i < attrs.length ; i++){
			if(attrs[i]['name'] === 'data-width'){
				_this.css('width', attrs[i]['value']);
				break;
			}
		}//for

	    var ostk_loader_div = $ostk_jQuery('<div>')
	    	.attr('class', 'ostk-loader')
			.appendTo(_this);

	    $ostk_jQuery('<img>')
	    	.attr({
	    		src: ostk_api_url+'images/overstock-logo.png',
	    		width: 125
	    	})
	    	.appendTo(ostk_loader_div);

	    var p = $ostk_jQuery('<p>')
	    	.text(' Loading...')
	    	.appendTo(ostk_loader_div);

	    $ostk_jQuery('<i>')
	    	.attr({
				class: "fa fa-refresh fa-spin"
	    	})
	    	.prependTo(p);
	});
}//ostk_preloaders

function ostk_load_css(){
	var css_link_array = [
						'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
						ostk_api_url+'css/dest/overstock-shortcodes.min.css', //Custom Styles for ShortCodes
						ostk_api_url+'flex-slider/flexslider.css' //Flex Slider CSS
						];
	for(var i = 0 ; i < css_link_array.length ; i++){
		$ostk_jQuery('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', css_link_array[i]);
	}//for
}//ostk_loadCSS

function ostk_load_js(){
	var js_link_array = [
						ostk_api_url+'flex-slider/jquery.flexslider-min.js',
						ostk_api_url+'js/api/patterns.js',
						ostk_api_url+'js/api/index.js',
						ostk_api_url+'js/overstock-shortcodes.js',
						];
	var js_load_counter = 0;
	for(var i = 0 ; i < js_link_array.length ; i++){
		$ostk_jQuery.getScript( js_link_array[i], function( data, textStatus, jqxhr ) {
			js_load_counter++
			if(js_load_counter === js_link_array.length){
				ostk_get_elements();
			}
		});
	}//for
}//ostk_load_js

function ostk_get_elements(){
	ostk_preloaders();
	var ostk_element_count = $ostk_jQuery('div').filter("[data-tag='overstock']").length;
	var ostk_element_loaded_count = 0;
	$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
		var _this = $ostk_jQuery(this);
		var attrs = $ostk_jQuery(this)[0].attributes;
		var data = '';

		var sendArray = {};

		for(var i = 0 ; i < attrs.length ; i++){
			if (attrs[i]['name'].indexOf("data-") >= 0){
				var name = attrs[i]['name'].split('data-')[1];
				var value = encodeURIComponent(attrs[i]['value'].split('&').join(''));

				sendArray[name] = value;

				if(i === 0){
					data += '?';
				}else{
					data += '&';
				}
				data += attrs[i]['name'].split('data-')[1];
				data += '=';
				data += encodeURIComponent(attrs[i]['value'].split('&').join(''));
			}
		}//for

		ostk_generateShortcodeWidgets(sendArray);

		/*
		$ostk_jQuery.get( ostk_api_url+data, function( data ) {
			_this.replaceWith(data);
			ostk_element_loaded_count++;
			if(ostk_element_loaded_count === ostk_element_count){
			    ostk_load_carousels();
			}
		});
		*/
	});
}//ostk_get_elements
