// var ostk_api_url = 'https://cdn.rawgit.com/overstock/wp-affiliate-links/6ea285ce81b12fb56c8cebbabb6410256e066ada/api/';
var ostk_api_url = 'http://localhost/~thoki/overstock-affiliate-links/trunk/api/';

ostk_init();

function ostk_init(){
	/* hoki - uses this check for jquery*/
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
}//ostk_check_jquery

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
}//ostk_get_script

function ostk_init_elements(){
	$ostk_jQuery = jQuery.noConflict();
	$ostk_jQuery(document).ready(function() {
		ostk_load_css();
		ostk_get_elements();
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
			}else if(attrs[i]['name'] == 'data-type' && attrs[i]['value'] == 'leaderboard'){
				_this.css('width', '728px');
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
	$ostk_jQuery('<link>')
	  .appendTo('head')
	  .attr({type : 'text/css', rel : 'stylesheet'})
	  .attr('href', ostk_api_url+'css/overstock-embed.min.css');
}//ostk_loadCSS

function ostk_get_elements(){
	ostk_preloaders();
	var ostk_element_count = $ostk_jQuery('div').filter("[data-tag='overstock']").length;
	var ostk_element_loaded_count = 0;
	$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
		var _this = $ostk_jQuery(this);
		var attrs = $ostk_jQuery(this)[0].attributes;
		var data = {};
		for(var i = 0 ; i < attrs.length ; i++){
			if (attrs[i]['name'].indexOf("data-") >= 0){
				var name = attrs[i]['name'].split('data-')[1];
				var value = attrs[i]['value'];
				if(name != 'tag'){
					data[name] = value;
				}
			}
		}//for
		var response = ostk_generateShortcodeWidgets(data, _this, function(_this, data){
			_this.replaceWith(data);
			ostk_load_carousels();
		});
	});
}//ostk_get_elements