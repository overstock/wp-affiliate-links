var ostk_generator = ostk_Generator();


function ostk_Generator(){
	ostk_PatterSelector.call(this);

	//Concat Form Values
	this.concatFormValues = function(obj){
		var str = '';
		var key = obj[0].name;
		var value = obj[0].value;
		if(value !== '' && value !== '?'){ //if blank or if ostk_select is on the first option (?)
			if(platform !== 'wordpress'){
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

	//Disable other option's input or select box
	sibs.find('input[attr="true"], select[attr="true"]').prop('disabled', true);
	//Clear other option's input
	sibs.find('input[attr="true"]').val('');
	//Clear other option's select box
	sibs.find('select[attr="true"]').prop('selectedIndex', 0);

	//Uncheck other options radio buttons
	sibs.find('input[type="radio"]').prop('checked', false);
});


/* Submit
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder').submit(function(e){
	e.preventDefault();
	var embed_code = $ostk_jQuery('textarea.code');
	var embed_sandbox = $ostk_jQuery('.embed-sandbox');

	$ostk_jQuery('.embed-output').fadeIn('slow');
	embed_code.html(''); //clear div contents

	//Shortcode
	var attrs = '';
	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]:enabled, form.ostk-embed-builder select[attr="true"]:enabled').each(function(){
		attrs += concatFormValues($ostk_jQuery(this), 'wordpress');
	});
	var shortcode = '[overstock type="'+ostk_selected_pattern.slug+'" '+attrs+']';

	//Embed
	var attrs2 = '';
	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]:enabled, form.ostk-embed-builder select[attr="true"]:enabled').each(function(){
		attrs2 += concatFormValues($ostk_jQuery(this), 'embed');
	});
	var embedcode = '<div data-tag="overstock" data-type="'+ostk_selected_pattern.slug+'" '+attrs2+'></div>';

	console.log(embedcode);
	embed_code.html(shortcode);

	embed_sandbox.html(embedcode);

	ostk_plugin.get_elements();
});










