/*
==================== Plugin ====================

Class: 			ostk_Plugin
Description: 	Everything needed to create and render ostk widgets
*/
function ostk_Plugin(){
	this.constructor = function(){
		this.ostk_check_jquery();
	};//constructor

	this.ostk_check_jquery = function(){
		if(typeof jQuery == 'undefined'){
			this.ostk_get_script('http://code.jquery.com/jquery-2.1.4.min.js', function() {
				if(typeof jQuery=='undefined'){
					// Super failsafe - still somehow failed...
				}else{
					this.ostk_init_elements();
				}
			});
		} else { // jQuery was already loaded	
			this.ostk_init_elements();
		};
	};//ostk_check_jquery

	this.ostk_init_elements = function(){
		var _this = this;
		$ostk_jQuery = jQuery.noConflict();
		$ostk_jQuery(document).ready(function() {
			_this.load_css();
			_this.ostk_preloaders();
			_this.getPatterns();
		});
	};//ostk_init_elements

	this.getPatterns = function(){
		this.ostk_patterns =  ostk_patterns;
		this.get_elements();
	};//getPatterns

	this.ostk_get_script = function(url, success) {
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
	};//ostk_get_script

	this.load_css = function(){
		$ostk_jQuery('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', ostk_api_url+'dist/overstock-embed.min.css');
	};//ostk_loadCSS

	this.ostk_preloaders = function(){
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
		    		src: 'dev/devImages/affiliate-embed-widgets-ostk-logo.png',
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
	};//ostk_preloaders

	this.get_elements = function(){
		var ostk_element_count = $ostk_jQuery('div').filter("[data-tag='overstock']").length;
		var ostk_element_loaded_count = 0;
		var _this = this;
		$ostk_jQuery('div').filter("[data-tag='overstock']").each(function(){
			var element = $ostk_jQuery(this);
			var atts = $ostk_jQuery(this)[0].attributes;
			var data = {};
			for(var i = 0 ; i < atts.length ; i++){
				if (atts[i]['name'].indexOf("data-") >= 0){
					var name = atts[i]['name'].split('data-')[1];
					var value = atts[i]['value'];
					if(name != 'tag'){
						data[name] = value;
					}
				}
			}//for

			var item;
			var is_widget = true;
			switch (data['type']) {
				case 'search':
					item = new ostk_SearchQuery();
					break;
				case 'link':
					item = new ostk_Link();
					break;
				case 'rectangle':
					item = new ostk_Rectangle();
					break;
				case 'leaderboard':
					item = new ostk_Leaderboard();
					break;
				case 'skyscraper':
					item = new ostk_Skyscraper();
					break;
				case 'carousel':
					item = new ostk_Carousel();
					break;
				case 'stock_photo':
					item = new ostk_StockPhoto();
					break;
				case 'product_link':
					item = new ostk_ProductDetailsLink();
					break;
				case 'sample_data':
					item = new ostk_SampleData();
					break;
				default:
					is_widget = false;
			}//switch

			if(is_widget){
				var object = $ostk_jQuery.extend({}, new ostk_Widget(data, element), item);	
				object.init();
			}else{
				var html = ostk_formatError('Invalid widget type')
				element.replaceWith(html);
			}

		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin