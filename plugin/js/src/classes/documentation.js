function ostk_Documentation(type){

	this.doc = $ostk_jQuery('.documentation-holder');
	this.type = type;

	this.construct = function(){
		this.ostk_patterns = ostk_patterns;

		this.currentPattern = ostk_searchURLForParam(window.location.href, 'widget');
		if(this.currentPattern){
			this.selectPattern(this.currentPattern);
		}else{
			this.createPatternList();
		}
	};//construct

	this.createPatternList = function(){
		var counter = 1;
		this.patternList = $ostk_jQuery("<div>")

    	this.patternList
    		.appendTo(this.doc);

    	for(pattern_name in ostk_patterns){
    		var pattern = ostk_patterns[pattern_name];
			createText(counter + ') '+ pattern.name, 'h2')
				.attr({
					'data-type': pattern_name
				})
		    	.appendTo(this.patternList);
	    	counter++;
		}//for
	}//createPatternList

	this.createPatterSelecter = function(){
		this.patternSelector = $ostk_jQuery("<select>")
			.attr({
				'class': 'ostk-type'
			})
	    	.appendTo(this.doc);

	    createOption('Select', '?')
	    	.appendTo(this.patternSelector);

    	for(pattern_name in ostk_patterns){
    		var pattern = ostk_patterns[pattern_name];
			createOption(pattern['name'], pattern_name)
		    	.appendTo(this.patternSelector);
		}//for
	}//createPatterSelecter

	this.selectPattern = function(type){
		this.createPatterSelecter();
		if(this.patternList){
			this.hide(this.patternList);
		}
		this.ostk_changeType(type);
		this.patternSelector.val(type);
	};

	this.hide = function(obj){

		obj.hide();
	};//hide

	this.createInputList = function(attrs, required){
		var ul_class = '';
		if(required){
			ul_class = 'required-attributes-list';
		}else{
			ul_class = 'optional-attributes-list';
		}
		var ul = $ostk_jQuery("<ul>")
	    	.attr({
	    		'class': ul_class
	    	});
		for(var i = 0 ; i < attrs.length ; i++){
			var attr = attrs[i];

			var li = $ostk_jQuery("<li>")
				.appendTo(ul);

			var li_contents = this.create_attr(attr, required, null).html();
			li.html(li_contents)

		    $ostk_jQuery("<div>")
		    	.attr({
		    		'class': 'group-border'
		    	})
		    	.prependTo(li);

		}//for
		return ul;
	}//createInputs

	this.createLabel = function(str){
		return $ostk_jQuery("<label>")
			.text(str+':');
	};//createLabel

	//Create Attribute
	this.create_attr = function(attr, required, index){
		var container = $ostk_jQuery("<div>");

		var content_classes = 'attr_content';
		if(attr.name){
			if(this.type === 'generator' && required && attr.name !== 'type'){
				content_classes += ' hidden';
			}

			var label_holder = $ostk_jQuery("<div>")
				.attr({
					'class': 'attr_label'
				})
				.appendTo(container);

			if(index !== null){
				if(this.type === 'generator'){
					$ostk_jQuery("<input>")
						.attr({
							'type': 'radio'
						})
						.appendTo(label_holder);
				}else{
					createText(index + 1 + '.')
						.attr({
							'class': 'att-option-numb'
						})
						.appendTo(label_holder);
				}
			}

			this.createLabel(attr.name)
				.appendTo(label_holder);

			if(attr.description){
				createText(attr.description)
					.appendTo(label_holder);
			}

		}
		var container_inner = $ostk_jQuery("<div>")
			.attr({
				'class': content_classes
			})
			.appendTo(container);

		//Attribute has options
		if(attr.options){
		    //Options are objects
		    var option_is_object = (typeof attr.options[0]['name'] !== 'undefined') ? true : false;
			if(option_is_object){

				var ul_tiered = $ostk_jQuery('<ul>')
					.appendTo(container_inner);

				for(var i = 0 ; i < attr.options.length ; i++) {
					var li_tiered = $ostk_jQuery("<li>")
						.appendTo(ul_tiered);

					var li_contents = this.create_attr(attr.options[i], required, i).html();
						li_tiered.html(li_contents);
				}//for

		    //Options are strings
			}else{
				createText('Options: ', 'label')
					.appendTo(container_inner);

				this.createOptions(attr)
					.appendTo(container_inner);
			}
		//Attribute does not have options
		}else{
			if(required && attr.name === 'type'){
				createText(ostk_selected_pattern['slug'])
					.appendTo(container_inner);
			}else{
				if(this.type === 'generator'){
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
					input.appendTo(container_inner);
				}
			}
		}

		if(attr.example){
			this.attToString(attr, 'example')
				.appendTo(container_inner);
		}

		return container;
	}//create_attr

	//Attribute to String
	this.attToString = function(item, str){
		var div = $ostk_jQuery("<div>");
		var	item = item[str];
		if(typeof item == 'string'){
			createText(str + ': ', 'label')
				.appendTo(div);

			createText(item)
				.appendTo(div);
		}else{
			createText(str+': ')
				.appendTo(div);
			for(var i = 0 ; i < item.length ; i++){
				createText(item[i])
					.appendTo(div);
			}//for
		}
		return div;
	};//attToString

	//Change Type
	this.ostk_changeType = function(type){
		var form_content = $ostk_jQuery('form.ostk-embed-builder .ostk-form-content');

		form_content.html(''); //clear div contents
		$ostk_jQuery('.embed-output').fadeOut('slow'); //hide output

		if(type === '?'){
			form_content.fadeOut('slow');
			this.ostk_selected_pattern = null;
		}else{
			ostk_selected_pattern = this.ostk_patterns[type];

			this.ostk_selected_pattern = ostk_selected_pattern;
			this.ostk_selected_pattern.slug = type;

			if(ostk_selected_pattern.description){
				createText(ostk_selected_pattern.description)
					.appendTo(form_content);
			}
			if(ostk_selected_pattern.notes){
				this.attToString(ostk_selected_pattern, 'notes')
					.appendTo(form_content);
			}

			if(this.type !== 'generator'){
				if(ostk_selected_pattern.example_shortcodes){
					this.createShortCode(ostk_selected_pattern.example_shortcodes)
						.appendTo(form_content);
				}
			}

			form_content.fadeIn('slow');
			if(ostk_selected_pattern.required_attributes){
				createText('Required Attributes', 'h2')
					.appendTo(form_content);
				var inputList = this.createInputList(ostk_selected_pattern.required_attributes, true);
				inputList.appendTo(form_content);
			}
			if(ostk_selected_pattern.optional_attributes){
				createText('Optional Attributes', 'h2')
					.appendTo(form_content);
				var inputList = this.createInputList(ostk_selected_pattern.optional_attributes, false);
				inputList.appendTo(form_content);
			}
			ostk_plugin.get_elements();
		}
		if(this.type === 'generator'){
			$ostk_jQuery('<input>')
				.attr({
					type: 'submit',
					value: 'Create Embed Code',
					class: 'ostk-btn'
				})
				.appendTo(form_content);
		}
	}//ostk_changeType

	this.createShortCode = function(shortcodes){
		var val = $ostk_jQuery('<div>')

		for(var i = 0 ; i < shortcodes.length ; i++){
			var shortcode = shortcodes[i];

			createText('Shortcode', 'h3')
				.attr('class', 'center')
				.appendTo(val);

			var code_text = '';
			var code = $ostk_jQuery('<textarea>')
				.attr('class', 'code')
				.appendTo(val);

			var s = $ostk_jQuery('<div>')
				s.attr('data-tag', 'overstock')
				.appendTo(val);

			for(var att in shortcode){
				if(att === 'type'){
					shortcode[att] = this.ostk_selected_pattern.slug;
				}
				s.attr('data-'+att, shortcode[att]);
				code_text += ' '+att+'="'+shortcode[att]+'"';
			}//for

			code.text('[overstock'+code_text+']')

		}//for

		return val;
	};//createShortCode

	this.createOptions = function(attr){
		if(this.type === 'generator'){
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
		}else{
			var options = $ostk_jQuery('<ul>');
			if(attr.options.length > 3){
				options.attr({
					'class': 'list'
				});
			}
			for(var i = 0 ; i < attr.options.length ; i++) {
				var opt = attr.options[i];
				createText(opt, 'li')
			    	.appendTo(options);
			}//for
			return options;
		}
	};//createOptions

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

	this.construct();

}//ostk_Documentation


/* Change Type
--------------------------------------------------------------------------------*/
$ostk_jQuery('.documentation-holder').on('click', 'h2', function(){
	var type = $ostk_jQuery(this).data('type');
	ostk_documentation.selectPattern(type);
});//function

$ostk_jQuery('.documentation-holder').on('change', 'select.ostk-type', function(){
	var type = $ostk_jQuery(this).val();
	ostk_documentation.ostk_changeType(type);
});


