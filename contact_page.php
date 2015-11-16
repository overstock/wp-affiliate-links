<?php
function ostk_contact_page() {
	global $OverstockPlugin;
	ob_start(); 
	?>

	<div class="ostk-plugin-settings">
		<?php echo $OverstockPlugin->get_header();?>
		<section class="ostk-contact-page">
			<div class="ostk-section-inner">
				<h1>Contact page</h1>
				<p>You can email <a href="mailto:apisupport@overstock.com?Subject=WP%20Affiliate%20Link%20Plugin%20Support" target="_top">apisupport@overstock.com</a> for any additional questions, inquiries, or feedback.</p>
			</div><!-- ostk-section-inner -->
		</section>
	</div><!-- ostk-plugin-settings -->
	<?php
	echo ob_get_clean();
}//ostk_contact_page
?>