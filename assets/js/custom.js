//global data variables
var gD = {};//empty object for global data
//caching variables
var gV = {};
// Global class
var gC = {};

$(document).ready(function() {
	
	initializeThingsAtOnready();

});

// download data from remote json file starts here
function getJsonData(filename, selector){
	$.getJSON("/assets/data/"+filename, function(result){
		$(selector).html("");
	    $.each(result.results, function(i, field){
	        $(selector).append($("<option></option>")
	                 .attr("value",result.results[i].id)
	                 .text(result.results[i].text));
	    });
	});	
}
// download data from remote json file ends here

//This function will get fix closing fees from json file starts here
function getJsonDataFxClosing(filename, selector){
	$.getJSON("/assets/data/"+filename, function(result){
		$(selector + " table").html("");
	    $.each(result.results, function(i, field){
	    	debugger;
	        $(selector + " table").append("<tr><td>"+field.value+"</td><td>"+field.text+"</td></tr>")	        	
	    });
	});	
}
//This function will get fix closing fees from json file ends here

//this function will initialize things at onready event
function initializeThingsAtOnready(){
	// getJsonData("amazon-referal-fees.json", "#referalFees");
	// getJsonDataFxClosing("fix-closing.json", ".fixclosingFee");
	gV.menu = $("#menu");
	gV.menuTrigger = $("#menu_trigger");
	gC.menuOpen = "fa fa-bars";
	gC.menuClose = "fa fa-times";
	gC.entranceAnimation = "bounceInDown";//for entrance 
	gC.exitAnimation = "bounceOutUp";//for exit  
	gC.hidden = "d-none";
}

// for menu entrance and exit
$(document).on("click", "#menu_trigger", function(){
	menuToggler();
});

// when click onn refereal fees button open
$(document).on("click", "#referalFeesBtn", function(){
	getJsonData("amazon-referal-fees.json", "#referalFees");
	$('#referalFees').select2();
	modalDropdownShow();
	$('.fixclosingFee').hide();
	$('.referelfeesDropdown').show();
});

$(document).on("change", "#referralFees", referalPercentToPrice)

function referalPercentToPrice(){
	var referalPercentage = $("#referralFees").val();
	var sellingPrice = $("#sellingPrice").val();
	var output = sellingPrice / referalPercentage;
	$("#referralFeesAmout").val(output.toFixed(2));
}

//when click on referelfees button
$(document).on("change", "#referalFees", function(){
	modalDropdownHide();
	$("#referralFees").val(parseFloat($("#referalFees").val()));
	referalPercentToPrice();
});

//when click on referelfees button
$(document).on("click", "#close_dropdown", function(){
	modalDropdownHide();
	$(this).hide();
});

function modalDropdownShow(){
	$('.modalDropdown, #close_dropdown').show();
	$('.modalDropdown').addClass(gC.entranceAnimation);
}

function modalDropdownHide(){
	$('.modalDropdown, #close_dropdown').hide();
	$('.modalDropdown').removeClass(gC.entranceAnimation)
						.addClass(gC.exitAnimation);
}

function modalDropdownHide(){
	$('.modalDropdown').removeClass(gC.entranceAnimation);
	$('.modalDropdown').hide();
}

function menuToggler(){
	if(gV.menu.hasClass(gC.hidden)){
		gV.menu.removeClass(gC.hidden);
		gV.menu.removeClass(gC.exitAnimation);
		gV.menu.addClass(gC.entranceAnimation);
		gV.menuTrigger.removeClass(gC.menuOpen);
		gV.menuTrigger.addClass(gC.menuClose);
	}else{
		gV.menu.addClass(gC.hidden);
		gV.menu.removeClass(gC.entranceAnimation);
		gV.menu.addClass(gC.exitAnimation);
		gV.menuTrigger.removeClass(gC.menuClose);
		gV.menuTrigger.addClass(gC.menuOpen);
	}
}

function convertToInt(value) {
	return parseFloat(value);
}