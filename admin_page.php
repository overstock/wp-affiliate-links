<?php
 /** 
 * Plugin Settings Page
 * Author: Reif Tauati and Travis Hoki
 *
 **/

$ostk_pages = array(
	array(
		'name' => 'Home',
		'slug' => 'admin'
	),
	array(
		'name' => 'Documentation',
		'slug' => 'doc'
	),
	array(
		'name' => 'Sandbox',
		'slug' => 'sandbox'
	)
);

add_action('admin_menu', 'ostk_theme_options_panel');
add_action("admin_init", "ostk_register_settings");
add_action('admin_print_styles', 'ostk_admin_css');
add_action('admin_enqueue_scripts', 'ostk_admin_js');

/**
* Load css
**/
function ostk_admin_css() {
    $url = get_option('siteurl') . '/wp-content/plugins/' . basename(dirname(__FILE__));

	wp_enqueue_style( 'flexslider_script', $url.'/flex-slider/flexslider.css');
	wp_enqueue_style( 'ostk_script', $url.'/css/dest/overstock-shortcodes.min.css');
}//ostk_admin_css

/**
* Load js
**/
function ostk_admin_js() {
    $url = get_option('siteurl') . '/wp-content/plugins/' . basename(dirname(__FILE__));

	wp_enqueue_script('jquery');
	wp_enqueue_script( 'ostk-flex-slider', $url . '/js/dest/overstock-shortcodes.min.js', array('jquery'), '1.0', true );
	wp_enqueue_script( 'ostk-custom-jquery', $url . '/flex-slider/jquery.flexslider-min.js', array('jquery'), '1.0', true );
}//ostk_admin_js

function ostk_get_header($current_page){
	global $ostk_pages;
	$output = '<div class="header">';
		$output .= '<img class="logo" src="'.plugin_dir_url( __FILE__ ).'images/overstock-affiliate-shortcodes.jpg" width="275" height="45"/>';	
		$output .= '<nav>';
			$output .= '<ul>';
				foreach ($ostk_pages as $page) {
					$activeClass = '';
					if($page['slug'] == $current_page){
						$activeClass = 'active';
					}
					$output .= '
						<li>
							<a href="?page=ostk-'.$page['slug'].'" class="btn '.$activeClass.'">'.$page['name'].'</a>
						</li>';
				}//foreach
			$output .= '</ul>';
		$output .= '</nav>';
	$output .= '</div>';
	return $output;
}//ostk_get_header

function ostk_register_settings() {
  register_setting("ostk_settings_group", "ostk_settings");
}//ostk_register_settings

function ostk_theme_options_panel(){
  add_menu_page('Overstock Affiliate Links', 'Overstock Affiliate Links', 'manage_options', 'ostk-admin', 'ostk_admin_page', plugin_dir_url( __FILE__ ).'images/overstock-icon.png');
  add_submenu_page( 'ostk-admin', 'Documentation', 'Documentation', 'manage_options', 'ostk-doc', 'ostk_doc_page');
  add_submenu_page( 'ostk-admin', 'Sandbox', 'Sandbox', 'manage_options', 'ostk-sandbox', 'ostk_sandbox_page');
}
?>