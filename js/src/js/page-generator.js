var ostk_selected_pattern;

var ostk_generator = ostk_Generator('wordpress');
	

function ostk_Generator(platform){
	this.platform = platform;

	this.construct = function(){
		this.setupForm(ostk_patterns);
	};//construct

	// Setup Form
	this.setupForm = function(ostk_patterns){
		var ostk_select = $ostk_jQuery('form.ostk-embed-builder select.ostk-type');
	    createOption('Select', '?')
	    	.appendTo(ostk_select);
		for(var i = 0 ; i < ostk_patterns.length ; i++) {
			var pattern = ostk_patterns[i];
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

				    $ostk_jQuery("<input>")
				    	.attr({
				    		'type': 'radio'
				    	})
				    	.appendTo(li_tiered);

					this.create_attr(attr.options[i], required)
						.appendTo(li_tiered);
				}//for

		    //Options are strings
			}else{
				var option_select = $ostk_jQuery('<select>')
					.attr({
						name: attr.name,
						'attr': true
					})
					.appendTo(div);

			    createOption('Select', '?')
			    	.appendTo(option_select);

				for(var i = 0 ; i < attr.options.length ; i++) {
					var opt = attr.options[i];
					createOption(opt)
				    	.appendTo(option_select);
				}//for
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
			$ostk_jQuery("<i>")
				.attr({
					'class': 'fa fa-info-circle'
				})
				.appendTo(div);

			var info = $ostk_jQuery("<div>")
				.attr({
					'class': 'info'
				})
				.appendTo(div);

			if(attr.description){
				this.attToString(attr, 'description')
					.appendTo(info);
			}
			if(attr.example){
				this.attToString(attr, 'example')
					.appendTo(info);
			}
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
	}//ostk_changeType

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
	}//concatFormValues

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

	this.construct();
}//ostk_generator


/* Show Info
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder i.fa-info-circle').click(function(){
	console.log('testing');
	$ostk_jQuery(this).siblings('.info').slideToggle('slow');
});

/* Change Type
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder select.ostk-type').change(function(){
	var type = $ostk_jQuery('form.ostk-embed-builder select.ostk-type').val();
	ostk_changeType(type);
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
	var embed_code = $ostk_jQuery('.embed-code');
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
	createText(embed_str)
		.appendTo(embed_code);
	embed_sandbox.html(embed_str);

	ostk_plugin.get_elements();
});











