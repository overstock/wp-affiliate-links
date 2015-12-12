<?php
function ostk_home_page() {
	global $OverstockPlugin;
	ob_start(); 
	$ostk_option_settings = get_option('ostk_settings');
	?>

	<div class="ostk-plugin-settings ostk-home-page">
		<?php echo $OverstockPlugin->get_header();?>
		<section>
			<div class="ostk-section-inner">
			 	<h1>Welcome to Overstock.com's Affiliate Shortcode Plugin!</h1>
			 	<p>We are honored that you would allow us to display some of our products on your blog. We spent a lot of time and effort creating the most beautiful embeddable objects on the internet :)</p>
			</div><!-- ostk-section-inner -->
		</section>

		<?php if(empty($ostk_option_settings)): ?>

			<section class="step step1">
				<div class="ostk-section-inner">
					<h2>Step 1</h2>
					<h3>Do you have a LinkShare ID?</h3>
					<div class="ostk-btns">
						<button class="ostk-btn" onClick="ostk_showStep('step-where-from');">Yes</button>
						<button class="ostk-btn" onClick="ostk_showStep('step-get-linkshare-id');">No</button>
					</div><!-- ostk-section-inner -->
				</div><!-- ostk-section-inner -->
			</section>

			<section class="hidden step step-where-from">
				<button class="ostk-back-btn" onClick="ostk_backStep();">
					<i class="fa fa-arrow-circle-left"></i> Back
				</button>
				<div class="ostk-section-inner">
					<h2></h2>
					<h3>Where did you obtain your LinkShare ID?</h3>
					<div class="ostk-btns">
						<button class="ostk-btn" onClick="ostk_showStep('step-register-with-ostk');">I have an existing LinkShare ID</button>
						<button class="ostk-btn" onClick="ostk_showStep('step-input-linkshare-id');">Through the Overstock Affiliate Link Portal</button>
					</div>
				</div><!-- ostk-section-inner -->
			</section>

			<section class="hidden step step-register-with-ostk">
				<button class="ostk-back-btn" onClick="ostk_backStep();">
					<i class="fa fa-arrow-circle-left"></i> Back
				</button>
				<div class="ostk-section-inner">
					<h2></h2>
					<h3>Register your LinkShare ID with Overstock</h3>
		        	<ol>		
		        		<li>Login to <a href="http://linkshare.com" target="_blank">Linkshare.com</a></li>
				        <li>Seach Advertiserers for Overstock.com INC.</li>
				        <li>Click Apply</li>
				        <li>After 1-2 business days you will recieve an email confirming your account registration.</li>
				    </ol>

					<div class="ostk-btns">
						<button class="ostk-btn" onClick="ostk_showStep('step-input-linkshare-id');">Continue</button>
					</div>
				</div><!-- ostk-section-inner -->
			</section>

			<section class="hidden step step-get-linkshare-id">
				<button class="ostk-back-btn" onClick="ostk_backStep();">
					<i class="fa fa-arrow-circle-left"></i> Back
				</button>
				<div class="ostk-section-inner">
					<h2></h2>
					<h3>Authenticate your LinkShare ID</h3>
					<p>You'll need an authentic LinkShare ID provided free at <a href="http://www.overstock.com/affiliate-portal-homepage" target="_blank" title="Overstock DEV API">http://www.overstock.com/affiliate-portal-homepage</a></p>
					<div class="ostk-btns">
						<button class="ostk-btn" onClick="ostk_showStep('step-input-linkshare-id');">Continue</button>
					</div>
				</div><!-- ostk-section-inner -->
			</section>

		<?php else: ?>
			<section class="step step1">
				<div class="ostk-section-inner">
					<h3><i class="fa fa-check"></i> Thank you for submitting your LinkShare ID.</h3>
				 	<p>If the Link Share ID is not valid the affiliate links will bring the user to a page that says, "invalid site code"</p>
					<div class="ostk-btns">
						<button class="ostk-btn" onClick="ostk_showStep('step-input-linkshare-id');" title="Edit LinkShare ID"><i class="fa fa-edit"></i> LinkShare ID</button>
					</div>
				</div><!-- ostk-section-inner -->
			</section>
		<?php endif; ?>

		<section class="hidden step step-input-linkshare-id">
			<button class="ostk-back-btn" onClick="ostk_backStep();">
				<i class="fa fa-arrow-circle-left"></i> Back
			</button>
			<div class="ostk-section-inner">
				<?php if(empty($ostk_option_settings)): ?>
					<h2></h2>
				<?php endif;?>
		        <h3>Authenticate LinkShare ID: </h3>
			    <form action="options.php" method="post">
			      <?php settings_fields('ostk_settings_group'); 
			      ?>
					<p>Paste your LinkShare ID here.</p> 
			        <input id="ostk_settings" name="ostk_settings" type="text" value="<?php echo get_option('ostk_settings'); ?>"/>
 			        <button class="ostk-btn">
						<?php
						if(empty($ostk_option_settings)){ 
							echo '<i class="fa fa-plus"></i> Add ID';
						}else{ 
							echo '<i class="fa fa-save"></i> Save Changes';
						}
						?>
 			        </button>
			    </form>
			</div><!-- ostk-section-inner -->
		</section>

	</div><!-- ostk-plugin-settings-->



	<?php
	echo ob_get_clean();
}//ostk_home_page
?>