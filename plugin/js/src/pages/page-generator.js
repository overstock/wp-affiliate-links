var ostk_generator = ostk_Generator();

function ostk_Generator(){

	this.construct = function(){
		var _this = this;
		$ostk_jQuery.getJSON(ostk_api_url + "patterns.json", function(ostk_patterns) {
			_this.ostk_patterns = ostk_patterns;
			_this.setupForm();
		});
	};//construct

	// Setup Form
	this.setupForm = function(){
		var ostk_select = $ostk_jQuery('form.ostk-embed-builder select.ostk-type');
	    createOption('Select', '?')
	    	.appendTo(ostk_select);
		for(var i = 0 ; i < this.ostk_patterns.length ; i++) {
			var pattern = this.ostk_patterns[i];
			createOption(pattern['name'], pattern['slug'])
		    	.appendTo(ostk_select);
		}//for

		// var type = 'carousel';
		// $ostk_jQuery('form.ostk-embed-builder select.ostk-type').val(type);
		// ostk_changeType(type);
	}//setupForm

	this.createInputList = function(attrs, required){
		var ul = $ostk_jQuery("<ul>");
		for(var i = 0 ; i < attrs.length ; i++){
			var attr = attrs[i];

			var li = $ostk_jQuery("<li>")
				.appendTo(ul);

		    $ostk_jQuery("<div>")
		    	.attr({
		    		'class': 'group-border'
		    	})
		    	.appendTo(li);

			this.create_attr(attr, required)
				.appendTo(li);

		}//for
		return ul;
	}//createInputs

	//Create Attribute
	this.create_attr = function(attr, required){
		var container = $ostk_jQuery("<div>")

		if(attr.name){
			$ostk_jQuery("<label>")
				.text(attr.name+':')
				.appendTo(container);
		}

		var div = $ostk_jQuery("<div>")
			.attr({
				'class': 'chunk'
			})
			.appendTo(container);

		if(!attr.name){
			div.attr({
				'class': 'chunk no-label'
			});
		}

		//Attribute has options
		if(attr.options){
		    //Options are objects
		    var option_is_object = (typeof attr.options[0]['name'] !== 'undefined') ? true : false;
			if(option_is_object){

				div.attr({
					'class': 'chunk no-label with-options'
				});

			    $ostk_jQuery("<div>")
			    	.attr({
			    		'class': 'group-border'
			    	})
			    	.appendTo(div);

				var ul_tiered = $ostk_jQuery('<ul>')
					.appendTo(div);


				for(var i = 0 ; i < attr.options.length ; i++) {
					var li_tiered = $ostk_jQuery("<li>")
						.appendTo(ul_tiered);

					this.optionObjectPrefix(i)
						.appendTo(li_tiered);

					this.create_attr(attr.options[i], required)
						.appendTo(li_tiered);
				}//for

		    //Options are strings
			}else{
				this.createOptions(attr)
					.appendTo(div);
			}
		//Attribute does not have options
		}else{
			if(required && attr.name === 'type'){
				createText(ostk_selected_pattern['slug'])
					.appendTo(div);
			}else{
				var input = $ostk_jQuery('<input>')
				.attr({
					type: 'text',
					name: attr.name,
					'attr': true
				});
				if(required){
					input.attr({
						required: 'true'
					});
				}
				input.appendTo(div);
			}
		}

		if(attr.description || attr.example){
			this.getInfo(attr)
				.appendTo(div);
		}

		return container;
	}//create_attr

	//Attribute to String
	this.attToString = function(item, str){
		item = item[str];
		if(typeof item == 'string'){
			return createText(str + ': ' + item);
		}else{
			var div = $ostk_jQuery("<div>");
			createText(str+': ')
				.appendTo(div);
			for(var i = 0 ; i < item.length ; i++){
				createText(item[i])
					.appendTo(div);
			}//for
			return div;
		}
	};//attToString

	//Change Type
	this.ostk_changeType = function(type){
		var form_content = $ostk_jQuery('form.ostk-embed-builder .ostk-form-content');

		form_content.html(''); //clear div contents
		$ostk_jQuery('.embed-output').fadeOut('slow'); //hide output

		if(type === '?'){
			form_content.fadeOut('slow');
			ostk_selected_pattern = null;
		}else{
			ostk_selected_pattern = ostk_findObjWhereKeyEqualsValue(this.ostk_patterns, 'slug', type);
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
	}//ostk_changeType

	//Find Object Where Key Equals Value
	this.findObjWhereKeyEqualsValue = function(obj, key_1, value_1){
		/* Iterate throught an array and return the first item that 
		has a specific key with a specific value */
		for(var i = 0 ; i < obj.length ; i++){
			var item = obj[i];
			if(item[key_1] == value_1){
				return item;
			}
		}//for
	}//findObjWhereKeyEquals
	//Concat Form Values
	this.concatFormValues = function(obj, platform){
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
	var embed_code = $ostk_jQuery('.code');
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


/* Change Type
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder select.ostk-type').change(function(){
	var type = $ostk_jQuery('form.ostk-embed-builder select.ostk-type').val();
	ostk_changeType(type);
});

/* Functions
--------------------------------------------------------------------------------*/
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

/* Copy Text
--------------------------------------------------------------------------------*/
$ostk_jQuery('.ostk-copy-to-clipboard-btn').click(function(){
	var copyTextarea = $ostk_jQuery(this).siblings('.ostk-copy-to-clipboard-text');
	copyTextarea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
	} catch (err) {
	}
});