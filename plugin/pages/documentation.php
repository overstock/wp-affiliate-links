<?php
$current_pattern;

function ostk_documentation_page() {
    global $OverstockPlugin;
    global $ostk_patterns;
    global $current_pattern;
    ob_start(); 
    ?>
    <div class="ostk-plugin-settings">
        <?php echo $OverstockPlugin->get_header();?>
        <section class="ostk-generator-page">
            <div class="ostk-section-inner">

                <h1>Documentation</h1>
                <p>Please select an embed type</p>
                <div class="documentation-holder"></div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="ostk-embed-builder">
                            <div class="ostk-doc-content"></div>
                        </div>
                    </div><!-- col -->
                </div><!-- row -->

            </div><!-- ostk-section-inner -->
        </section>
    </div><!--.ostk-plugin-settings-->
    <?php
    echo ob_get_clean();
}//ostk_documentation_page

?>