function ostk_Generator(platform){
	ostk_PatterSelector.call(this, platform);

	//Concat Form Values
	this.concatFormValues = function(obj){
		var str = '';
		var key = obj[0].name;
		var value = obj[0].value;
		if(value !== '' && value !== '?'){ //if blank or if ostk_select is on the first option (?)
			if(this.generator_platform !== 'wordpress'){
				key = 'data-'+key;
			}
			str = ' '+ key + '="' + value + '"';
		}
		return str;
	};//concatFormValues

	this.optionObjectPrefix = function(index){
		return $ostk_jQuery("<input>")
			.attr({
				'type': 'radio'
			});
	};//optionObjectPrefix

	this.createOptions = function(attr){
		var option_select = $ostk_jQuery('<select>')
			.attr({
				name: attr.name,
				'attr': true
			});

	    createOption('Select', '?')
	    	.appendTo(option_select);

		for(var i = 0 ; i < attr.options.length ; i++) {
			var opt = attr.options[i];
			createOption(opt)
		    	.appendTo(option_select);
		}//for
		return option_select;
	};//createOptions

	this.getInfo = function(attr){
		var info_container = $ostk_jQuery("<i>")
			.attr({
				'class': 'fa fa-info-circle'
			});

		var info = $ostk_jQuery("<div>")
			.attr({
				'class': 'info'
			})
			.appendTo(info_container);

		if(attr.description){
			this.attToString(attr, 'description')
				.appendTo(info);
		}
		if(attr.example){
			this.attToString(attr, 'example')
				.appendTo(info);
		}
		return info_container;
	};//getInfo

	this.construct();

}//ostk_Generator

var ostk_generator = ostk_Generator('wordpress');
	

/* Show Info
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder i.fa-info-circle').click(function(){
	$ostk_jQuery(this).siblings('.info').slideToggle('slow');
});


/* Select Options
--------------------------------------------------------------------------------*/
$ostk_jQuery('form').on('change', '.ostk-form-content input[type="radio"]', function() {
	var _this = $ostk_jQuery(this);

	var li = _this.closest('li');

	//Undisable the input or select box when selecting an options radio button
	li.find('input[attr="true"], select[attr="true"]').prop('disabled', false);
	li.removeClass('disabled');

	//Siblings list items
	var sibs = li.siblings('li');
	sibs.addClass('disabled');

	//Disable other options input or select box
	sibs.find('input[attr="true"], select[attr="true"]').prop('disabled', true);

	//Uncheck other options radio buttons
	sibs.find('input[type="radio"]').prop('checked', false);
});


/* Submit
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder').submit(function(e){
	e.preventDefault();
	var embed_code = $ostk_jQuery('textarea.code');
	var embed_sandbox = $ostk_jQuery('.embed-sandbox');
	var attrs = '';

	$ostk_jQuery('.embed-output').fadeIn('slow');
	embed_code.html(''); //clear div contents

	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]:enabled, form.ostk-embed-builder select[attr="true"]:enabled').each(function(){
		attrs += concatFormValues($ostk_jQuery(this));
	});

	// var embed_str = '';
	// if(ostk_generator_platform == 'wordpress'){
	// 	embed_str = '[overstock type="'+ostk_selected_pattern.slug+'" '+attrs+']';
	// }else{
	// 	embed_str = '<div data-tag="overstock" data-type="'+ostk_selected_pattern.slug+'" '+attrs+'></div>';
	// }

	//Shortcode
	embed_str = '[overstock type="'+ostk_selected_pattern.slug+'" '+attrs+']';
	createText(embed_str)
		.appendTo(embed_code);

	//Embed
	ostk_generator_platform = 'embed';
	var attrs2 = '';
	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]:enabled, form.ostk-embed-builder select[attr="true"]:enabled').each(function(){
		attrs2 += concatFormValues($ostk_jQuery(this));
	});
	embed_str = '<div data-tag="overstock" data-type="'+ostk_selected_pattern.slug+'" '+attrs2+'></div>';
	embed_code.html(embed_str); //clear div contents

	embed_sandbox.html(embed_str);

	ostk_plugin.get_elements();
});










