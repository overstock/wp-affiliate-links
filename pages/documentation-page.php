<?php
/*
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
*/
?>
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
        <section class="ostk-doc-page">
            <div class="ostk-section-inner">
                <h1>Documentation</h1>
                <?php 
                $pattern_counter = 1;
                foreach($ostk_patterns as $pattern){
                    $is_current_pattern = false;
                    $url = '?page=ostk-documentation';
                    if($pattern['slug'] == $_GET['pattern']){
                        $is_current_pattern = true;                
                        $current_pattern = $pattern;
                    }else{
                        $url .= '&pattern='.$pattern['slug'];
                    }
                    echo '<div class="section-title">';
                        echo '<a href="'.$url.'">';
                            echo '<h2>'.$pattern_counter.') '.$pattern['name'].'</h2>';
                        echo '</a>';
                        if($is_current_pattern){
                            echo '<h3>'.$pattern['description'].' This shortcode type is "'.$pattern['slug'].'."</h3>';
                            echo getStrOrArray($pattern['notes']);
                        }
                    echo '</div><!-- section-title -->';
                    if($is_current_pattern){
                        $shortcodes = ostk_getShortCode($pattern['example_shortcodes']);
                        foreach($shortcodes as $shortcode){
                            echo '<h3 class="center">'.$pattern['name'].' Sample Shortcode</h3>';
                            echo '<textarea class="code">'.$shortcode.'</textarea>';
                            echo '<div class="shortcode-output">';
                                echo do_shortcode($shortcode);
                            echo '</div><!--.shortcode-output-->';
                        }//foreach
                        echo '<div class="atts">';
                            if(isset($pattern['required_attributes'])){
                                echo '<h3>'.$pattern['name'].' Required Attributes</h3>';
                                echo '<ul>';
                                    echo ostk_get_pattern_attributes($pattern['required_attributes']);
                                echo '</ul>';
                            }
                            if(isset($pattern['optional_attributes'])){
                                echo '<h3>'.$pattern['name'].' Optional Attributes</h3>';
                                echo '<ul>';
                                    echo ostk_get_pattern_attributes($pattern['optional_attributes']);
                                echo '</ul>';
                            }
                        echo '</div><!--atts-->';
                    }
                    $pattern_counter++;
                }//foreach          
                ?>

            </div><!-- ostk-section-inner -->
        </section>
    </div><!--.ostk-plugin-settings-->
    <?php
    echo ob_get_clean();
}//ostk_documentation_page

function ostk_getShortCode($example_shortcodes){
    $output_array = array();
    foreach($example_shortcodes as $sc){
        $item = '';
        foreach($sc as $shortcode_key=>$shortcode_value){
            $item .= " ".$shortcode_key.'="'.$shortcode_value.'"';
        }//foreach
        array_push($output_array, "[overstock".$item."]");
    }//foreach
    return $output_array;
}//ostk_getShortCode

function ostk_get_pattern_attributes($att_array){
    $output = '';
    foreach($att_array as $att){
        $output .= getAtt($att);
    }//foreach
    return $output;
}//ostk_get_pattern_attributes


function getAtt($att){
    global $current_pattern;
    $output = '';
    $output .= '<li>';
        $output .= '<p class="title">'.$att['name'].'</p>';

        if($att['name'] == 'type'){
            $output .= '<p>'.$current_pattern['slug'].'</p>';
        }else{
            $output .= '<p> '.$att['description'].'</p>';
        }

        $output .= getStrOrArray($pattern['notes']);

        if(isset($att['default'])){
            $output .= '<p><span class="atts-subtitle">Default:</span> '.$att['default'].'</p>';
        }
        if(isset($att['example'])){
            $output .= '<p><span class="atts-subtitle">Example:</span> "'.$att['example'].'"</p>';
        }
        if(isset($att['options'])){
            if(is_array($att['options'][0])){
                foreach($att['options'] as $att_option){
                    $output .= getAtt($att_option);
                }
            }else{
                $output .= '<p><span class="atts-subtitle">Options:</span><p>';
                $output .= '<ul>';
                $ulOptionsClass = '';
                if(count($att['options']) > 5){
                    $ulOptionsClass = 'options-col-3';
                }else if(count($att['options']) > 3){
                    $ulOptionsClass = 'options-col-2';
                }
                foreach($att['options'] as $att_option){
                    $defaultText = '';
                    if(isset($att['default']) && $att['default'] === $att_option){
                        $defaultText = ' (Default)';
                    }
                    $output .= '<li class='.$ulOptionsClass.'>"'.$att_option.'" '.$defaultText.'</li>';
                }//foreach
                $output .= '</ul>';
            }
        }
    $output .= '</li>';
    return $output;
}//getAtt

function getStrOrArray($obj){
    $str = '';
    if(isset($obj)){
        if(is_array($obj)){
            foreach($obj as $pattern_note){
                $str .= '<p>'.$pattern_note.'</p>';
            }//foreach
        }else{
            $str .= '<p>'.$obj.'</p>';
        }
    }
    return $str;
}//getStrOrArray

?>