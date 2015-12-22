function ostk_Documentation(){

	this.doc = $ostk_jQuery('.documentation-holder');

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

	this.createLabel = function(str){
		return $ostk_jQuery("<label>")
			.text(str+':');
	};//createLabel

	//Create Attribute
	this.create_attr = function(attr, required){
		var container = $ostk_jQuery("<div>")

		if(attr.name){
			var label_holder = $ostk_jQuery("<div>")
				.attr({
					'class': 'label-holder'
				})
				.appendTo(container);

			this.createLabel(attr.name)
				.appendTo(label_holder);
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

				var ul_tiered = $ostk_jQuery('<ul>')
					.appendTo(div);

				for(var i = 0 ; i < attr.options.length ; i++) {
					var li_tiered = $ostk_jQuery("<li>")
						.appendTo(ul_tiered);

					var prefix_holder = $ostk_jQuery('<div>')
						.attr({
							'class': 'prefix-holder'
						})
						.appendTo(li_tiered);

					this.optionObjectPrefix(i)
						.appendTo(prefix_holder);

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
			ostk_selected_pattern = this.ostk_patterns[type];
			ostk_selected_pattern.slug = type;
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
		}

		$ostk_jQuery('<input>')
			.attr({
				type: 'submit',
				value: 'Create Embed Code',
				class: 'ostk-btn'
			})
			.appendTo(form_content);
	}//ostk_changeType

	this.getInfo = function(attr){
		var info_container = $ostk_jQuery("<div>");

		$ostk_jQuery("<i>")
			.attr({
				'class': 'fa fa-info-circle'
			})
			.appendTo(info_container);

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


