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
	this.create_attr = function(attr, required, test){
		console.log('-- create_attr --');
		var container = $ostk_jQuery("<div>");

		if(attr.name){
			console.dir(attr);
			var label_holder = $ostk_jQuery("<div>")
				.attr({
					'class': 'attr_label'
				})
				.appendTo(container);

			if(test !== null){
				this.optionObjectPrefix(test)
					.appendTo(label_holder);
			}

			this.createLabel(attr.name)
				.appendTo(label_holder);
		}
		var container_inner = $ostk_jQuery("<div>")
			.attr({
				'class': 'attr_content'
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
						.attr({
							'class': 'no-label'
						})
						.appendTo(ul_tiered);

					var li_contents = this.create_attr(attr.options[i], required, i).html();
						li_tiered.html(li_contents);
				}//for

		    //Options are strings
			}else{
				this.createOptions(attr)
					.appendTo(container_inner);
			}
		//Attribute does not have options
		}else{
			if(required && attr.name === 'type'){
				createText(ostk_selected_pattern['slug'])
					.appendTo(container_inner);
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
				input.appendTo(container_inner);
			}
		}

		if(attr.description || attr.example){
			this.getInfo(attr)
				.appendTo(container_inner);
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


