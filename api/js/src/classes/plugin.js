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
		var _this = this;
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var json_url = "https://api.github.com/repos/overstock/wp-affiliate-links/contents/api/patterns.json?callback=jsoncallback";
	    $ostk_jQuery.ajax({
			url: json_url,
			dataType: 'jsonp'
	    }).done(function(response) {
			_this.ostk_patterns =  $ostk_jQuery.parseJSON( Base64.decode(response.data.content) );
			_this.get_elements();
		});
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
		  .attr('href', ostk_api_url+'css/overstock-embed.min.css');
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
					item = new ostk_Stockphoto();
					break;
				case 'product_link':
					item = new ostk_ProductDetailsLink();
					break;
				case 'sample_data':
					item = new ostk_SampleData();
					break;
				default:
					is_widget = true;
			}//switch

			if(is_widget){
				var object = $ostk_jQuery.extend({}, new ostk_Widget(data, element), item);	
				object.init();
			}

		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin