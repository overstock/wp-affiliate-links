<?php
function ostk_documentation_page() {
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
                <p>Please select an embed type</p>
                <select class="ostk-type" onSelect="selectType()"></select>

                <h1>Example</h1>
                <div class="ostk-example-code"></div>

                <h1>Documentation</h1>
                <div class="ostk-form-content"></div>
            </form>
            <div class="clearfix"></div>
        </section>
    </div><!-- ostk-plugin-settings -->
    <?php
    echo ob_get_clean();
}//ostk_documentation_page
?>