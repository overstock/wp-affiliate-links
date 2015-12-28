// var ostk_documentation = $ostk_jQuery.extend({}, new ostk_Documentation(), new ostk_Generator());	
// ostk_documentation.construct();

var ostk_documentation = new ostk_Documentation('generator');

/* Overstock Generator Class
--------------------------------------------------------------------------------*/
function ostk_Generator(){

};//ostk_Generator







/* Show Info
--------------------------------------------------------------------------------*/
$ostk_jQuery('form.ostk-embed-builder i.fa-info-circle').click(function(){
	$ostk_jQuery(this).siblings('.info').slideToggle('slow');
});

/* Select Options
--------------------------------------------------------------------------------*/
$ostk_jQuery('form').on('change', 'input[type="radio"]', function() {
	var _this = $ostk_jQuery(this);
	disableSiblings(_this);
});

$ostk_jQuery('.required-attributes-list input[attr="true"], .required-attributes-list select[attr="true"]').focus(function(){
	var _this = $ostk_jQuery(this);
	disableSiblings(_this);

	//Check the radio button
	_this.closest('li').find('input[type="radio"]').prop('checked', true);
});

function disableSiblings(_this){
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