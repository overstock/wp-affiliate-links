<?php
function ostk_generator_page() {
	global $OverstockPlugin;
	ob_start(); 
	if (isset($_POST['submit'])) {
		$shortcode = stripslashes($_POST['shortcode']);
	};
	?>
	<div class="ostk-plugin-settings">
		<?php echo $OverstockPlugin->get_header();?>
		<section class="ostk-generator-page">
			<div class="row">
				<div class="col-md-6">
					<h1>Generator</h1>
					<p>Please select an embed type</p>
					<form class="ostk-embed-builder">
						<select class="ostk-type" onSelect="selectType()"></select>
						<div class="ostk-form-content"></div>
					</form>
				</div><!-- col -->
				<div class="col-md-6">
					<div class="embed-output">
						<h3 class="center">Short Code</h3>
						<div class="output-shortcode">
							<textarea class="code ostk-copy-to-clipboard-text"></textarea>
							<button class="ostk-btn ostk-copy-to-clipboard-btn">Copy</button>
						</div>

						<h3 class="center">Example</h3>
						<div class="embed-sandbox"></div>
					</div>
				</div><!-- col -->
			</div>
			<div class="clearfix"></div>
		</section>
	</div><!-- ostk-plugin-settings -->
	<?php
	echo ob_get_clean();
}//ostk_generator_page
?>