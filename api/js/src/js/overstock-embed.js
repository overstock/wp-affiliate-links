var ostk_developerId = null;

if(!ostk_isset(ostk_clickPlatform)){
	var ostk_clickPlatform = 'embed';
}

var ostk_plugin = new ostk_Plugin();

var ostk_clickurl = window.location.href;

var ostk_api_url = 'https://rawgithub.com/overstock/wp-affiliate-links/master/api/';
//Localhost for testing
if(ostk_clickurl.indexOf('http://localhost/~thoki') > -1){
	ostk_api_url = 'http://localhost/~thoki/overstock-affiliate-links/trunk/api/';
}

var scripts = document.getElementsByTagName('script');
for(var i = 0 ; i < scripts.length ; i++){
	if(scripts[i].src.indexOf("overstock-embed") > -1){
		var ostk_src = scripts[i].src;
		if(ostk_src.indexOf("?") > -1){
			var params = ostk_src.split('?')[1];
			var param_items = params.split('&');
			for(var k = 0 ; k < param_items.length ; k++){
				var param_pieces = param_items[k].split('=');
				var key = param_pieces[0];
				var value = param_pieces[1];
				if(key == 'id'){
					ostk_developerId = value;
					break;
				}
			}//for
			break;
		}
	}//for	
}//for


var event_list = [
	{
		'event': 'Flash Deals',
		'url': 'https://api.test.overstock.com/ads/products/deals?developerid='+ostk_developerId+'&sort=lowest_price'
	},
	{
		'event': 'Promotions',
		'url': 'https://api.test.overstock.com/ads/sales?developerid='+ostk_developerId+'&sale_type=promotion'
	},
	{
		'event': 'Sales',
		'url': 'https://api.test.overstock.com/ads/sales?developerid='+ostk_developerId+'&sale_type=sale'
	}
];

function ostk_Plugin(){
	/*
	OSTK PLUGIN Data Class
	Everything needed to create and render ostk widgets
	*/ 
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
		$ostk_jQuery.getJSON(ostk_api_url + "patterns.json", function(ostk_patterns) {
			_this.ostk_patterns = ostk_patterns;
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

			switch (data['type']) {
				case 'search':
					var item = new ostk_SearchQuery(data, element);
					break;
				case 'link':
					var item = new ostk_Link(data, element);
					break;
				case 'rectangle':
					var item = new ostk_Rectangle(data, element);
					break;
				case 'leaderboard':
					var item = new ostk_Leaderboard(data, element);
					break;
				case 'skyscraper':
					var item = new ostk_Skyscraper(data, element);
					break;
				case 'carousel':
					var item = new ostk_Carousel(data, element);
					break;
				case 'stock_photo':
					var item = new ostk_Stockphoto(data, element);
					break;
				case 'product_link':
					var item = new ostk_ProductDetailsLink(data, element);
					break;
				case 'sample_data':
					var item = new ostk_SampleData(data, element);
					break;
			}//switch

		});
	};//ostk_get_elements

	this.constructor();
}//ostk_Plugin

function ostk_Element(atts, element){
	this.atts = atts;
	this.element = element;


	//Init
	this.init = function(){
		/**
		* consumes a single param . 'type'
		* then passes the rest of atts to other functions.
		**/
		var error = null;
		if(!ostk_isset(ostk_developerId)){
			error = "Linkshare ID needs to be authenticated."; 
		}

		if(!error){
			var areAttsValid = ostk_areAttributesValid(this.atts)
			if(areAttsValid !== true){
				error = areAttsValid;
			}
		}

		if(!error){
			if(this.atts.type == '' || this.atts.type == null){ 
				error = "Type parameter cannot be empty.";
			}else if(ostk_isset(this.atts.link_target) && !ostk_isValidLinkTarget(this.atts)){ 
				error = '"link_target" not found. Please check spelling and try again.';
			}
		}

		if(!error){
			// hoki - check to make sure that this pregmatch is working
			var regex = /^[1-9]\d*(px|%)/i;
			if(ostk_isset(this.atts.width) && !regex.exec(this.atts.width)){
				error = "Width requires % or px, and a value greater than 0.";
			}
		}

		if(!error){
			if(ostk_isset(atts.number_of_items)){
				if(String(atts.number_of_items) == '0'){
					error = '"number_of_items" parameter must be at least 1.';
				}
			}			
		}

		if(error){
			this.renderHTMLError(error);
		}else{
			this.initElement();
		}
	};//init

	// Init Object
	this.initObject = function(){
		var _this = this;
		this.obj.init(
			//Success
			function(){
				_this.generateHtml();
			},
			// Error
			function(error){
				_this.renderHTMLError(error);
			}
		);
	};//initObject

	//Set Flash Deals Timer
	this.setFlashDealsTimer = function(obj){
		// var t = new Date();
		// t.setSeconds(t.getSeconds() + 5);
		// this.obj.dealEndTime = t;

		var _this = this;
		var timeDiff = ostk_getTimeDiff(this.obj.dealEndTime)

		// console.log('dealEndTime: ' + this.obj.dealEndTime);
		// console.log('dealEndTime: ' + this.obj.dealEndTime);

		console.log('this.obj');
		console.dir(this.obj);

		console.log(this.obj.dealEndTime);


		obj.html(this.timeDiffToString(timeDiff));
		var flashDealsTimer = setInterval(function(){
			if(timeDiff <= 1000){
				clearInterval(flashDealsTimer);
				_this.initObject();
			}else{
				timeDiff -= 1000;
				obj.html(_this.timeDiffToString(timeDiff));
			}
		}, 1000, true);
	};//setFlashDealsTimer

	// Time Difference to String
	this.timeDiffToString = function(timeDiff){
		var msec = timeDiff;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		if(this.atts.type === 'skyscraper' || this.atts.type === 'leaderboard'){
			return '<div class="double-line">' + 
				'<p>'+ostk_make_two_digits(hh) + ' : ' + ostk_make_two_digits(mm) + ' : ' + ostk_make_two_digits(ss) + '</p>' +
				'<p class="bottom-line">' +
					'<span>HR</span>' +
					'<span>MIN</span>' +
					'<span>SEC</span>';
				'</p>';	
			'</div>';	
		}else{
			return '<div class="single-line">' + 
				'<p class="single-line">'+ostk_make_two_digits(hh) + ' <span>HR</span> : ' + ostk_make_two_digits(mm) + ' <span>MIN</span> : ' + ostk_make_two_digits(ss) + ' <span>SEC</span>' + '</p>' +
			'</div>';	
		}
	}//timeDiffToString

	//Get Branding
	this.getBranding = function(brand){
		var output = '';
		var img_url = '';		

		if(!ostk_isset(brand)){
			brand = 'overstock';
		}

		switch(brand){
			case 'flash-deals':
				img_url = 'overstock-flash-deals-logo.png';		
				break;
			case 'white':
				img_url = 'overstock-logo-white.png';		
				break;
			default:
				img_url = 'overstock-logo.png';		
		}//switch

		output = '<div class="branding">';
			output += '<img src="'+ostk_api_url+'images/'+img_url+'"/>';
		output += '</div>';

		return output;
	};//getBranding

	this.renderElement = function(elment_contents){
		var output = '';
		var eventClass = '';
		var styles = '';
		var brand_img = 'white';

		if(ostk_isset(atts.version)){
			eventClass += ' '+atts.version;
		}
		if(ostk_isset(atts.event)){
			var eventName = atts.event.split(' ').join('-').toLowerCase();
			eventClass += ' sales-event '+eventName;
			if(atts.event == 'Flash Deals'){
				brand_img = 'flash-deals';
			}
		}else {
			styles = ostk_getStyles(atts);
		}

		output += '<div class="ostk-element ostk-'+atts.type+' '+eventClass+'" '+styles+'>';
			output += '<div class="ostk-element-inner">';

				if(atts.type !== 'leaderboard'){
					output += '<div class="ostk-element-header">';
						output += this.getBranding(brand_img);
					output += '</div>';
				}

				output += elment_contents;

				if(atts.type === 'leaderboard'){
					if(atts.event == 'Flash Deals'){
						output += '<div class="ostk-element-footer">';
			    			output += this.getBranding('flash-deals');
							if(atts.version === 'v1'){
								output += '<div class="dealEndTime"></div>';
							}
							if(atts.version === 'v2'){
								output += '<div class="dealEndTime"></div>';
							}
			    			output += this.getBranding();
						output += '</div>';
					}else{
						output += '<div class="ostk-element-footer">';
			    			output += this.getBranding('white');
						output += '</div>';
					}
				}else if(atts.event == 'Flash Deals'){
					output += '<div class="ostk-element-footer">';
		    			output += this.getBranding();
					output += '</div>';
				}
										
			output += '</div>';
		output += '</div>';

		output = $ostk_jQuery(output);

		if(ostk_isset(atts.event)){
			if(atts.event == 'Flash Deals'){
				this.setFlashDealsTimer(output.find('.dealEndTime'));
			}
		}

		this.renderHTML(output);
	};//renderElement


	//Render HTML
	this.renderHTML = function(data){
		data = $ostk_jQuery(data);
		this.element.fadeOut('slow');
		this.element.replaceWith(data);
		this.element = data;
		data.hide();
		data.fadeIn('slow');
	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){

		this.renderHTML(ostk_formatError(data));
	};//renderHTMLError
}//ostk_Element
