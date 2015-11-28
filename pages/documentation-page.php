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
                <div class="row">
                    <div class="col-md-6">
                        <h1>Documentation</h1>
                        <p>Please select an embed type</p>
                        <select class="ostk-type" onSelect="selectType()"></select>
                        <div class="ostk-form-content"></div>
                    </div><!-- col -->
                    <div class="col-md-6">
                        <h1>Example Code</h1>
                    </div><!-- col -->
                </div>
            </form>
            <div class="clearfix"></div>
        </section>
    </div><!-- ostk-plugin-settings -->
    <?php
    echo ob_get_clean();
}//ostk_documentation_page
?>