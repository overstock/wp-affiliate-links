var ostk_documentation = new ostk_Documentation('generator');

/* Select Options
--------------------------------------------------------------------------------*/
$ostk_jQuery('form').on('change', 'input[type="radio"]', function() {
	var _this = $ostk_jQuery(this);
	disableSiblings(_this);
});

$ostk_jQuery('.required-attributes-list input[attr="true"], .required-attributes-list select[attr="true"]').focus(function(){
	var _this = $ostk_jQuery(this);
	disableSiblings(_this);
});

$ostk_jQuery('.required-attributes-list .attr_label label').click(function(){
	var _this = $ostk_jQuery(this);
	disableSiblings(_this);
});

function disableSiblings(_this){
	var li = _this.closest('li');

	//Undisable the input or select box when selecting an options radio button
	li.find('input[attr="true"], select[attr="true"]').prop('disabled', false);
	li.find('.attr_content').removeClass('hidden');

	//Check the radio button
	li.find('input[type="radio"]').prop('checked', true);

	//Siblings list items
	var sibs = li.siblings('li');
	sibs.find('.attr_content').addClass('hidden');

	//Disable other option's input or select box
	sibs.find('input[attr="true"], select[attr="true"]').prop('disabled', true);

	//Uncheck other options radio buttons
	sibs.find('input[type="radio"]').prop('checked', false);
}

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
		attrs += ostk_documentation.concatFormValues($ostk_jQuery(this), 'wordpress');
	});
	var shortcode = '[overstock type="'+ostk_selected_pattern.slug+'" '+attrs+']';

	//Embed
	var attrs2 = '';
	$ostk_jQuery('form.ostk-embed-builder input[attr="true"]:enabled, form.ostk-embed-builder select[attr="true"]:enabled').each(function(){
		attrs2 += ostk_documentation.concatFormValues($ostk_jQuery(this), 'embed');
	});
	var embedcode = '<div data-tag="overstock" data-type="'+ostk_selected_pattern.slug+'" '+attrs2+'></div>';

	console.log(embedcode);
	embed_code.html(shortcode);

	embed_sandbox.html(embedcode);

	ostk_plugin.get_elements();
});

/* Copy Text
--------------------------------------------------------------------------------*/
$ostk_jQuery('.ostk-copy-to-clipboard-btn').click(function(){
	var copyTextarea = $ostk_jQuery(this).siblings('.ostk-copy-to-clipboard-text');
	copyTextarea.select();

	var notification = $ostk_jQuery(this).siblings('.ostk-copy-to-clipboard-notification');
	notification.fadeIn('slow');
	var copyTimer = setInterval(function(){ 
		clearInterval(copyTimer);
		notification.fadeOut('slow');
	}, 3000);

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
	} catch (err) {
	}
});