<?php
/*
* Plugin Name: Overstock Affiliate Shortcode Plugin
* Description: Create monetized links to millions of products in seconds. We support 9 different SHORTCODE types including carousel, rectangle and skyscraper. 
* Version: 1.1
* Author: reiftauati and travishoki
* Author URI: http://www.overstock.com/affiliate-portal-homepage
*/

/* Pages */
include_once('plugin/pages/home.php');
include_once('plugin/pages/generator.php');
include_once('plugin/pages/documentation.php');
include_once('plugin/pages/sandbox.php');
include_once('plugin/pages/contact.php');

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

    /* Get Header
    -----------------------*/
    function get_header(){
        global $OverstockPlugin;
        $output = '<div class="header">';
            $output .= '<img class="logo" src="'.plugins_url('plugin/images/overstock-affiliate-shortcodes.jpg', __FILE__).'" width="275" height="45"/>';  
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

        $output .= '<div class="ostk-notifications">';
        $output .= '</div>';
        return $output;
    }//ostk_get_header
}//ostk_PluginSettings

/* Load JS
-----------------------*/
function ostk_load_js() {
    wp_enqueue_script('jquery');

    $ostk_scripts = [];

    /* Initialize the plugin */
    array_push($ostk_scripts, 'plugin/js/src/plugin.js');

    wp_enqueue_script( 'ostk-embed-widget', 'https://rawgithub.com/overstock/wp-affiliate-links/master/api/dist/overstock-embed.min.js?id='.$GLOBALS['developerId'], array('jquery'), '1.0', true );

    //Functions
    array_push($ostk_scripts, 'plugin/js/src/functions.js');

    //Class
    array_push($ostk_scripts, 'plugin/js/src/classes/documentation.js');

    $ostk_pageJs;
    // Page specific JS
    switch($_REQUEST['page']){
        case 'ostk-documentation':
            $ostk_pageJs = 'page-documentation';
            break;      
        case 'ostk-generator':
            $ostk_pageJs = 'page-generator';
            break;      
        case 'ostk-home':
            $ostk_pageJs = 'page-home';
            break;
    }//switch
    if(isset($ostk_pageJs)){
        array_push($ostk_scripts, 'plugin/js/src/pages/'.$ostk_pageJs.'.js');
    }

    for($i = 0 ; $i < count($ostk_scripts) ; $i ++){
        wp_enqueue_script( 'ostk-'.$ostk_scripts[$i], plugins_url($ostk_scripts[$i], __FILE__), array('jquery'), '1.0', true );
    }//for

}//ostk_admin_js

/* Load CSS
-----------------------*/
function ostk_load_css() {
    wp_enqueue_style( 'ostk-plugin-styles', plugins_url('plugin/css/overstock-plugin.min.css', __FILE__));
}//ostk_admin_css

function ostk_register_settings() {
    register_setting("ostk_settings_group", "ostk_settings");
}//ostk_register_settings

function ostk_theme_options_panel(){
    global $OverstockPlugin;
    add_menu_page('Overstock Affiliate Links', 'Overstock Affiliate Links', 'manage_options', 'ostk-home', 'ostk_home_page', plugin_dir_url( __FILE__ ).'plugin/images/overstock-icon.png');
    foreach ($OverstockPlugin->ostk_pages as $page) {
        add_submenu_page( 'ostk-home', ucwords($page), ucwords($page), 'manage_options', 'ostk-'.$page, 'ostk_'.$page.'_page');
    }//foreach
}//ostk_theme_options_panel

?>