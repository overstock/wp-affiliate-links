<?php
function ostk_sandbox_page() {
	global $OverstockPlugin;
	ob_start(); 
	if (isset($_POST['submit'])) {
		$shortcode = stripslashes($_POST['shortcode']);
	};
	?>
	<div class="ostk-plugin-settings">
		<?php echo $OverstockPlugin->get_header();?>
		<section class="ostk-sandbox-page">
			<div class="ostk-section-inner">
				<h1>Sandbox</h1>
				<p>Insert your shortcodes here to test what the affilate link will look like.</p>
				<div class="shortcode-input">
					<h2>INPUT</h2>
					<div class="inner">
						<form method="post" action="<?php echo ($_SERVER['PHP_SELF']);?>?page=ostk-sandbox">
				            <textarea cols="60" rows="5" placeholder="Shortcode sandbox..." id="shortcode" name="shortcode"><?php echo $shortcode;?></textarea>
				            <input type="submit" name="submit" class="ostk-btn" value="Try It!" id="submit"/>
				        </form>
					</div>
				</div><!--.input-->
				<div class="shortcode-output">
					<h2>OUTPUT</h2>
					<div class="inner">
						<?php
						if(isset($shortcode)){
							echo do_shortcode($shortcode);					
						}			
						?>
					</div>
				</div><!--.output-->
				<div class="clearfix"></div>

			</div><!-- ostk-section-inner -->
		</section>
	</div><!-- ostk-plugin-settings -->
	<?php
	echo ob_get_clean();
}//ostk_sandbox_page
?>