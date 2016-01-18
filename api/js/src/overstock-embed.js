// Only load the plugin if it hasn't already been loaded. 
// Widget embeds might include the script tag multiple times.
if(typeof(ostk_plugin) == 'undefined'){
	var ostk_developerId = null;

	if(!ostk_isset(ostk_clickPlatform)){
		var ostk_clickPlatform = 'embed';
	}

	var ostk_clickurl = window.location.href;

	var scripts = document.getElementsByTagName('script');

	for(var i = 0 ; i < scripts.length ; i++){
		if(scripts[i].src.indexOf("overstock-embed") > -1){
			var id_value = ostk_searchURLForParam(scripts[i].src, 'id');
			if(id_value){
				ostk_developerId = id_value;
			}
		}	
	}//for

	var ostk_url = 'https://api.test.overstock.com';
	if(
		typeof(os) !== 'undefined' && 
		typeof(os.Otags) !== 'undefined' && 
		typeof(os.Otags.api_url) !== 'undefined'
	){
		ostk_url = os.Otags.api_url;
	}
	var event_list = [
		{
			'event': 'flash_deals',
			'url': ostk_url+'/ads/products/deals?developerid='+ostk_developerId+'&sort=lowest_price'
		},
		{
			'event': 'promotions',
			'url': ostk_url+'/ads/sales?developerid='+ostk_developerId+'&sale_type=promotion'
		},
		{
			'event': 'sales',
			'url': ostk_url+'/ads/sales?developerid='+ostk_developerId+'&sale_type=sale'
		}
	];

	var ostk_plugin = new ostk_Plugin();
}
