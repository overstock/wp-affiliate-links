/*
==================== Widget ====================

Class: 			ostk_Widget
Description: 	This is the base class for widgets. All widgets extend this class
*/
function ostk_Widget(atts, element){
	this.atts = atts;
	this.element = element;

	//Init
	this.init = function(){
		var error = null;
		if(!ostk_isset(ostk_developerId)){
			error = "Linkshare ID needs to be authenticated."; 
		}

		if(!error){
			if(this.atts.type == '' || this.atts.type == null){ 
				error = "Type parameter cannot be empty.";
			}else if(ostk_isset(this.atts.link_target) && !ostk_isValidLinkTarget(this.atts)){ 
				error = '"link_target" not found. Please check spelling and try again.';
			}
		}

		if(!error){
			var areAttsValid = ostk_areAttributesValid(this.atts)
			if(areAttsValid !== true){
				error = areAttsValid;
			}
		}

		if(!error){
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
		var error = null;

		if(this.atts.id){
			this.obj.productId = this.atts.id;
		}		
		if(this.atts.product_ids){
			this.obj.productIds = this.atts.product_ids;
		}
		if(this.atts.event){
			this.obj.query = ostk_getEventQuery(this.atts.event);
			if(!this.obj.query){
				error = 'Invalid query attribute';
			}
		}

		if(error){
			this.renderHTMLError(error);
		}else{
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
		}
	};//initObject

	//Set flash_deals Timer
	this.setFlashDealsTimer = function(obj){
		// var t = new Date();
		// t.setSeconds(t.getSeconds() + 5);
		// this.obj.dealEndTime = t;

		var _this = this;
		var timeDiff = ostk_getTimeDiff(this.obj.dealEndTime)

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

		if(ostk_isset(atts.version)){
			eventClass += ' '+atts.version;
		}
		if(ostk_isset(atts.event)){
			var eventName = atts.event.split(' ').join('-').toLowerCase();
			eventClass += ' sales-event '+eventName.split('_').join('-');
		}else{
			styles = ostk_getStyles(atts);
		}

		output += '<div class="ostk-element ostk-'+atts.type+' '+eventClass+'" '+styles+'>';
			output += '<div class="ostk-element-inner">';

				// if(atts.type !== 'leaderboard'){
				// 	output += '<div class="ostk-element-header">';
				// 		output += this.getBranding(brand_img);
				// 	output += '</div>';
				// }

				output += elment_contents;

				// if(atts.type !== 'leaderboard'){
				// 	output += '<div class="ostk-element-footer">';
		  //   			output += this.getBranding();
				// 	output += '</div>';
				// }
										
			output += '</div>';
		output += '</div>';

		output = $ostk_jQuery(output);

		if(ostk_isset(atts.event)){
			if(atts.event == 'flash_deals'){
				this.setFlashDealsTimer(output.find('.dealEndTime'));
			}
		}

		this.renderHTML(output);
	};//renderElement


	//Render HTML
	this.renderHTML = function(data){
		var scale = null;
		if(this.element.parent().outerWidth() != null){
			var myWidth = this.element.outerWidth();
			this.parentWidth = this.element.parent().outerWidth();
			if(myWidth > this.parentWidth){
				scale  = (this.parentWidth) / myWidth;
			}
		}

		data = $ostk_jQuery(data);
		this.element.fadeOut('slow');
		this.element.replaceWith(data);
		this.element = data;
		data.hide();
		data.fadeIn('slow');

		if(scale != null){
/*
			data.css({
				'-webkit-transform' : 'scale(' + scale + ')',
				'-moz-transform'    : 'scale(' + scale + ')',
				'-ms-transform'     : 'scale(' + scale + ')',
				'-o-transform'      : 'scale(' + scale + ')',
				'transform'         : 'scale(' + scale + ')'
			});
*/
		}

	};//rederHTML

	//Render HTML Error
	this.renderHTMLError = function(data){
		this.renderHTML(ostk_formatError(data));
	};//renderHTMLError
}//ostk_Widget
