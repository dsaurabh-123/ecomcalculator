/**
 * @name : Ecom Calculator
 * @author : Saurabh Dubey and Vaibhav More
 * @Description : Amazon module  
 */

// controller for amazon page
app.controller("amazonController", function($scope, $http) {
    //currently this section is empty
    //will move some functionality in angular
    //as project get completed on base js/jquery
});


$(document).ready(function() {

    //DECLARING flobal variables 
    var abc = 20,
        fbashippingValue = 0,
        easyshipShippingValue = 0,
        fbxFixclosingValue = 0,
        // amazonJsonPath = "assets/data/amazon/",
        easyshipFixClosingValue = 0;

});

//This function will trigger when window is completly loaded
window.onload = function(e) {
    getGuideScreenData();
    console.log("window loaded");
   // xyz();
    fbashipping();
    easyshipShipping();
    fbxFixclosing();
    easyshipFixClosing();

};

//calling all jason values here so that we can use it later..........................................................

function fbashipping() {
    $.get(amazonJsonPath + "fba-shipping.json", function(response, status) {
        // console.log(response);
        fbashippingValue = response;
        // console.log(a);

    });
}

function easyshipShipping() {
    $.get(amazonJsonPath + "easyShip-shipping.json", function(response, status) {
        // console.log(response);
        abc = response;
    });
}

function fbxFixclosing() {
    $.get(amazonJsonPath + "fba-fixClosing.json", function(response, status) {
        // console.log(response);
        fbxFixclosingValue = response;
        // console.log(a);
    });
}

function easyshipFixClosing() {

    $.get(amazonJsonPath + "easyShip-fixClosing.json", function(response, status) {
        // console.log(response);
        easyshipFixClosingValue = response;
        // console.log(a);
    });
}


// to set up new selling price call jason data here only same as easyshipShipping but this is working 

// function xyz() {
//     $.get(amazonJsonPath + "easyShip-shipping.json", function(response, status) {
//         abc = response;
//     });
// }
//Adding all event listener here...............................................

$(document).on("click", "#profiBtn", calculateProfit);

$(document).on("click", "#getProfit", newProfit);

$(document).on("change", ".dimen", VolumetricCalculation);

//this is done so that on change of SP both RF and Tax will be calculated
$(document).on("change", "#sellingPrice", sellingPriceHandler);

$(document).on("change", "input[type=radio], .customCheckbox", Shipping_Charges);

//when user click on FBA.........................................................
$(document).on("change", "input[type=radio], .shippingType", Shipping_Type);

//when user click on pick and pack ....................................
$(document).on("change", "#sellingPrice", PicknPack);

$(document).on("change", "#sellingPrice1", desir_profit);

$(document).on("change", "#total_profit2", newSellingPrice);

//when click onn fixclosing button open
$(document).on("click", "#fixClosingBtn", fixClosingBtnHandler);

// when click onn refereal fees button got clicked open
$(document).on("click", "#referalFeesBtn", referalFeesBtnHandler);

//This event trigger when user manually change reference fees in input box
$(document).on("change", "#referralFees", referalPercentToPrice)

//THis event trigger when dropdown on modal get selected 
$(document).on("change", "#referalFees", referalFeesHandler);

//when actual volumetric is changed 
$(document).on("change", "#actualVolume", Shipping_Charges);

//when user enters any input it should be checked whether the same value is present for others to 
//$(document).on("keyup", "#referralFees", checkCategory);

function referalFeesHandler() {

    $("#referalFees").select2("close");
    modalDropdownHide();
    //defining variable
    var productCategory, indexOfHyphen;

    $("#referralFees").val(parseFloat($("#referalFees").val()));

    //this code block will convert 
    //Eg. "   Consumables Pet Food (Dog Food)-14.00% "
    //to "consumables pet food (dog food)"
    //will remove content after last hyphen beacuase need 
    //only name of product category
    productCategory = $("#referalFees option:selected").text();
    indexOfHyphen = productCategory.lastIndexOf("-");
    productCategory = productCategory.slice(0, indexOfHyphen);
    productCategory = $.trim(productCategory.toLowerCase());

    //setting Product category to localstorage for fix closing and other calculation
    localStorage.setItem("productCategory", productCategory);

    // This function will set refreal fees
    // referalPercentToPrice();
    referalPercentToPrice();
}

function referalPercentToPrice() {
    //defining variables
    var referalPercentage, sellingPrice, output;

    //getting value and make sure both values in float data type
    //and make 2 digits after point for standard output
    referalPercentage = $("#referralFees").val();
    referalPercentage = parseFloat(referalPercentage).toFixed(2);
    referalPercentage = parseFloat(referalPercentage);

    sellingPrice = $("#sellingPrice").val();
    if (stringEmptyChecker(sellingPrice)) {
        sellingPrice = parseFloat(sellingPrice).toFixed(2);
        sellingPrice = parseFloat(sellingPrice);

        //calculation
        // output = sellingPrice / referalPercentage;
        referalAmount = ((referalPercentage / 100) * sellingPrice);

        //setter
        $("#referralFeesAmout").val(referalAmount.toFixed(2));
    }

    calculatetax();

    calculateProfit();

    //when user enters any input it should be checked whether the same value is present for others to 

      $( "#referralFees" ).on( "keyup", function(event) {
      if(event.which == 13) 
          checkCategory();
    });


    //checkCategory(); 


    function checkCategory() {
        //console.log(referalPercentage);
        
        console.log(referalPercentage);
        $.get(amazonJsonPath + "referal-fees.json", function(response, status) {
            //console.log(response);
            var len = response.results.length;
            var listarray = [];
            for (var i = 0; i < len; i++) {
                if (referalPercentage == response.results[i].id) {
                    $("#rfDropdownModal").modal("show");
                    listarray.push(response.results[i].text);
                    console.log(response.results[i].text);
                }
            }

            console.log(listarray);

            for (var i = 0; i < listarray.length; i++) {
                rfDropdown.innerHTML += '<li class="dropdown-item" data-dismiss="modal" class="dropdown_options_modified">' + listarray[i] + '</li>'
            }
            ;

        });
    }

}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : this part claculates the tax i.e 18% of amazon's fee....  
 */

function calculatetax() {
    console.log('Calculation of amazon ka tax');
    //var picknPackAmount=0;
    var referalfee = $("#referralFeesAmout").val();
    var FixclosingAmount = $("#fixClosingAmount").val();
    var picknPackAmount = $("#picknPack").val();
    var tax = 0;
    console.log(picknPackAmount);

    var valueRange = $("input[name='shippingRange']:checked").val();
    var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    console.log(radioValueshippingtype);
    //console.log(valueRange);

    if (radioValueshippingtype == "easyShip" || radioValueshippingtype == "selfShip") {
        var picknPackAmount = 0;
        console.log(picknPackAmount);
    }

    var total = parseInt(referalfee) + parseInt(FixclosingAmount) + parseInt(picknPackAmount);
    console.log(total);
    tax = ((18 / 100) * total);
    console.log(tax);

    $("#total_tax").val(tax.toFixed(2));

}


/**
@Date: 28/01/2019
@Dev: Vaibhav
@name : referalFeesBtnHandler
@description : this will open refereal fee modal
1. Get data for referal fees and put into #referalFees dropdown
2. initialize select2 for dropdown
3. show modal
**/
function referalFeesBtnHandler() {
    getJsonData(amazonJsonPath + "referal-fees.json", "#referalFees");
    $('.fixclosingFee').hide();
    $('.referelfeesDropdown').show();
    modalDropdownShow();
}

function fixClosingBtnHandler() {

    var ecomName = $(".calculator").attr("id");
    var shippingType = $("input[name='shippingType']:checked").val();
    var filename = ecomName + "-" + shippingType + "-fixClosing.json"
    var selector = ".fixclosingFee";

    $.getJSON(amazonJsonPath + filename, function(result) {

        var a = result.results;
        var b = result.selectedCategories;

        $(selector + " table").html("");

        if (a[0].length == 3) {
            var colspan = 3;
            $(selector + " table").append("<th>From</th><th>To</th><th>Price</th>");
        } else {
            var colspan = 4;
            $(selector + " table").append("<th>From</th><th>To</th><th>Selected Category</th><th>Other Category</th></th>")
        }

        for (i = 0; i < a.length; i++) {
            if (a[i].length == 3) {
                $(selector + " table").append("<tr><td>" + a[i].from + "</td><td>" + a[i].to + "</td><td>" + a[i].price + "</td></tr>")
            } else {
                $(selector + " table").append("<tr><td>" + a[i].from + "</td><td>" + a[i].to + "</td><td>" + a[i].selectedCategory + "</td><td>" + a[i].otherCategory + "</td></tr>")
            }
        }

        //debugger;
        $(selector + " table").append("<tr><th colspan=" + colspan + ">Selected Categories</th></tr>")
        for (j = 0; j < b.length; j++) {
            $(selector + " table").append("<tr><td colspan=" + colspan + ">" + b[j] + "</td></tr>")
        }
        $(selector).css({
            "overflow-y": "scroll",
            "overflow-x": "hidden",
            "height": "100%"
        });
    });

    modalDropdownShow();
    $('.referelfeesDropdown').hide();
    $('.fixclosingFee').show();
}

function sellingPriceHandler() {
    var rfLength = $("#referralFees").val();

    console.log("sellingPriceHandler function");
    fixClosing();
    PicknPack();

    if (rfLength.length > 0) {
        referalPercentToPrice();

    }

   // document.getElementById("guide").innerHTML = "Choose Shipping Type";

}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : this part claculates the profit based on users input   
 */

function calculateProfit() {
    // var shippingCharges= $("#shippingCharges").val();
    var buyingPrice = $("#buyingPrice").val();
    var sellingPrice = $("#sellingPrice").val();
    var shippingCharges = $("#shippingCharges").val();
    var referalCharges = $("#referralFeesAmout").val();
    var fixclosingCharges = $("#fixClosingAmount").val();
    var picknpack = $("#picknPack").val();
    var tax = $("#total_tax").val();
    var profit = 0;
    var amazon_fee = 0;
    var total_deductions = 0;

    //check which shipping type is selected
    var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    console.log(radioValueshippingtype);
    if (radioValueshippingtype == 'fba') {
        $(".pickpack").css("display", "block");
    } else {
        $(".pickpack").css("display", "none");
        var picknpack = 0;
    }

    // ends here

    //debugger;
    var profit = sellingPrice - buyingPrice - shippingCharges - referalCharges - fixclosingCharges - tax - picknpack;
    var amazon_fee = parseInt(referalCharges) + parseInt(fixclosingCharges) + parseInt(picknpack) + parseInt(tax);
    var total_deductions = parseInt(amazon_fee) + parseInt(buyingPrice) + parseInt(shippingCharges);

    // debugger;
    if (profit < 0) {
        $("#profiBtn, #total_profit").css("background", "#db3951");
        $(".profit_class").css("background", "#db3951");

    } else {
        $("#profiBtn, #total_profit").css("background", "#53d397");
    }

    $("#total_profit").val(profit.toFixed(2));

    $("#total_profit1").val(profit.toFixed(2));
    $("#total_profit2").val(profit.toFixed(2));

    $("#sellingPrice1").val(sellingPrice);
    $("#buyingPrice1").val('-' + buyingPrice);
    $("#shippingCharges1").val('-' + shippingCharges);
    $("#fixclosingCharges1").val('-' + fixclosingCharges);
    $("#referalCharges1").val('-' + referalCharges);
    $("#picknpack_charge").val('-' + picknpack);
    $("#gst").val('-' + tax);
    // debugger;
    $("#amazon_feees1").val('-' + amazon_fee);
    $("#total_deductions1").val('-' + total_deductions);

    $("#profit_loss_desc").css("display", "block");

    // console.log(amazon_fee);
    // console.log(total_deductions);

}



/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will calculate volumetric weight calculation
 */

function VolumetricCalculation() {
    var totalVolume, length, breadth, height;

    length = $("#length").val();
    breadth = $("#breadth").val();
    height = $("#height").val();

    if (stringEmptyChecker(length) == true && stringEmptyChecker(breadth) == true && stringEmptyChecker(height) == true) {

        length = parseFloat(length).toFixed(2);
        length = parseFloat(length);

        breadth = parseFloat(breadth).toFixed(2);
        breadth = parseFloat(breadth);

        height = parseFloat(height).toFixed(2);
        height = parseFloat(height);

        totalVolume = (length * breadth * height) / 5000;

        var volume = totalVolume * 1000;

        $("#volumetricPrice").val(volume.toFixed(2));
    }

    Shipping_Charges();
}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will calculate fix closing as soon as user changes the shipping charge
   Dependency-Shipping charge 
 */

function fixClosing() {

    //defining variables
    var currentSelectedCategory, radioValueshippingtype, selectedCategoryFlag = false, selectedCategory, otherCategory, productCategory, sellingPrice, from, to, a, x;

    //getting value of shippingType radio button eg.fba or easy ship   
    radioValueshippingtype = $("input[name='shippingType']:checked").val();
    sellingPrice = parseFloat($("#sellingPrice").val());

    console.log("shipping Type : " + radioValueshippingtype);

    if (radioValueshippingtype == 'easyShip' || radioValueshippingtype == 'selfShip') {
        // debugger;

        $.get(amazonJsonPath + "easyShip-fixClosing.json", function(response, status) {
            // console.log(response);
            a = response.results;
            // console.log(a);
            for (i = 0; i < a.length; i++) {

                if (sellingPrice >= a[i].from && sellingPrice <= a[i].to) {
                    // console.log('hyy');
                    $('#fixClosingAmount').val(a[i].price);
                    console.log("fix_clogin : " + a[i].price);
                    // return x;
                    break;
                }

            }

        });

    }
    else {

        // debugger;
        //referalFeesBtnHandler();

        $.getJSON(amazonJsonPath + "fba-fixClosing.json", function(result) {
           //  debugger;
            // console.log(result);
            a = result.results;

            //loop on retrived data for local processing
            for (i = 0; i < a.length; i++) {

                //in some cases "to" limit is eg. 1000 and above 
                //means onward 1000rs fix closing will remain same
                //hence in this situation we make to value more than selling price
                //to bypass if logic written few lines below.
                if (a[i].to === "above") {
                    to = sellingPrice + 1;
                } else {
                    to = a[i].to;
                }

                from = a[i].from;
                otherCategory = a[i].otherCategory;
                selectedCategory = a[i].selectedCategory;

                //if sellingPrice is between from and two then set fix closing value 
                //accordingly 
                if (sellingPrice >= from && sellingPrice <= to) {

                    //get current product category
                    productCategory = localStorage.getItem("productCategory");

                    // debugger;

                    //check this product is under selected cateogry or other category
                    if (stringEmptyChecker(productCategory)) {
                        for (currentSelectedCategory in result.selectedCategories) {
                            //if prduct category is match with any selected category 
                            //then set fixClosingAmoutn of selected category 
                            //otherwise set to other category amount
                            if ($.trim(result.selectedCategories[currentSelectedCategory].toLowerCase()) == productCategory) {
                                $('#fixClosingAmount').val(selectedCategory);
                                console.log('selectedCategory : ' + selectedCategory);
                                //if current product is under selcted category then
                                //make this below flag true otherwise default is false 
                                //and exit the loop 
                                selectedCategoryFlag = true;
                                break;
                            }
                        }

                        //if selectedCategoryFlag is false then product is under other category
                        //and set value of fixClosingAmount to other category value or price
                        if (!selectedCategoryFlag) {
                            $('#fixClosingAmount').val(otherCategory);
                            console.log('otherCategory : ' + otherCategory);
                        }

                    } else {
                        //for current just showing alert will develope this letter

                       // console.log('Please select Product Categroy isko dekhna haii')
                        alert("Please select Product Categroy");
                    }

                    //checking whether user product is in selected category
                    //or other category because both having different 
                    //amount of fix closing
                    break;
                }

            }
            //debugger;
        });

    }

}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will calculate shipping charge based on volumetric values like length breadth height
 */

function Shipping_Charges() {
    var sp = '';

    var calcVolume = $("#volumetricPrice").val();
    var actuVolume = $("#actualVolume").val();

    if (calcVolume > actuVolume) {

        console.log(calcVolume);
        console.log(actuVolume);
        sp = calcVolume;
        console.log(sp);
    } else {
        console.log(calcVolume);
        console.log(actuVolume);
        sp = actuVolume;
        console.log(sp);
    }

    var shippingCharges = 0;

    var valueRange = $("input[name='shippingRange']:checked").val();
    var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    console.log(radioValueshippingtype);
    //console.log(valueRange);

    if (radioValueshippingtype == "easyShip" || radioValueshippingtype == "selfShip") {
        // $("#nationalArea").prop("checked", true);

        $.get(amazonJsonPath + "easyShip-shipping.json", function(response, status) {

            fixClosing();

            //fbaFixClosing("amazon-fba-fixClosing.json", "#fixClosingAmount");
            var len = response.results.length;
            console.log(len);
            for (var i = 0; i < len; i++) {
                if (sp >= response.results[i].from && sp <= response.results[i].to) {
                    if (valueRange == "local") {
                        shippingCharges = response.results[i].local;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;
                        $("#shippingCharges").val(shipwithtax);
                        return shipwithtax;
                        break;
                    } else if (valueRange == "regional") {
                        shippingCharges = response.results[i].regional;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;
                        $("#shippingCharges").val(shipwithtax);
                        return shipwithtax;
                        break;
                    } else {
                        shippingCharges = response.results[i].national;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;

                        $("#shippingCharges").val(shipwithtax);
                        $("#nationalArea").prop("checked", true);
                        return shipwithtax;
                        break;
                    }
                }
            }
        });
    }
    else if (radioValueshippingtype == "fba") {
        // $("#nationalArea").prop("checked", true);
        console.log("radioValueshippingtype==fba")
        $.get(amazonJsonPath + "fba-shipping.json", function(response, status) {

            fixClosing();

            //fbaFixClosing("amazon-fba-fixClosing.json", "#fixClosingAmount");
            var len = response.results.length;
            console.log(len);
            for (var i = 0; i < len; i++) {
                if (sp >= response.results[i].from && sp <= response.results[i].to) {
                    if (valueRange == "local") {
                        shippingCharges = response.results[i].local;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;
                        $("#shippingCharges").val(shipwithtax);
                        return shippingCharges;
                        break;
                    } else if (valueRange == "regional") {
                        shippingCharges = response.results[i].regional;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;
                        $("#shippingCharges").val(shipwithtax);
                        return shippingCharges;
                        break;
                    } else if (valueRange == "national"){
                        shippingCharges = response.results[i].national;
                        var shiptax = shippingCharges * (18 / 100);
                        console.log(shippingCharges + shipwithtax);
                        var shipwithtax = shippingCharges + shiptax;
                        $("#shippingCharges").val(shipwithtax);
                       // $("#nationalArea").prop("checked", true);
                        return shippingCharges;
                        break;
                    }
                    else{
                        return 0;
                    }
                }
            }
        });

    }

    // easyshipFixClosing();
}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will display screen as per the shipping type eg- for self shipping package dimension
 shipping weight will not get reflected... 
 */

function Shipping_Type() {
    getGuideScreenData();

    var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    
    console.log(radioValueshippingtype);

    if (radioValueshippingtype == 'fba') {
        $(".fba").css("display", "block");
        $(".self_amaz").css("display", "block");
        document.getElementById('shippingCharges').readOnly = true;
    } else if (radioValueshippingtype == 'easyShip') {
        $(".fba").css("display", "none");
        $(".self_amaz").css("display", "block");
        document.getElementById('shippingCharges').readOnly = true;
    } else {
        $(".fba").css("display", "none");
        $(".self_amaz").css("display", "none");
        document.getElementById('shippingCharges').readOnly = false;
        return 0;
    }
    
    // document.getElementById("guide").innerHTML = "Enter Length";
   // document.getElementById("length").focus();

}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function works only in FBA section to calcualte the pick and pack value 
 */

function PicknPack() {
    console.log("inside pick an pack");
    var pickprice = 0;
    var sp = $("#sellingPrice").val();

    if (sp <= 1000) {
        var pickprice = 10;
        $("#picknPack").val(pickprice);
    } else if (sp >= 1001 && sp <= 4999) {
        var pickprice = 15;
        $("#picknPack").val(pickprice);
    } else if (sp >= 5000 && sp <= 11999) {
        var pickprice = 25;
        $("#picknPack").val(pickprice);
    } else {
        var pickprice = 50;
        $("#picknPack").val(pickprice);
    }
}

/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will focus profit to take new profit.......................................
 */

//defining a var to set the old prift .....
var profit='';

function newProfit() {
    console.log('Input  desired profit value');
    document.getElementById("total_profit2").readOnly = false;
    $("#total_profit2").attr("placeholder", "Enter desired profit");
    document.getElementById("total_profit2").focus();
    document.getElementById("total_profit2").select();
    profit=$("#total_profit2").val();
}


/**
 * @name : Ecom Calculator
 * @author : saurabh dubey
 * @Description : This function will calculate the new selling price based on desired profit from newProfit function
 */

function newSellingPrice(){
   // debugger;
  console.log("inside new selling price");
  var oldProfit=profit;
  var desiredProfit=$("#total_profit2").val();
  var sellingPrice = $("#sellingPrice1").val();
  var shippingPrice=$("#shippingCharges").val();
  var bp = $("#buyingPrice").val();
  var rf = $("#referralFees").val();
  var expectedit=calculateNewSelling(oldProfit,desiredProfit,shippingPrice,bp,rf,sellingPrice);
  //calculatedesiredprofit(oldProfit,desiredProfit);
  console.log('Ols profit is '+oldProfit);
  console.log('desired profit is '+desiredProfit);
  console.log(sellingPrice);
  console.log(shippingPrice);
  console.log(expectedit);

  function calculatedesiredprofit(oldProfit,desiredProfit){
    var start=parseInt(oldProfit);
    var limit=parseInt(desiredProfit);
    debugger;
      for(var i = start;i<=limit; i++){
        debugger;
    calculateNewSelling(oldProfit,desiredProfit,shippingPrice,bp,rf,sellingPrice);

    debugger;
    if(i==limit){
        debugger;
        console.log('got it');
    }

    else{
        console.log("Nooo");
    }  
}



  function calculateNewSelling(oldProfit,desiredProfit,shippingPrice,bp,rf,sellingPrice){
    var sellingPrice=++sellingPrice;
    var ref= parseInt(rf); 
    var picknpack= newPicknpack(sellingPrice);
    var rf=newRF(sellingPrice,ref);
    var fixclosing=newFixclosing(sellingPrice);
    var tax=newtax(picknpack,rf,fixclosing);
    var amazonFee=newamazonfee(picknpack,rf,fixclosing,tax);
    var totaldeduction = newtotaldeduction(shippingPrice,amazonFee,bp);
    var profit= newprofit(sellingPrice,totaldeduction);
    
    console.log('New selling price is '+sellingPrice); 
    console.log('referal amount is '+rf);
    console.log('fixclosing amount is '+fixclosing);
    console.log('pick pack amount is '+picknpack);
    console.log('tax amount is '+tax);
    console.log('amazon amount is '+amazonFee);
    console.log('total deducted amount is '+totaldeduction);
    console.log('New profit is '+profit);

    return profit;
    //debugger;
}   

    function newtotaldeduction(shippingPrice,amazonFee,bp){
        var totaldeductionamount=parseFloat(shippingPrice)+parseFloat(amazonFee)+parseFloat(bp);
        return totaldeductionamount;
    }

    function newprofit(sellingPrice,totaldeduction){
        var profit=parseFloat(sellingPrice)-parseFloat(totaldeduction);
        return profit;
    }

    function newamazonfee(picknpack,rf,fixclosing,tax){
       var amazonfee= parseFloat(picknpack)+parseFloat(rf)+parseFloat(fixclosing)+parseFloat(tax);
       //console.log(amazonfee);
       return amazonfee;
    }

    function newtax(picknpack,rf,fixclosing){
        var amount=parseInt(picknpack)+parseInt(rf)+parseInt(fixclosing);
        return ((18/100)*amount);
    }

   function newPicknpack(sellingPrice) {
    var pickprice = 0;
    var sp = sellingPrice;
    radioValueshippingtype = $("input[name='shippingType']:checked").val();
            if (radioValueshippingtype == 'easyShip' || radioValueshippingtype == 'selfShip') {
              return pickprice;
            }
            else {
            if (sp <= 1000) {
                 pickprice = 10;
                return pickprice;              
            } else if (sp >= 1001 && sp <= 4999) {
                 pickprice = 15;
                return pickprice;              
            } else if (sp >= 5000 && sp <= 11999) {
                 pickprice = 25;
                return pickprice;              
            } else {
                 pickprice = 50;
                return pickprice;             
            }
    }
}

    function newRF (sellingPrice,ref){
        let a=sellingPrice;
        let b=ref;
        var newReferal=0;        
        newReferal = ((b / 100)*a);
       // console.log(newReferal);
        return newReferal;
    }

   
    function newFixclosing(sellingPrice) {
   
    //defining variables
    var currentSelectedCategory, radioValueshippingtype, selectedCategoryFlag = false, selectedCategory, 
    otherCategory, productCategory, sellingPrice, from, to, a, x;

    //getting value of shippingType radio button eg.fba or easy ship   
    radioValueshippingtype = $("input[name='shippingType']:checked").val();
    sellingPrice = sellingPrice;

    console.log("shipping Type : " + radioValueshippingtype);

    if (radioValueshippingtype == 'easyShip' || radioValueshippingtype == 'selfShip') {
         //debugger;
           // console.log(response);
            a = easyshipFixClosingValue.results;
            for (i = 0; i < a.length; i++) {
             var toreturn=0;         

                if (sellingPrice >= a[i].from && sellingPrice <= a[i].to) {
                   // $('#fixClosingAmount').val(a[i].price);
                   toreturn=a[i].price;
                  // console.log(toreturn);
                    //console.log("New fix_clogin : " + a[i].price);                     
                    return toreturn;
                    //break;
                }
            }        
       //debugger;
    }
    else {

        // debugger;
        //referalFeesBtnHandler();

        
           //  debugger;
            // console.log(result);
            a = fbxFixclosingValue.results;

            //loop on retrived data for local processing
            for (i = 0; i < a.length; i++) {

                //in some cases "to" limit is eg. 1000 and above 
                //means onward 1000rs fix closing will remain same
                //hence in this situation we make to value more than selling price
                //to bypass if logic written few lines below.
                if (a[i].to === "above") {
                    to = sellingPrice + 1;
                } else {
                    to = a[i].to;
                }

                from = a[i].from;
                otherCategory = a[i].otherCategory;
                selectedCategory = a[i].selectedCategory;

                //if sellingPrice is between from and two then set fix closing value 
                //accordingly 
                if (sellingPrice >= from && sellingPrice <= to) {

                    //get current product category
                    productCategory = localStorage.getItem("productCategory");

                    // debugger;

                    //check this product is under selected cateogry or other category
                    if (stringEmptyChecker(productCategory)) {
                        for (currentSelectedCategory in fbxFixclosingValue.selectedCategories) {
                            //if prduct category is match with any selected category 
                            //then set fixClosingAmoutn of selected category 
                            //otherwise set to other category amount
                            if ($.trim(fbxFixclosingValue.selectedCategories[currentSelectedCategory].toLowerCase()) == productCategory) {
                               // $('#fixClosingAmount').val(selectedCategory);
                               // console.log('selectedCategory : ' + selectedCategory);
                                //if current product is under selcted category then
                                //make this below flag true otherwise default is false 
                                //and exit the loop 
                                selectedCategoryFlag = true;
                                return selectedCategory;
                                break;
                            }
                        }

                        //if selectedCategoryFlag is false then product is under other category
                        //and set value of fixClosingAmount to other category value or price
                        if (!selectedCategoryFlag) {
                           // $('#fixClosingAmount').val(otherCategory);
                           // console.log('otherCategory : ' + otherCategory);
                            return selectedCategory;
                        }

                    } else {
                        //for current just showing alert will develope this letter

                       // console.log('Please select Product Categroy isko dekhna haii')
                        alert("Please select Product Categroy");
                    }

                    //checking whether user product is in selected category
                    //or other category because both having different 
                    //amount of fix closing
                    break;
                }

            }
           // debugger;
       

    }
}
}

    
  }

    
  

function desir_profit() {
    console.log("inside new desir_profit");
    var bp = $("#buyingPrice").val();
    var new_sp = $("#sellingPrice1").val();
    var rf = $("#referralFees").val();
    var new_rf = (rf / 100) * new_sp;
    var new_tx = (18 / 100) * new_sp;
    var d_profit = $("#total_profit1").val();
    var old_profit = $("#total_profit").val();
    var n_shipping = new_shipp(new_sp);
    var new_pickpack = 0;
    var oldShipping = $("#shippingCharges1").val();
    $("#shippingCharges1").val('-' + n_shipping);

    // debugger;
    function new_fix() {
        var ship_type = $("input[name='shippingType']:checked").val();
        console.log(ship_type);
        var xyz = 0;

        // debugger;
        if (ship_type == "fba") {
            // debugger;
            var sellingPrice = parseFloat($("#sellingPrice1").val());
            var to, from;
            //console.log(fbxFixclosingValue);

            var a = fbxFixclosingValue.results;
            // console.log(a);
            for (i = 0; i < a.length; i++) {
                if (a[i].to === "above") {
                    to = sellingPrice + 1;
                } else {
                    to = a[i].to;
                }
                from = a[i].from;
                otherCategory = a[i].otherCategory;
                selectedCategory = a[i].selectedCategory;
                if (sellingPrice >= from && sellingPrice <= to) {
                    $('#fixclosingCharges1').val('-' + otherCategory);
                    return otherCategory;
                    break;
                }
            }

        } else {
            // debugger;
            var sellingPrice = parseFloat($("#sellingPrice1").val());
            var to, from;

            var a = easyshipFixClosingValue.results;
            // console.log(a);
            for (i = 0; i < a.length; i++) {

                if (sellingPrice >= a[i].from && sellingPrice <= a[i].to) {
                    console.log('hyy');
                    var x = a[i].price;
                    $('#fixclosingCharges1').val('-' + x);
                    console.log(x);
                    return x;
                    break;
                }
            }

            // debugger;
        }

    }

    var n_fixclosing = new_fix();

    console.log(n_fixclosing);
    console.log(n_shipping);

    //debugger ;
    function new_shipp(new_sp) {
        //console.log(abc);
        var sp = new_sp;
        var new_shipping = 0;
        var shippingRange = $("input[name='shippingRange']:checked").val();
        console.log(sp);
        console.log(shippingRange);

        var ship_type = $("input[name='shippingType']:checked").val();
        console.log(ship_type);

        if (ship_type == "easyShip") {

            var len = abc.results.length;
            console.log(len);

            for (var i = 0; i < len; i++) {
                if (sp >= abc.results[i].from && sp <= abc.results[i].to) {
                    //debugger ;
                    if (shippingRange == "local") {
                        new_shipping = abc.results[i].local;
                        console.log(new_shipping);
                        return new_shipping;

                    } else if (shippingRange == "regional") {
                        new_shipping = abc.results[i].regional;
                        return new_shipping;

                    } else {
                        new_shipping = abc.results[i].national;
                        return new_shipping;
                    }
                }
            }
        }
        else if (ship_type == "fba") {
            var len = fbashippingValue.results.length;
            console.log(fbashippingValue);
            console.log(len);
            for (var i = 0; i < len; i++) {
                if (sp >= fbashippingValue.results[i].from && sp <= fbashippingValue.results[i].to) {
                    //debugger ;
                    if (shippingRange == "local") {
                        new_shipping = fbashippingValue.results[i].local;
                        console.log(new_shipping);
                        return new_shipping;

                    } else if (shippingRange == "regional") {
                        new_shipping = fbashippingValue.results[i].regional;
                        return new_shipping;

                    } else {
                        new_shipping = fbashippingValue.results[i].national;
                        return new_shipping;
                    }
                }
            }

            //return 50;
        }
        else {
            var oldShipping = $("#shippingCharges").val();
            new_shipping = oldShipping
            return new_shipping;
        }

    }

    //function to call new Pick and pack value call it only if FBA is selected ........................
    var ship_type = $("input[name='shippingType']:checked").val();
    console.log(ship_type);
    if (ship_type == "fba") {
        function new_pick_n_pack() {
            var pickprice = 0;
            var sp = $("#sellingPrice1").val();
            if (sp <= 1000) {
                var pickprice = 10;
                return pickprice;
            } else if (sp >= 1001 && sp <= 4999) {
                var pickprice = 15;
                return pickprice;
            } else if (sp >= 5000 && sp <= 11999) {
                var pickprice = 25;
                return pickprice;
            } else {
                var pickprice = 50;
                return pickprice;
            }
        }

        var new_pickpack = new_pick_n_pack();
        console.log(new_pickpack);
    }

    function calculateNewValues() {
        var newProfit = 0;
        var newTotaldeduction = 0;
        console.log("Buying Price= " + bp);
        console.log("Selling Price= " + new_sp);

        var totalAmazonAmount = parseInt(new_rf) + parseInt(n_fixclosing) + parseInt(new_pickpack);
        var new_tx = (18 / 100) * totalAmazonAmount;

        console.log("New Tax= " + new_tx);
        console.log("New Shipping charge= " + n_shipping);
        console.log("New Fix closing= " + n_fixclosing);
        console.log("New Referal= " + new_rf);
        console.log("New Pick and pack= " + new_pickpack);
        var newAmazonFee = parseInt(new_tx) + parseInt(new_rf) + parseInt(n_fixclosing) + parseInt(new_pickpack);
        console.log("New amazon fee = " + newAmazonFee);
        newTotaldeduction = parseInt(newAmazonFee) + parseInt(bp) + parseInt(n_shipping);
        console.log("Total deductions " + newTotaldeduction);
        newProfit = new_sp - bp - newAmazonFee - n_shipping;

        if (newProfit < 0) {

            $("#profiBtn, #total_profit").css("background", "#db3951");
            $(".profit_class").css("background", "#db3951");

        } else {
            console.log('hyy');
            // $("#profiBtn, #total_profit").css("background", "#53d397");
            $(".profit_class").css("background", "#7ac37a");
        }

        console.log("Total Profit " + newProfit);

        $("#amazon_feees1").val('-' + newAmazonFee.toFixed(2));
        $("#referalCharges1").val('-' + new_rf.toFixed(2));
        $("#fixclosingCharges1").val('-' + n_fixclosing.toFixed(2));
        $("#gst").val('-' + new_tx.toFixed(2));
        $("#picknpack_charge").val('-' + new_pickpack.toFixed(2));
        $("#total_deductions1").val('-' + newTotaldeduction.toFixed(2));
        $("#total_profit2").val(newProfit.toFixed(2));
        $("#total_profit1").val(newProfit.toFixed(2));

    }

    calculateNewValues();

}

/**
 * @name : Ecom Calculator
 * @author : Vaibhav
 * @Description : This function shows the screen guide... 
 */

$(document).on("focus change click", "input, radio, checkbox, select", function(event){
    // event.stopPropagation();
    focusHandler($(this));
});

function focusHandler($elem){
    // debugger;
    var thisSelector = $elem.attr("name");

    if(!thisSelector){
        return;
        // thisSelector = document.activeElement.className;
    }else{
        var listSelector = "#" + thisSelector + "_dd";
    }
    outputMsgScroll($('.wheel'), $(listSelector), 100);
    // for(x in dataguide){
    //     if((dataguide[x].selector).trim() == thisSelector.trim()){
    //         outputMsgScroll('.wheel', listSelector, 1000);
    //         return;
    //     }
    // }
    // document.getElementById("guide").innerHTML = "Enter Selling Price";
}


function resetValues(){
   $("#buyingPrice, #sellingPrice, #length, #breadth, #height, #volumetricPrice, #actualVolume, #shippingCharges, #referralFees, #fixClosingAmount, #total_tax, #total_profit, #referralFeesAmout, #picknPack").val("");
}