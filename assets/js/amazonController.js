// controller for amazon page
app.controller("amazonController", function($scope, $http) {});

// //DECLARING flobal variables ..............................................................................

$(document).on("click", "#profiBtn", calculateProfit);

$(document).on("click", "#getProfit", NewSellingP);

$(document).on("change", ".dimen", VolumetricCal);

//$(document).on("change", "#sellingPrice", CallculTax, fixClos);


//this is done so that on change of SP both RF and Tax will be calculated
$(document).on("change", "#sellingPrice", onsellingprice);


function onsellingprice(){
  CallculTax();
 fixClos();
};



$(document).on("change", "#referralFees", ReferalFee);

$(document).on("change", "input[type=radio]", ".customCheckbox", Shipping_Charges);

//when user click on FBA.........................................................
$(document).on("change", "input[type=radio]", ".shippingType", Shipping_Type);

//when user click on pick and pack ....................................
$(document).on("change", "#sellingPrice", PicknPack);

$(document).on("change", "#sellingPrice1", desir_profit);

//when click onn fixclosing button open
$(document).on("click", "#fixClosingBtn", function() {

    var ecomName = $(".calculator").attr("id");
    var shippingType = $("input[name='shippingType']:checked").val();
    var filename = ecomName + "-" + shippingType + "-fixClosing.json"
    var selector = ".fixclosingFee";

    $.getJSON("/assets/data/" + filename, function(result) {

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
});



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

    console.log(amazon_fee);
    console.log(total_deductions);

}

function VolumetricCal() {
    var length = $("#length").val();
    var breadth = $("#breadth").val();
    var height = $("#height").val();

    var totalVolume = (length * breadth * height) / 5000;
    return $("#volumetricPrice").val(totalVolume);
    // console.log(volum);
}

function CallculTax() {
    var sp = $("#sellingPrice").val();
    var tax_amt = (sp / 100) * 18;
    $("#total_tax").val(tax_amt.toFixed(2));
    // console.log(tax_amt);
}

function fixClos() {
    var radioValueshippingtype = $("input[name='shippingType']:checked").val();

    console.log(radioValueshippingtype);

    if (radioValueshippingtype == 'easyShip' || radioValueshippingtype == 'selfShip') {

        var sellingPrice = convertToInt($("#sellingPrice").val());
        var to, from;
        $.get("assets/data/amazon-easyShip-fixClosing.json", function(response, status) {
            console.log(response);
            var a = response.results;
            console.log(a);
            for ( i = 0; i < a.length; i++) {
                
                if (sellingPrice >= a[i].from && sellingPrice <=a[i].to) {
                  console.log('hyy');
                    var x = a[i].price;
                    $('#fixClosingAmount').val(x);
                    console.log(x);
                    return x;
                    break;
                }
            }
        });
    }
    else  {
        var sellingPrice = convertToInt($("#sellingPrice").val());
        var to, from;
        $.getJSON("/assets/data/amazon-fba-fixClosing.json", function(result) {
            console.log(result);
            var a = result.results;
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
                    $('#fixClosingAmount').val(otherCategory);
                    break;
                }
            }
        });
    }

}

function Shipping_Charges() {

    var sp = $("#sellingPrice").val();
    var shippingCharges = 0;

    var valueRange = $("input[name='shippingRange']:checked").val();

    $.get("assets/data/amazon-easyShip-shipping.json", function(response, status) {
        fixClos();

        //fbaFixClosing("amazon-fba-fixClosing.json", "#fixClosingAmount");
        var len = response.results.length;
        console.log(len);
        for (var i = 0; i < len; i++) {
            if (sp >= response.results[i].from && sp <= response.results[i].to) {
                if (valueRange == "local") {
                    shippingCharges = response.results[i].local;
                    console.log(shippingCharges);
                    $("#shippingCharges").val(shippingCharges);
                    return shippingCharges;
                    break;
                } else if (valueRange == "regional") {
                    shippingCharges = response.results[i].regional;
                    console.log(shippingCharges);
                    $("#shippingCharges").val(shippingCharges);
                    return shippingCharges;
                    break;
                } else {
                    shippingCharges = response.results[i].national;
                    console.log(shippingCharges);
                    $("#shippingCharges").val(shippingCharges);
                    return shippingCharges;
                    break;
                }
            }
        }
    });

    // easyshipFixClosing();
}
;
function fbaFixClosing(filename, selector) {
    var sellingPrice = convertToInt($("#sellingPrice").val());
    var to, from;
    $.getJSON("/assets/data/" + filename, function(result) {
        var a = result.results;
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
                $(selector).val(otherCategory);
                break;
            }
        }
    });
}

function Shipping_Type() {
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

        $(".self_amaz").css("display", "none");
        document.getElementById('shippingCharges').readOnly = false;
        return 0;
    }

}

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

function NewSellingP() {
    // console.log('in new sellingPrice1');
    document.getElementById("sellingPrice1").readOnly = false;
    $("#sellingPrice1").attr("placeholder", "Enter desired profit");
    document.getElementById("sellingPrice1").focus();
    document.getElementById("sellingPrice1").select();

}

// to set up new sellimg price call jason data here only 
var abc = 20;
function xyz() {
    $.get("assets/data/amazon-easyShip-shipping.json", function(response, status) {
        abc = response;
    });
}
xyz();



//var p=0;

function desir_profit() {
    console.log("inside new desir_profit");
    var bp = $("#buyingPrice1").val();
    var new_sp = $("#sellingPrice1").val();
    var rf = $("#referralFees").val();
    var new_rf = (rf / 100) * new_sp;
    var new_tx = (18 / 100) * new_sp;
    var d_profit = $("#total_profit1").val();
    var old_profit = $("#total_profit").val();
    var n_shipping = new_shipp(new_sp);

    console.log(n_shipping);
    console.log(n_fixclosing);

    $("#shippingCharges1").val('-'+n_shipping);

    
   // debugger;
    function new_fix() {
        var ship_type = $("input[name='shippingType']:checked").val();
        console.log(ship_type);
        var xyz = 0;

       // debugger;
        if (ship_type == "fba") {
            var sellingPrice = convertToInt($("#sellingPrice1").val());
        var to, from;
        $.getJSON("/assets/data/amazon-fba-fixClosing.json", function(result) {
            console.log(result);
            var a = result.results;
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
                    $('#fixclosingCharges1').val('-'+otherCategory);
                    break;
                }
            }
        });


        } else {
         // debugger;
        var sellingPrice = convertToInt($("#sellingPrice1").val());
        var to, from;
        $.get("assets/data/amazon-easyShip-fixClosing.json", function(response, status) {
            console.log(response);
            var a = response.results;
            console.log(a);
            for ( i = 0; i < a.length; i++) {
                
                if (sellingPrice >= a[i].from && sellingPrice <=a[i].to) {
                  console.log('hyy');
                    var x = a[i].price;
                    $('#fixclosingCharges1').val('-'+x);
                    console.log(x);
                    
                    return x;
                    break;
                }
            }
        });

       // debugger;
        }

    }




    var n_fixclosing = new_fix();
    console.log(n_fixclosing);

    //debugger ;
    function new_shipp(new_sp) {
        console.log(abc);
        var sp = new_sp;
        var new_shipping = 0;
        var ship_type = $("input[name='shippingRange']:checked").val();
        console.log(sp);
        console.log(ship_type);

        var len = abc.results.length;
        console.log(len);

        for (var i = 0; i < len; i++) {
            if (sp >= abc.results[i].from && sp <= abc.results[i].to) {
                // debugger ;
                if (ship_type == "local") {
                    new_shipping = abc.results[i].local;
                    return new_shipping;

                } else if (ship_type == "regional") {
                    new_shipping = abc.results[i].regional;
                    return new_shipping;

                } else {
                    new_shipping = abc.results[i].national;
                    return new_shipping;
                }
            }
        }

    }

}



function ReferalFee() {
  debugger;
    var temp = $("#referralFees").val();
    console.log(temp);
    var sellingPrice = $("#sellingPrice").val();
    console.log(sellingPrice);
    var rf_fee = ((temp / 100) * sellingPrice);


    console.log(rf_fee);
    $("#referralFeesAmout").val(rf_fee);
    debugger;
     console.log(a);
    return rf_fee;
    
}
