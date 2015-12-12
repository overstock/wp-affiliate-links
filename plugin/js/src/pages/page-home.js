/* Click Step Button
-----------------------------------------------------*/
var ostk_step_counter = 0;
var ostk_steps_array = Array('step1');

function ostk_showStep(section_name){
	ostk_step_counter++;
	ostk_steps_array[ostk_step_counter] = section_name;
	goToStep(section_name, ostk_step_counter);
}//ostk_showStep

function ostk_backStep(){
	ostk_step_counter--;
	var section_name = ostk_steps_array[ostk_step_counter];	
	goToStep(section_name, ostk_step_counter);
}//ostk_backStep

function goToStep(section_name, ostk_step_counter){
	$ostk_jQuery('section.step').hide();
	$ostk_jQuery('section.'+section_name).show();
	$ostk_jQuery('section.'+section_name+' h2').html('Step ' + (ostk_step_counter+1));
}//goToStep