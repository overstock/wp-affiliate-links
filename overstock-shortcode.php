<?php
/*
* Plugin Name: Overstock Affiliate Shortcode Plugin
* Description: Create monetized links to millions of products in seconds. We support 9 different SHORTCODE types including carousel, rectangle and skyscraper. 
* Version: 1.1
* Author: reiftauati and travishoki
* Author URI: http://www.overstock.com/affiliate-portal-homepage
*/

/* Pages */
include_once('pages/home-page.php');
include_once('pages/generator-page.php');
include_once('pages/documentation-page.php');
include_once('pages/sandbox-page.php');
include_once('pages/contact-page.php');

/* Developer ID */
$GLOBALS['developerId'] = get_option('ostk_settings');

add_shortcode('overstock', 'ostk_generateShortcodeWidgets');
add_action( 'wp_enqueue_scripts', 'ostk_load_css' );
add_action( 'wp_enqueue_scripts', 'ostk_load_js' );

add_action('admin_menu', 'ostk_theme_options_panel');
add_action("admin_init", 'ostk_register_settings');
add_action('admin_print_styles', 'ostk_load_css');
add_action('admin_enqueue_scripts', 'ostk_load_js');

$OverstockPlugin = new ostk_PluginSettings();




//Overstock Widget Generator
function ostk_generateShortcodeWidgets($atts){
    $str = '';
    foreach($atts as $key => $value){
        $str .= 'data-'.$key.'="'.$value.'"';
    }//for
    echo '<div data-tag="overstock" '.$str.'></div>';
}//ostk_generateShortcodeWidgets


class ostk_PluginSettings {
  var $ostk_pages = array('home','generator','documentation','sandbox','contact');

  /* Constructor
  -----------------------*/
  function ostk_PluginSettings(){

  }//ostk_PluginSettings


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

}//ostk_PluginSettings

/* Load JS
-----------------------*/
function ostk_load_js() {
  wp_enqueue_script('jquery');

  /* Initialize the plugin */
  wp_enqueue_script( 'ostk-plugin', plugins_url('js/src/js/plugin.js', __FILE__), array('jquery'), '1.0', true );

  /*
  // Live API
  wp_enqueue_script( 'ostk-embed-js', plugins_url('api/js/overstock-embed.min.js', __FILE__), array('jquery'), '1.0', true );
  wp_enqueue_script( 'ostk-plugin-js', plugins_url('js/overstock-plugin.min.js', __FILE__), array('jquery'), '1.0', true );

  // Local API
  wp_enqueue_script( 'ostk-plugin-js', plugins_url('api/js/overstock-embed.min.js', __FILE__), array('jquery'), '1.0', true );
  */

  /* Local js */
  wp_enqueue_script( 'ostk-flexslider', plugins_url('api/js/src/libs/flexslider.min.js', __FILE__), array('jquery'), '1.0', true );

  //Api Files
  wp_enqueue_script( 'ostk-api-patterns', plugins_url('api/js/src/js/patterns.js', __FILE__), array('jquery'), '1.0', true );
  wp_enqueue_script( 'ostk-api-function', plugins_url('api/js/src/js/functions.js', __FILE__), array('jquery'), '1.0', true );
  wp_enqueue_script( 'ostk-api-product-data', plugins_url('api/js/src/js/product-data.js', __FILE__), array('jquery'), '1.0', true );
  wp_enqueue_script( 'ostk-api-overstock-embed', plugins_url('api/js/src/js/overstock-embed.js', __FILE__), array('jquery'), '1.0', true );

  //Plugin JS
  wp_enqueue_script( 'ostk-plugin-function', plugins_url('js/src/js/functions.js', __FILE__), array('jquery'), '1.0', true );
  wp_enqueue_script( 'ostk-plugin-pattern-selector', plugins_url('js/src/js/pattern-selector.js', __FILE__), array('jquery'), '1.0', true );

  // Page specific JS
  switch($_REQUEST['page']){
    case 'ostk-documentation':
      wp_enqueue_script( 'ostk-page-documentation', plugins_url('js/src/js/page-documentation.js', __FILE__), array('jquery'), '1.0', true );
      break;
    case 'ostk-generator':
      wp_enqueue_script( 'ostk-page-generator', plugins_url('js/src/js/page-generator.js', __FILE__), array('jquery'), '1.0', true );
      break;      
    case 'ostk-home':
      wp_enqueue_script( 'ostk-page-home', plugins_url('js/src/js/page-home.js', __FILE__), array('jquery'), '1.0', true );
      break;
  }//switch


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
      add_submenu_page( 'ostk-home', ucwords($page), ucwords($page), 'manage_options', 'ostk-'.$page, 'ostk_'.$page.'_page');
    }
  }//foreach
}
?>