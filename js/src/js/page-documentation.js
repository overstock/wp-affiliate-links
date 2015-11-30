function ostk_Documentation(platform){
	ostk_PatterSelector.call(this, platform);

	this.optionObjectPrefix = function(index){
		return createText((index+1) + ')');
	};//optionObjectPrefix

	this.createOptions = function(attr){
		var options = $ostk_jQuery('<div>')
			.attr({
				'class': 'row'
			});

		for(var i = 0 ; i < attr.options.length ; i++) {
			var opt = attr.options[i];
			createText(attr.options[i])
				.attr({
					'class': 'col-md-6 col-sm-4'
				})
		    	.appendTo(options);
		}//for
		return options;
	};//createOptions

	this.getInfo = function(attr){
		var info_container = $ostk_jQuery("<div>")

		if(attr.description){
			this.attToString(attr, 'description')
				.appendTo(info_container);
		}
		if(attr.example){
			this.attToString(attr, 'example')
				.appendTo(info_container);
		}
		return info_container;
	};//getInfo

	this.construct();

}//ostk_Documentation

var ostk_documentation = ostk_Documentation('wordpress');
	












