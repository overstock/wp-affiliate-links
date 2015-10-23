<?php
function ostk_doc_page() {
    global $patterns;
	ob_start(); 
	?>
	<div class="ostk-plugin-settings">
		<?php echo ostk_get_header('doc');?>
		<div class="ostk-page ostk-doc-page">
			<h1>Documentation</h1>
			<?php 
			$pattern_counter = 1;
			foreach($patterns as $pattern){
                $current_pattern = false;
                $url = '?page=ostk-doc';
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
                    $shortcodes = getShortCode($pattern['example_shortcodes']);
					echo '<div class="atts">';
                            if(isset($pattern['required_attributes'])){
                                echo '<h3>Required Attributes</h3>';
                                    echo '<ul>';
                                        echo get_pattern_attributes($pattern['required_attributes']);
                                echo '</ul>';
                            }
                            if(isset($pattern['optional_attributes'])){
                            echo '<h3>Optional Attributes</h3>';
                                echo '<ul>';
    								echo get_pattern_attributes($pattern['optional_attributes']);
                                echo '</ul>';
                            }
					echo '</div><!--atts-->';
					foreach($shortcodes as $shortcode){
						echo '<h3 class="center">Sample Code</h3>';
						echo '<code>'.$shortcode.'</code>';
						echo '<div class="shortcode-output">';
							echo do_shortcode($shortcode);
						echo '</div><!--.shortcode-output-->';
					}//foreach
				}
				$pattern_counter++;
			}//foreach			
			?>

		</div><!-- ostk-doc-page -->
	</div><!--.ostk-plugin-settings-->
	<?php
	echo ob_get_clean();
}//ostk_doc_page

function getShortCode($example_shortcodes){
	$output_array = array();
	foreach($example_shortcodes as $sc){
		$item = '';
		foreach($sc as $shortcode_key=>$shortcode_value){
			$item .= " ".$shortcode_key.'="'.$shortcode_value.'"';
		}//foreach
		array_push($output_array, "[overstock".$item."]");
	}//foreach
	return $output_array;
}//getShortCode

function get_pattern_attributes($att_array){
	$output;
	foreach($att_array as $att){
		$output .= '<li>';
			$output .= '<p class="title">'.$att['name'].'</p>';
            $output .= '<p> '.$att['description'].'</p>';
            if(isset($att['description'])){
            }
            if(isset($att['default'])){
				$output .= '<p><span class="atts-subtitle">Default:</span> '.$att['default'].'</p>';
			}
			if(isset($att['example'])){
				$output .= '<p><span class="atts-subtitle">Example:</span> "'.$att['example'].'"</p>';
			}
            if(isset($att['options'])){
                $output .= '<p><span class="atts-subtitle">Options:</span> ';
                $i = 0;
                foreach($att['options'] as $att_option){
                    if($i > 0){
                        $output .= ', ';
                    }
                    $output .= '"'.$att_option.'"';
                    if(isset($att['default']) && $att['default'] === $att_option){
                        $output .= ' (Default)';
                    }
                    $i++;
                }//foreach
                $output .= '</p>';
            }
            if(isset($att['notes'])){
                foreach($att['notes'] as $att_note){
                    $output .= '<p class="note">Note: '.$att_note.'</p>';
                }//foreach
            }
		$output .= '</li>';
	}//foreach
	return $output;
}//get_pattern_attributes
?>