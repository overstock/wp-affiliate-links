var ostk_developerId = null;

if(!ostk_isset(ostk_clickPlatform)){
	var ostk_clickPlatform = 'embed';
}

var ostk_clickurl = window.location.href;

var ostk_api_url = 'https://rawgithub.com/overstock/wp-affiliate-links/master/api/';
//Localhost for testing
if(ostk_clickurl.indexOf('http://localhost/~thoki') > -1){
	ostk_api_url = 'http://localhost/~thoki/overstock-affiliate-links/trunk/api/';
}

var scripts = document.getElementsByTagName('script');
for(var i = 0 ; i < scripts.length ; i++){
	if(scripts[i].src.indexOf("overstock-embed") > -1){
		var ostk_src = scripts[i].src;
		if(ostk_src.indexOf("?") > -1){
			var params = ostk_src.split('?')[1];
			var param_items = params.split('&');
			for(var k = 0 ; k < param_items.length ; k++){
				var param_pieces = param_items[k].split('=');
				var key = param_pieces[0];
				var value = param_pieces[1];
				if(key == 'id'){
					ostk_developerId = value;
					break;
				}
			}//for
			break;
		}
	}	
}//for

var event_list = [
	{
		'event': 'Flash Deals',
		'url': 'https://api.test.overstock.com/ads/products/deals?developerid='+ostk_developerId+'&sort=lowest_price'
	},
	{
		'event': 'Promotions',
		'url': 'https://api.test.overstock.com/ads/sales?developerid='+ostk_developerId+'&sale_type=promotion'
	},
	{
		'event': 'Sales',
		'url': 'https://api.test.overstock.com/ads/sales?developerid='+ostk_developerId+'&sale_type=sale'
	}
];

var ostk_plugin = new ostk_Plugin();
