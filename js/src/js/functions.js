function createText(text, tag){
	if(tag == null){
		tag = 'p';
	}
	return $ostk_jQuery("<"+tag+">")
		.text(text);
}//createH2

function createOption(text, value){
	if(value == null){
		value == text;
	}
	return $ostk_jQuery("<option />", {value: value, text: text});
}//createOption