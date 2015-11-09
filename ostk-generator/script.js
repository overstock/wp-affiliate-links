var ostk_patterns;
var ostk_selected_pattern;

/* On Load
--------------------------------------------------------------------------------*/
$ostk_jQuery = jQuery.noConflict();
$ostk_jQuery(document).ready(function() {
	ostk_loadPatterns();
});

/* Load Overstock Patterns
--------------------------------------------------------------------------------*/
function ostk_loadPatterns(){
	var data = '?type=patterns';
	$ostk_jQuery.get("http://localhost/~thoki/ostk-api/"+data, function(data) {
		ostk_patterns = JSON.parse(data);
		setupForm(ostk_patterns);
	});
}//ostk_loadPatterns

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
			createInputList(form_content, ostk_selected_pattern.required_attributes, true);
		}
		if(ostk_selected_pattern.optional_attributes){
			createText('Optional Attributes', 'h2')
				.appendTo(form_content);
			createInputList(form_content, ostk_selected_pattern.optional_attributes, false);
		}
	}

	$ostk_jQuery('<input>')
		.attr({
			type: 'submit',
			value: 'Create Embed Code',
			class: 'btn'
		})
		.appendTo(form_content);
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

	var embed_str = '<div data-tag="overstock" data-type='+ostk_selected_pattern.slug+' '+attrs+'></div>';
	createText(embed_str)
		.appendTo(embed_code);

	embed_sandbox.html(embed_str);

	ostk_get_elements();

});

function concatFormValues(obj){
	var str = '';
	var key = obj[0].name;
	var value = obj[0].value;
	if(value !== '' && value !== '?'){ //if blank or if ostk_select is on the first option (?)
		str = ' data-'+ key + '="' + value + '"';
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

function createInputList(container, attrs, required){
	var ul = $ostk_jQuery("<ul>");
	for(var i = 0 ; i < attrs.length ; i++){
		var attr = attrs[i];

		var li = $ostk_jQuery("<li>");

		var label = $ostk_jQuery("<label>")
			.text(attr.name+':')
			.appendTo(li);
		if(attr.options){
			var ostk_select = $ostk_jQuery('<select>')
				.attr({
					name: attr.name,
					'attr': true
				});
			if(required){
				ostk_select.attr({
					required: 'true'
				});
			}
		    createOption('Select', '?')
		    	.appendTo(ostk_select);
			for(var k = 0 ; k < attr.options.length ; k++){
				var option = attr.options[k]; 
			    createOption(option)
			    	.appendTo(ostk_select);
			}//for
			ostk_select.appendTo(li);
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
	ul.appendTo(container);

}//createInputs

function createText(text, tag){
	if(tag == null){
		tag = 'p';
	}
	return $ostk_jQuery("<"+tag+">")
		.text(text);
}//createH2

function createOption(text, value){
	if(value == null){
		value == text;
	}
	return $ostk_jQuery("<option />", {value: value, text: text});
}//createOption







