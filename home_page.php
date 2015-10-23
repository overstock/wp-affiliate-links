<?php
function ostk_admin_page() {
	ob_start(); 
	?>
	<div class="ostk-plugin-settings">
		<?php echo ostk_get_header('admin');?>
		<div class="ostk-page ostk-home-page">
		 	<h1>Welcome to Overstock.com's Affiliate Shortcode Plugin!</h1>
		 	<p>We are honored that you would allow us to display some of our products on your blog. We spent a lot of time and effort creating the most beautiful embeddable objects on the internet :)</p>

		    <form action="options.php" method="post">
		      <?php settings_fields('ostk_settings_group'); 
		      ?>
		        <h2>Authenticate LinkShare ID: </h2>
				<p>Paste your LinkShare ID here.</p> 
			 	<p>If the Link Share ID is not valid the affiliate links will bring the user to a page that says, "invalid site code"</p>
		        <input id="ostk_settings" name="ostk_settings" type="text" value="<?php echo get_option('ostk_settings'); ?>"/>
		        <input name="Submit" type="submit" class="btn" value="<?php esc_attr_e('Save Changes'); ?>" />
		    </form>
		</div><!--.ostk-home-page-->
	</div><!--.ostk-plugin-settings-->
	<?php
	echo ob_get_clean();
}//ostk_admin_page
?>