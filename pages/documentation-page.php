<?php
function ostk_documentation_page() {
    global $OverstockPlugin;
    global $patterns;
	ob_start(); 
	?>
	<div class="ostk-plugin-settings">
        <?php echo $OverstockPlugin->get_header();?>
        <section class="ostk-doc-page">
            <div class="ostk-section-inner">
    			<h1>Documentation</h1>
    			<?php 
    			$pattern_counter = 1;
    			foreach($patterns as $pattern){
                    $current_pattern = false;
                    $url = '?page=ostk-documentation';
                    if($pattern['slug'] == $_GET['pattern']){
                        $current_pattern = true;                
                    }else{
                        $url .= '&pattern='.$pattern['slug'];
                    }
                    echo '<div class="section-title">';
                        echo '<a href="'.$url.'">';
                            echo '<h2>'.$pattern_counter.') '.$pattern['name'].'</h2>';
                        echo '</a>';
                        if($current_pattern){
                            echo '<h3>'.$pattern['description'].' This shortcode type is "'.$pattern['slug'].'."</h3>';
                            if(isset($pattern['notes'])){
                                foreach($pattern['notes'] as $pattern_note){
                                    echo '<p>'.$pattern_note.'</p>';
                                }//foreach
                            }
                        }
                    echo '</div><!-- section-title -->';
                    if($current_pattern){
                        $shortcodes = ostk_getShortCode($pattern['example_shortcodes']);
                        foreach($shortcodes as $shortcode){
                            echo '<h3 class="center">'.$pattern['name'].' Sample Shortcode</h3>';
                            echo '<code>'.$shortcode.'</code>';
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
	$output;
	foreach($att_array as $att){
		$output .= '<li>';
			$output .= '<p class="title">'.$att['name'].'</p>';
            $output .= '<p> '.$att['description'].'</p>';
            if(isset($att['notes'])){
                foreach($att['notes'] as $att_note){
                    $output .= '<p class="note">Note: '.$att_note.'</p>';
                }//foreach
            }
            if(isset($att['default'])){
				$output .= '<p><span class="atts-subtitle">Default:</span> '.$att['default'].'</p>';
			}
			if(isset($att['example'])){
				$output .= '<p><span class="atts-subtitle">Example:</span> "'.$att['example'].'"</p>';
			}
            if(isset($att['options'])){
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
		$output .= '</li>';
	}//foreach
	return $output;
}//ostk_get_pattern_attributes
?>