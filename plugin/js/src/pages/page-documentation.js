var ostk_documentation = $ostk_jQuery.extend({}, new ostk_Documentation(), new ostk_Generator());	
ostk_documentation.construct();

/* Overstock Generator Class
--------------------------------------------------------------------------------*/
function ostk_Generator(){

	this.optionObjectPrefix = function(index){
		return createText(index + 1 + '.')
			.attr({
				'class': 'att-option-numb'
			});
	};//optionObjectPrefix

	this.createOptions = function(attr){
		var options = $ostk_jQuery('<ul>');
		var colClass = 'col-sm-12';
		if(attr.options.length > 3){
			colClass = 'col-sm-4'
		}
		for(var i = 0 ; i < attr.options.length ; i++) {
			var opt = attr.options[i];
			createText(opt, 'li')
				.attr({
					'class': colClass				
				})
		    	.appendTo(options);
		}//for
		return options;
	};//createOptions

};//ostk_Generator
