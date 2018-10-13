// // //controller for amazon page
app.controller("amazonController", function($scope, $http) {
  // $scope.buyingPrice=0;
  // $scope.sellingPrice=0;
  // $scope.profit=0;

  // $scope.shippingValue = function (valueRange) {
  //     $scope.sellingPrice;
  //     var shippingTypeVal = shippingValue1();

  //     $http.get("assets/data/amazon-easy-ship.json").then(function (response) {
  //         var len = response.data.results.length;
  //         for (var i = 0; i < len; i++) {
  //             if($scope.sellingPrice >= response.data.results[i].from && $scope.sellingPrice <= response.data.results[i].to){
  //                 if (valueRange == "local") {
  //                    $scope.shippingCharges = response.data.results[i].local;
  //                    break;
  //                 }else if(valueRange == "regional"){
  //                    $scope.shippingCharges = response.data.results[i].regional;
  //                    break;
  //                 }else{
  //                    $scope.shippingCharges = response.data.results[i].national;
  //                    break;
  //                 }
  //             }
  //         }
  //     });
  // };

  // var shippingValue1 = function () {
  //     if ($scope.shippingType == "fba") {
  //         return "fba";
  //     }else if($scope.shippingType == "selfShip"){
  //         return "selfShip";
  //     }else{
  //         return "easyShip";
  //     }
  // };

  // var volumetricChange = function () {
  //     debugger;
  //     $scope.volumetric = $scope.productLength * $scope.productBreadth * $scope.productHeight / 5000;
  // }

  // var shippingRangeValue = function () {
  //     // debugger;
  //     // $scope.shippingRange= "vaibhav";
  //     var a = $scope.shippingRange;
  //     if (a == "local") {
  //         return "local";
  //     }else if(a == "regional"){
  //         return "regional";
  //     }else{
  //         return "national";
  //     }
  // };

  // $scope.profit=function(){

  //     //Tax amount calculate...........................
  //     $scope.total_with_tax=(18/100)*$scope.sellingPrice;
  //     console.log($scope.total_with_tax);
  //     console.log($scope.volumetric); 
  //     //Hard coded for shipping Fix closing and Referal fee 
  //     $scope.shippingCharges=50;
  //     $scope.fixClosingAmount=20;
  //     $scope.referralFeesAmout=10;  

  //     $scope.finalProfit = $scope.sellingPrice-$scope.buyingPrice-$scope.shippingCharges-$scope.fixClosingAmount-$scope.total_with_tax-$scope.referralFeesAmout;
  // }
});


// //DECLARING flobal variables ..............................................................................

$(document).on("click", "#profiBtn", calculateProfit);

$(document).on("click", "#modified_selling_price", NewSellingP);

$(document).on("change", ".dimen", VolumetricCal);

$(document).on("change", "#sellingPrice", CallculTax);

$(document).on("change", "#referralFees", ReferalFee);

$(document).on("change", "input[type=radio]", ".customCheckbox", Shipping_Charges);

//when user click on FBA.........................................................
$(document).on("change", "input[type=radio]", ".shippingType", Shipping_Type);

//when user click on pick and pack ....................................
$(document).on("change", "#sellingPrice", PicknPack);

//when click onn fixclosing button open
$(document).on("click", "#fixClosingBtn", function(){

  var ecomName = $(".calculator").attr("id");
  var shippingType = $("input[name='shippingType']:checked").val();
  var filename = ecomName+"-"+shippingType+"-fixClosing.json"
  var selector = ".fixclosingFee";

  $.getJSON("/assets/data/"+filename, function(result){
    
    var a = result.results;
    var b = result.selectedCategories;

    $(selector + " table").html("");

    if(a[0].length == 3){
      var colspan = 3;
      $(selector + " table")
      .append("<th>From</th><th>To</th><th>Price</th>");
    }else{ 
      var colspan = 4;
      $(selector + " table")
      .append("<th>From</th><th>To</th><th>Selected Category</th><th>Other Category</th></th>") 
    }
    

    for(i = 0; i < a.length; i++){
      if(a[i].length == 3){
        $(selector + " table")
        .append("<tr><td>"+a[i].from+"</td><td>"+a[i].to+"</td><td>"+a[i].price+"</td></tr>") 
      }else{ 
        $(selector + " table")
        .append("<tr><td>"+a[i].from+"</td><td>"+a[i].to+"</td><td>"+a[i].selectedCategory+"</td><td>"+a[i].otherCategory+"</td></tr>") 
      }
    }

    //debugger;
    $(selector + " table").append("<tr><th colspan="+colspan+">Selected Categories</th></tr>")
    for(j = 0; j < b.length; j++){
      $(selector + " table").append("<tr><td colspan="+colspan+">"+b[j]+"</td></tr>")
    }
    $(selector).css(
      {
        "overflow-y":"scroll",
        "overflow-x":"hidden",
        "height":"100%"
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
  var picknpack =$("#picknPack").val();
  var tax = $("#total_tax").val();
  var profit = 0;
  var amazon_fee=0;
  var total_deductions=0;

    //check which shipping type is selected
  var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    console.log(radioValueshippingtype);
    if(radioValueshippingtype == 'fba'){
        $(".pickpack").css("display", "block");
    }else {
         $(".pickpack").css("display", "none");
         var picknpack=0;
    }
  
 // ends here
  
  //debugger;
  var profit = sellingPrice - buyingPrice - shippingCharges - referalCharges - fixclosingCharges - tax - picknpack;
  var amazon_fee = parseInt(referalCharges) + parseInt(fixclosingCharges)+parseInt(picknpack) + parseInt(tax);
  var total_deductions = parseInt(amazon_fee) + parseInt(buyingPrice) + parseInt(shippingCharges);




  // debugger;
  if(profit < 0){
    $("#profiBtn, #total_profit").css("background", "#db3951");
  }else{
    $("#profiBtn, #total_profit").css("background", "#53d397");
  }
  
  $("#total_profit").val(profit.toFixed(2));

  $("#total_profit1").val(profit.toFixed(2));
  $("#total_profit2").val(profit.toFixed(2));

  $("#sellingPrice1").val(sellingPrice);
  $("#buyingPrice1").val('-'+buyingPrice);
  $("#shippingCharges1").val('-'+shippingCharges);
  $("#fixclosingCharges1").val('-'+fixclosingCharges);
  $("#referalCharges1").val('-'+referalCharges);
  $("#picknpack_charge").val('-'+picknpack);
  $("#gst").val('-'+tax);
  // debugger;
  $("#amazon_feees1").val('-'+amazon_fee);
  $("#total_deductions1").val('-'+total_deductions);

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
  $("#total_tax").val(tax_amt);
  // console.log(tax_amt);
}

function Shipping_Charges() {

  var sp = $("#sellingPrice").val();
  var shippingCharges = 0;

  var valueRange = $("input[name='shippingRange']:checked").val();

  $.get("assets/data/amazon-easyShip-shipping.json", function(response, status) {
    fbaFixClosing("amazon-fba-fixClosing.json", "#fixClosingAmount");
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
};


function fbaFixClosing(filename, selector){
  var sellingPrice = convertToInt($("#sellingPrice").val());
  var to, from;
  $.getJSON("/assets/data/"+filename, function(result){
    var a = result.results;
    for(i = 0; i < a.length; i++){
      if(a[i].to === "above"){
        to = sellingPrice+1;
      }else{ 
        to = a[i].to;
      }
      from = a[i].from;
      otherCategory = a[i].otherCategory;
      selectedCategory = a[i].selectedCategory;
      if(sellingPrice >= from && sellingPrice <= to){
          $(selector).val(otherCategory);
          break;
      }
    }
  }); 
}



function Shipping_Type(){
    var radioValueshippingtype = $("input[name='shippingType']:checked").val();
    console.log(radioValueshippingtype);
    if(radioValueshippingtype == 'fba'){
        $(".fba").css("display", "block");
    }else {
         $(".fba").css("display", "none");
            
    }

    if(radioValueshippingtype=='selfShip'){
      $(".self_amaz").css("display", "none")
    }
    

}

function PicknPack(){
  console.log("inside pick an pack");
  var pickprice=0;
  var sp = $("#sellingPrice").val();

  if(sp <= 200){
    var pickprice=10;
    $("#picknPack").val(pickprice);
  } else if(sp >200 && sp <= 499){
    var pickprice=15;
    $("#picknPack").val(pickprice);
  }  else if(sp >=500 && sp <= 1000){
    var pickprice=20;
    $("#picknPack").val(pickprice);
  } else{
    var pickprice=25;
    $("#picknPack").val(pickprice);
  }
}

function NewSellingP(){
    var d_profit=$("#desired_profit").val();
    var old_profit=$("#total_profit").val();
    var sp = $("#sellingPrice").val();
    var new_sp=0;

    var new_sp=(sp*d_profit)/old_profit;
    console.log(d_profit);
    console.log(old_profit);
    console.log(sp);
    console.log(new_sp);
    document.getElementById("new_spp").innerHTML = "New Selling Price = "+new_sp;
    
}

function ReferalFee() {
  var temp = $("#referralFees").val();
  var sellingPrice = $("#sellingPrice").val();
  var rf_fee=(temp/100)*sellingPrice;
  $("#referralFeesAmout").val(rf_fee);

 // var a=$("#referralFeesAmout").val();
  console.log(a);
  console.log(rf_fee);
}