<?php

/**
 * Plugin Name: WP-Chattr
 * Plugin URI: http://dev.adampalmer.me/wp-chattr
 * Description: Provide real time chat between website users
 * Version: 1.0.0
 * Author: Adam Palmer
 * Author URI: http://www.adampalmer.me
 * License: MIT
 */

defined( 'ABSPATH' ) or die();
define( 'CHATTR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/* Install/Uninstall */
function chattr_activate() {
	update_option('chattr_options', serialize(['chatname' => 'Main', 'server' => 'dev.adampalmer.me', 'port' => '8080']) );
}
register_activation_hook( __FILE__, 'chattr_activate');

function chattr_deactivate() {
	delete_option('chattr_options');
}
register_deactivation_hook( __FILE__, 'chattr_deactivate');

/* Add admin menu item & page */

function chattr_admin() {
    include('chattr_admin.php');
}

function chattr_admin_actions() {
    add_options_page("Chattr", "Chattr", 1, "Chattr", "chattr_admin");
}

add_action('admin_menu', 'chattr_admin_actions');

/* Register shortcode */

function chattr_shortcode ($atts, $content = null) {
	$options = shortcode_atts([
		'title' => 'Default Title'
		], $atts);

	include(__DIR__ . '/_inc/main.php');
}
add_shortcode( 'chattr', 'chattr_shortcode' );


/* Register scripts */
function chattr_scripts() {
	wp_enqueue_style( 'chattr_css', CHATTR_PLUGIN_URL . '_inc/chat.css');
	wp_enqueue_script( 'socket.io', CHATTR_PLUGIN_URL . '_inc/socket.io.js', array('jquery'));
	wp_enqueue_script( 'chattr_js', CHATTR_PLUGIN_URL . '_inc/app.js', array('jquery', 'socket.io'));
}

function settings_js() {
        $chattr_options = unserialize(get_option('chattr_options'));

        $settings  = "<script>\n";
	foreach ($chattr_options as $key => $value)
	{
		$settings .= "chattr_" . $key . " = \"" . $value . "\";" . "\n";
	}
	$nickname = wp_get_current_user()->user_login;
	if (empty($nickname)) $nickname = "guest" . rand(1000,9999);
        $settings .= "nickname = \"" . $nickname . "\";";
        $settings .= "</script>\n";

        echo $settings;
}

add_action('wp_enqueue_scripts', 'chattr_scripts' );
add_action('wp_head', 'settings_js');

?>
