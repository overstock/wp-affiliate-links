var ostk_selected_pattern;
var ostk_generator_platform = 'wordpress';

/* On Load
--------------------------------------------------------------------------------*/
$ostk_jQuery = jQuery.noConflict();
$ostk_jQuery(document).ready(function() {
		setupForm(ostk_patterns);
});

/* Setup Form
--------------------------------------------------------------------------------*/
function setupForm(ostk_patterns){
	var ostk_select = $ostk_jQuery('form.ostk-embed-builder select.ostk-type');
    createOption('Select', '?')
    	.appendTo(ostk_select);
	for(var i = 0 ; i < ostk_patterns.length ; i++) {
		var pattern = ostk_patterns[i];
		createOption(pattern['name'], pattern['slug'])
	    	.appendTo(ostk_select);
	}//for
}//setupForm

/* Change Type
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder select.ostk-type').change(function(){
	var type = $ostk_jQuery('form.ostk-embed-builder select.ostk-type').val();
	var form_content = $ostk_jQuery('form.ostk-embed-builder .ostk-form-content');

	form_content.html(''); //clear div contents
	$ostk_jQuery('.embed-output').fadeOut('slow'); //hide output

	if(type === '?'){
		form_content.fadeOut('slow');
		ostk_selected_pattern = null;
	}else{
		ostk_selected_pattern = ostk_findObjWhereKeyEqualsValue(ostk_patterns, 'slug', type);
		form_content.fadeIn('slow');

		if(ostk_selected_pattern.required_attributes){
			createText('Required Attributes', 'h2')
				.appendTo(form_content);
			var inputList = createInputList(ostk_selected_pattern.required_attributes, true);
			inputList.appendTo(form_content);
		}
		if(ostk_selected_pattern.optional_attributes){
			createText('Optional Attributes', 'h2')
				.appendTo(form_content);
			var inputList = createInputList(ostk_selected_pattern.optional_attributes, false);
			inputList.appendTo(form_content);
		}
	}

	$ostk_jQuery('<input>')
		.attr({
			type: 'submit',
			value: 'Create Embed Code',
			class: 'ostk-btn'
		})
		.appendTo(form_content);
});

/* Select Object Options
--------------------------------------------------------------------------------*/
$ostk_jQuery('form').on('change', '.ostk-form-content select', function() {
	var _this = $ostk_jQuery(this);
	if(_this.attr('selectobject') !== undefined){
		var select_name = _this[0]['name'];
		var select_value = _this.val();
		var is_required = _this[0]['required'];
		var attribute_required_type = '';
		if(is_required){
			attribute_required_type = 'required_attributes';
		}else{
			attribute_required_type = 'optional_attributes';
		}
		var options = ostk_findObjWhereKeyEqualsValue(ostk_selected_pattern[attribute_required_type], 'name', select_name)
		var selected_options = ostk_findObjWhereKeyEqualsValue(options['options'], 'name', select_value);
		var container = _this.siblings('.optional-objects');
		var inputList = createInputList(Array(selected_options), true);
		container.html('');
		inputList.appendTo(container);
	}
});

/* Submit
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder').submit(function(e){
	e.preventDefault();
	var embed_code = $ostk_jQuery('.embed-code');
	var embed_sandbox = $ostk_jQuery('.embed-sandbox');

	$ostk_jQuery('.embed-output').fadeIn('slow');
	embed_code.html(''); //clear div contents

	var attrs = '';
	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]').each(function(){
		attrs += concatFormValues($ostk_jQuery(this));
	});
	$ostk_jQuery('form.ostk-embed-builder select[attr="true"]').each(function(){
		attrs += concatFormValues($ostk_jQuery(this));
	});

	var embed_str = '';
	if(ostk_generator_platform == 'wordpress'){
		embed_str = '[overstock type="'+ostk_selected_pattern.slug+'" '+attrs+']';
	}else{
		embed_str = '<div data-tag="overstock" data-type="'+ostk_selected_pattern.slug+'" '+attrs+'></div>';
	}
	
	createText(embed_str)
		.appendTo(embed_code);

	embed_sandbox.html(embed_str);

	ostk_plugin.get_elements();
});

function concatFormValues(obj){
	var str = '';
	var key = obj[0].name;
	var value = obj[0].value;
	if(value !== '' && value !== '?'){ //if blank or if ostk_select is on the first option (?)
		if(ostk_generator_platform !== 'wordpress'){
			key += 'data-';
		}
		str = ' '+ key + '="' + value + '"';
	}
	return str;
}//concatFormValues

/* Iterate throught an array and return the first item that 
has a specific key with a specific value */
function ostk_findObjWhereKeyEqualsValue(obj, key_1, value_1){
	for(var i = 0 ; i < obj.length ; i++){
		var item = obj[i];
		if(item[key_1] == value_1){
			return item;
		}
	}//for
}//findObjWhereKeyEquals

function createInputList(attrs, required){
	var ul = $ostk_jQuery("<ul>");
	for(var i = 0 ; i < attrs.length ; i++){
		var attr = attrs[i];

		var li = $ostk_jQuery("<li>");

		var label = $ostk_jQuery("<label>")
			.text(attr.name+':')
			.appendTo(li);

		if(attr.options){
		    //if the options are objects instead of just an array of strings

		    // var option_is_object = (attr.options[0]['name']) ? true : false;
		    var option_is_object = (typeof attr.options[0]['name'] !== 'undefined') ? true : false;
			var ostk_select = $ostk_jQuery('<select>')
				.attr({
					name: attr.name,
					'attr': true
				})
				.appendTo(li);

			if(required){
				ostk_select.attr({
					required: 'true'
				});
			}

		    createOption('Select', '?')
		    	.appendTo(ostk_select);

			if(option_is_object){
				ostk_select.attr({
					'selectobject': true
				});

				 var option_holder = $ostk_jQuery("<div>")
				 	.attr({
				 		class: 'optional-objects'
				 	})
					.appendTo(li);
			}

			for(var k = 0 ; k < attr.options.length ; k++){
				var option = attr.options[k]; 
				if(option_is_object){
					option = option['name']
		    	}
			    createOption(option)
			    	.appendTo(ostk_select);
			}//for
		}else{
			if(required && attr.name === 'type'){
				createText(ostk_selected_pattern['slug'])
					.appendTo(li);
			}else{
				var input = $ostk_jQuery('<input>');
				input.attr({
					type: 'text',
					name: attr.name,
					'attr': true
				});
				if(required){
					input.attr({
						required: 'true'
					});
				}
				input.appendTo(li);
			}
		}
		li.appendTo(ul);
	}//for
	return ul;
}//createInputs








