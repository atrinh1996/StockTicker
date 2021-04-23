/*
 * StockTickerMainFunctions.js
 * (Part 2.1)
 * 
 * executes main functionality of stock ticker app. 
 * 
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

$(document).ready(function() {
    init();
    displayInputField();
    
});

// Hides input field until user selections an input option
function init() {
    $("#enter-name").hide();
    $("#enter-ticker").hide();
    $("#user_input").hide();
}

// Display input textbox depending on what information user inputs
function displayInputField() {
    $("input[name='input_type'").on("change", function () {
        let picked = $("input[name='input_type']:checked").val();
        showField(picked);
    })
}

// Shows prompt for user to input a company name or a 
// compay's ticker. App only allows for one to be shown.
function showField(infoType) {
    // console.log(infoType);
    $("#user_input").show();
    if (infoType == "company") {
        $("#enter-name").show();
        $("#enter-ticker").hide();
    } else if (infoType == "ticker") {
        $("#enter-ticker").show();
        $("#enter-name").hide();
    }
}