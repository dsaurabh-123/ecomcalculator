/**
 * @name : Ecom Calculator
 * @author : ecomcalculator.com
 * @Description : Containing global functions
 */


//using strict
"use strict";

const GST = 18;
const amazonJsonPath = "assets/components/amazon/data/";

//global data variables
var gD = {};//empty object for global data
//caching variables
var gV = {};
// Global class
var gC = {};


$(document).ready(function() {
	//getGuideScreenData();
	initializeThingsAtOnready();

});

// download data from remote json file starts here

function getJsonData(filename, selector){
	// try{
		$.getJSON(filename, function(result){
			$(selector).html("");
		    $.each(result.results, function(i, field){
		        $(selector).append($("<option></option>")
		                 .attr("value",result.results[i].id)
		                 .text(result.results[i].text));
		    });
		    $(selector).select2({
		        closeOnSelect: false
		    });
		    $(selector).select2("open");
		});	
	// }
	// catch(err){
	// 	//empty
	// }

}
// download data from remote json file ends here

//This function will get fix closing fees from json file starts here
function getJsonDataFxClosing(filename, selector){
	$.getJSON(filename, function(result){
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


//This function is useds for variable empty & undefined check
function stringEmptyChecker(string){
	if(string == "" || typeof string === "undefined" ||  string == null){
		return false;
	}else{
		return true;
	}
}


//This function is used to calculate Tax ammount
function calculateTax(parameter) {
	var taxAmount;

    //basic empty and null check
    if(stringEmptyChecker(parameter)){
        //if variable is not empty then convert it to numberic if it is in string
        parameter = parseInt(parameter);
    }else{
        //else stop function execution here
        return;
    }

    //formula for gst calculatin standard value is 18%
    //GST is global vaiable set in custom js
    taxAmount = (parameter / 100) * GST;

    //will fix value to only 2 digits after point
    taxAmount = parseFloat(taxAmount.toFixed(2));

    console.log("tax amount is :" + taxAmount);

    return taxAmount;
}



/**
@Date:  17/12/2018
@Dev: Vaibhav
@Name : outputMsgScroll
@Description : used for scrolling to current message in output/guide screen
@Param parentElement : contain parent element eg.wheel of message ul
@Param scrollToElement : element where page to scroll
@Param animationTime : animation time eg 2 seconds (2000)
@Eg.
    $(".wheel").animate({
        scrollTop: $(".sellingPrice_dd").offset().top
    }, 2000);
**/
function outputMsgScroll($parentElement, $scrollToElement, animationTime){
	event.stopPropagation();
	console.log("---------------");
	console.log("parent" +$parentElement);
	console.log("scroll" +$scrollToElement)
	console.log($($scrollToElement).offset().top)
	console.log("---------------");

    $parentElement.animate({
        scrollTop: $scrollToElement.offset().top - $parentElement.offset().top + $parentElement.scrollTop() - 43
    });

}



/**
@Date: 17/12/2018
@Dev: Vaibhav
@name : getOutputScreenData
@description : this will get Guide screen data from json file depend on 
1. ecommerce type eg. amazon by getting value by body id
2. then get actulat data from file using shipping type eg. fba, easy ship or none
3. and put in output list
**/
function getGuideScreenData(){
	// debugger;
	var ecommerceType = $('.calculator').attr('id');
	var $selector =  $(".selectContainer");

	if(ecommerceType){

		var shippingType = $("input[name='shippingType']:checked").val();
		if(!shippingType){
			var shippingType = "none";
		}

		var filename  = "assets/components/" + ecommerceType.trim() + "/data/data-guide.json";
		$.getJSON(filename, function(result){
			if(result){
				$selector.html("");
			    for(var z in result.results){
			    	for(var x in result.results[z].type){
			    		if(result.results[z].type[x] == shippingType){
			    			for(var y in result.results[z].data){
				    			$selector.append($('<li></li>')
				    			         .attr("id", result.results[z].data[y].selector + "_dd")
				    			         .text(result.results[z].data[y].message));

			    			}
				    		$selector.append('<li id="last_dd"></li>').prepend('<li id="first_dd"></li>');
			    		}
			    	}
		
			    };
			}
		});
	}

}
