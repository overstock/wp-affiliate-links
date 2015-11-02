<?php
function ostk_admin_page() {
	ob_start(); 
	$ostk_option_settings = get_option('ostk_settings');
	if(empty($ostk_option_settings)){
		$ostk_submitBtnText = 'Add ID';
	}else{
		$ostk_submitBtnText = 'Save Changes';
	}
	?>

	<div class="ostk-plugin-settings">
		<?php echo ostk_get_header('admin');?>
		<div class="ostk-page ostk-home-page">
		 	<h1>Welcome to Overstock.com's Affiliate Shortcode Plugin!</h1>
		 	<p>We are honored that you would allow us to display some of our products on your blog. We spent a lot of time and effort creating the most beautiful embeddable objects on the internet :)</p>

			<div class="icon icon-chevron-down"></div>
			<i class="fa fa-envelope"></i>
			<i class="fa fa-email-envelope"></i>
			<i class="fa fa-o"></i>


			
		    <form action="options.php" method="post">
		      <?php settings_fields('ostk_settings_group'); 
		      ?>
		        <h2>Authenticate LinkShare ID: </h2>

				<?php if(empty($ostk_option_settings)): ?>
					<div class="ostk-notification-block ostk-notification-danger">
						<p>You'll need an authentic LinkShare ID provided free at <a href="http://overstock.com/devapi/" target="_blank" title="Overstock DEV API">http://overstock.com/devapi/</a></p>
					</div>
				<?php else: ?>
					<div class="ostk-notification-block ostk-notification-success">
						<p>Thank you for submitting your LinkShare ID.</p>
					</div>
				<?php endif; ?>

				<p>Paste your LinkShare ID here.</p> 
			 	<p>If the Link Share ID is not valid the affiliate links will bring the user to a page that says, "invalid site code"</p>
		        <input id="ostk_settings" name="ostk_settings" type="text" value="<?php echo get_option('ostk_settings'); ?>"/>
		        <input name="Submit" type="submit" class="btn" value="<?php esc_attr_e($ostk_submitBtnText); ?>" />
		    </form>
		</div><!--.ostk-home-page-->
	</div><!--.ostk-plugin-settings-->
	<?php
	echo ob_get_clean();
}//ostk_admin_page
?>