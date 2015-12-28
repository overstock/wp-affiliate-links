/* 
==================== Sample Widget ====================

Class: 			ostk_SampleData
Extends: 		ostk_Widget
Description: 	Takes productId returns ProductData object
*/
function ostk_SampleData(){

	// Generate Html
	this.initElement = function(){
		this.obj = new ostk_SingleProductData();
		this.initObject();
	};//initElement

	// Generate Html
	this.generateHtml = function(){
		var output = '';
		output += '<p>The name is <strong>'+this.obj.name()+'</strong></p><br/>';
		output += '<p>The price is <strong>'+this.obj.price+'</strong></p><br/>';
		output += '<p>The rating (as decimal is) <strong>'+this.obj.getAverageReviewAsDecimal()+'</strong></p><br/>';
		output += '<p>The rating (as gif is)... see below</p><br/>';
		output += '<img src= "'+this.obj.getAverageReviewAsGif()+'"/><br/>';
		output += '<p> <strong>Large image:</strong></p><br/>';
		output += '<a href="'+this.obj.affiliateUrl+'"><img src= '+this.obj.imgUrl_large+' /></a><br/>';
		output += '<p> <strong>Medium image:</strong></p><br/>';
		output += '<a href="'+this.obj.affiliateUrl+'"><img src= '+this.obj.imgUrl_medium+' /></a><br/>';
		output += '<p> <strong>Small image:</strong></p><br/>';
		output += '<a href="'+this.obj.affiliateUrl+'"><img src= '+this.obj.imgUrl_thumbnail+' /></a><br/>';
		output += '<p>The url link is <a href="'+this.obj.affiliateUrl+'"><strong>here, click me!</strong></a></p><br/>';
		output += '<p>Also, all photos are clickable.<p><br/>';
		this.renderHTML(output);
	};//generateHtml

}//ostk_SampleData
