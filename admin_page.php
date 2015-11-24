<?php
 /** 
 * Plugin Settings Page
 * Author: Reif Tauati and Travis Hoki
 *
 **/

add_action('admin_menu', 'ostk_theme_options_panel');
add_action("admin_init", "ostk_register_settings");
add_action('admin_print_styles', 'ostk_load_css');
add_action('admin_enqueue_scripts', 'ostk_load_js');

$OverstockPlugin = new ostk_PluginSetttings();
class ostk_PluginSetttings {
	var $ostk_pages = array('home','generator','documentation','sandbox','contact');

	/* Construct
	-----------------------*/
	function __construct() {
	}//_construct
	
	/* Get Header
	-----------------------*/
	function get_header(){
		global $OverstockPlugin;
		$output = '<div class="header">';
			$output .= '<img class="logo" src="'.plugins_url('images/overstock-affiliate-shortcodes.jpg', __FILE__).'" width="275" height="45"/>';	
			$output .= '<nav>';
				$output .= '<ul>';
					foreach ($OverstockPlugin->ostk_pages as $page) {
						$activeClass = ('ostk-'.$page == $_REQUEST['page']) ? 'active' : '';
						$output .= '
							<li>
								<a href="?page=ostk-'.$page.'" class="ostk-btn '.$activeClass.'">'.ucwords($page).'</a>
							</li>';
					}//foreach
				$output .= '</ul>';
			$output .= '</nav>';
		$output .= '</div>';
		return $output;
	}//ostk_get_header

}//ostk_PluginSetttings

/* Load JS
-----------------------*/
function ostk_load_js() {
	wp_enqueue_script('jquery');
	// wp_enqueue_script( 'ostk-embed-js', plugins_url('api/js/overstock-embed.min.js', __FILE__), array('jquery'), '1.0', true );
	// wp_enqueue_script( 'ostk-plugin-js', plugins_url('js/overstock-plugin.min.js', __FILE__), array('jquery'), '1.0', true );

	/* Local API */
	// wp_enqueue_script( 'ostk-plugin-js', plugins_url('api/js/overstock-embed.min.js', __FILE__), array('jquery'), '1.0', true );

 	/* Local js */
	wp_enqueue_script( 'ostk-flexslider', plugins_url('api/js/src/libs/flexslider.min.js', __FILE__), array('jquery'), '1.0', true );

	wp_enqueue_script( 'ostk-patterns', plugins_url('api/js/src/js/patterns.js', __FILE__), array('jquery'), '1.0', true );
	wp_enqueue_script( 'ostk-function', plugins_url('api/js/src/js/functions.js', __FILE__), array('jquery'), '1.0', true );
	wp_enqueue_script( 'ostk-product-data', plugins_url('api/js/src/js/product-data.js', __FILE__), array('jquery'), '1.0', true );
	wp_enqueue_script( 'ostk-overstock-embed', plugins_url('api/js/src/js/overstock-embed.js', __FILE__), array('jquery'), '1.0', true );
	wp_enqueue_script( 'ostk-generation-function', plugins_url('js/src/js/generation-functions.js', __FILE__), array('jquery'), '1.0', true );

	/* Generator Script */
	wp_enqueue_script( 'ostk-page-generator', plugins_url('js/src/js/page-generator.js', __FILE__), array('jquery'), '1.0', true );

}//ostk_admin_js

/* Load CSS
-----------------------*/
function ostk_load_css() {
	wp_enqueue_style( 'ostk-embed-styles', plugins_url('api/css/overstock-embed.min.css', __FILE__));
	wp_enqueue_style( 'ostk-plugin-styles', plugins_url('css/overstock-plugin.min.css', __FILE__));
}//ostk_admin_css

function ostk_register_settings() {
	register_setting("ostk_settings_group", "ostk_settings");
}//ostk_register_settings

function ostk_theme_options_panel(){
	global $OverstockPlugin;
	foreach ($OverstockPlugin->ostk_pages as $page) {
		if($page == 'home'){
			add_menu_page('Overstock Affiliate Links', 'Overstock Affiliate Links', 'manage_options', 'ostk-home', 'ostk_home_page', plugin_dir_url( __FILE__ ).'images/overstock-icon.png');
		}else{
			add_submenu_page( 'ostk-home', $page, $page, 'manage_options', 'ostk-'.$page, 'ostk_'.$page.'_page');
		}
	}//foreach
}
?>