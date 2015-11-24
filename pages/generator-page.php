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
			<form class="ostk-embed-builder">
				<div class="row">
					<div class="col-sm-6 col-md-4">
						<h1>Generator</h1>
						<p>Please select an embed type</p>
						<select class="ostk-type" onSelect="selectType()"></select>
						<div class="ostk-form-content"></div>
					</div><!-- col -->
					<div class="col-sm-6 col-md-8">
						<div class="embed-output">
							<h3 class="center">Short Code</h3>
							<code class="embed-code"></code>

							<h3 class="center">Example</h3>
							<div class="embed-sandbox"></div>
						</div>
					</div><!-- col -->
				</div>
			</form>
			<div class="clearfix"></div>
		</section>
	</div><!-- ostk-plugin-settings -->
	<?php
	echo ob_get_clean();
}//ostk_generator_page
?>