<!DOCTYPE html>
<html>
<head>
	<title>Ovestock Doc</title>
</head>
<body>
	<header>
		<h1>Ovestock Doc</h1>
	</header>

	<div class="content">

<!--
		<h2>1) Search</h2>
		<div data-tag="overstock" data-type="search" data-query="soccer shoes"></div>

		<h2>2) Link</h2>
		<div data-tag="overstock" data-type="link" data-url="http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"></div>

-->
		<h2>3) Rectangle</h2>
		<div data-tag="overstock" data-type="rectangle" data-id="9747008" data-width="300px"></div>
<!--

		<h2>4) Leaderboard</h2>
		<div data-tag="overstock" data-type="leaderboard" data-product_ids="8641092"></div>

		<h2>5) Skyscraper</h2>
		<div data-tag="overstock" data-type="skyscraper" data-product_ids="8641092,9547029" data-width="160px"></div>


		<h2>6) Carousel</h2>
		<div data-tag="overstock" data-type="carousel" data-product_ids="9659704,6753542,5718385,5735179" data-width="400px"></div>

		<h2>7) Stock Photo</h2>
		<div data-tag="overstock" data-type="stock_photo" data-id="8859234" data-width="300px"></div>

		<h2>8) Product Details Link</h2>
		<div data-tag="overstock" data-type="product_link" data-display="name" data-id="8859234"></div>

		<h2>9) Product Carousel</h2>
		<div data-tag="overstock" data-type="product_carousel" data-id="9659704" data-width="400px"></div>
-->

	</div><!--content-->

	<footer>
<!--
		<script type="text/javascript" src="http://localhost/~thoki/ostk-api/js/overstock-embed.js"></script>

		<script type="text/javascript" src="http://localhost/~thoki/wordpress/wp-content/plugins/wp-affiliate-links/ostk-api/js/overstock-embed.js"></script>
-->
		<?php 
		$plugin_root = $_SERVER['REQUEST_URI'];
		$plugin_root = explode("/", $plugin_root);
		$plugin_root = array_slice($plugin_root, 0, count($plugin_root)-2);
		$plugin_root = implode("/", $plugin_root);
		?>
		<script type="text/javascript" src="<?php echo $plugin_root;?>/ostk-api/js/api/functions.js"></script>
		<script type="text/javascript" src="<?php echo $plugin_root;?>/ostk-api/js/overstock-embed.js"></script>
	</footer>

</body>
</html>

