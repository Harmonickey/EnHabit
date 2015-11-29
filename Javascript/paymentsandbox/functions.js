/********** INITIALIZATION FUNCTIONS ************/

// We are using the Luhn algorithm to validate credit cards.
// Library help by Stripe Jquery Credit Card library
$(function() 
{   
    // setup formatting for certain text boxes
    $('[data-numeric]').payment('restrictNumeric');
    $('.cc-number').payment('formatCardNumber');
    $('.cc-exp').payment('formatCardExpiry');
    $('.cc-cvc').payment('formatCardCVC');

    $.fn.toggleInputError = function(erred) 
    {
        this.parent('.form-group').toggleClass('has-error', erred);
        return this;
    };
  
    $("#cc-number").keyup(function() {
        if ($.payment.validateCardNumber($(this).val()))
        {
            $(this).addClass("valid");
        }
    });
});

/****** PAYPAL FUNCTIONS *******/

function ProcessPayment(uid, rent, description, landlordEmail)
{
    var paymentMonth = $("#paymentMonth").val();
    
    var data = {
        amount: rent,
        description: description,
        method: "credit_card",
        card: $("#cc-number").val().trim(),
        cvv: $("#cc-cvc").val().trim(),
        month: GetMonth($("#cc-exp")),
        year: GetYear($("#cc-exp")),
        type: $.payment.cardType($("#cc-number").val()),
        firstName: $("#name_on_card").val().trim().split(" ")[0],
        lastName: GetLastName($("#name_on_card")),
        addressLine1: $("#address1").val().trim(),
        addressLine2: $("#address2").val().trim(),
        city: $("#city").val().trim(),
        state: $("#state").val().trim(),
        postal: $("#postal").val().trim()
    };
    
    $.msgGrowl ({ type: 'success', title: 'Success', text: "Payment Sent!", position: 'top-center'}); 
    $("#createPaymentModal").modal('hide');
    
    $.ajax({
       type: "POST",
       url: "/api.php",
       data: 
       {
           endpoint: "Payments",
           command: "process_payment",
           data: data 
       },
       success: function(res) {
           ProcessPayoutToLandlord(uid, rent, landlordEmail, paymentMonth, description);
       }
    });
}

/************* DATABASE FUNCTIONS ***************/

function ProcessPayoutToLandlord(uid, rent, landlordEmail, paymentMonth, description)
{
    var data = {
        Rent: rent,
        Email: landlordEmail,
        Description: description,
        Month: paymentMonth
    };
    
    $.ajax({
       type: "POST",
       url: "/api.php",
       data: 
       {
           endpoint: "Payments",
           command: "process_payout",
           data: data 
       },
       success: function(res) {
           // Now the data needs to be inserted into the database and the
           // flag on the renter's document needs to be set to HasPaidRent = true          
           UpdateRenter(uid);
           InsertPayment(uid, landlordEmail, rent, paymentMonth);
       }
    });
}

function UpdateRenter(uid)
{
    $.ajax({
       type: "POST",
       url: "/api.php",
       data: 
       {
           endpoint: "Renters",
           command: "update_renter_to_paid",
           data: 
           {
                RenterId: uid
           }
       },
       success: function(res) {
           // nothing should really happen here at this point really, it's all backend work
       }
    });
}

function InsertPayment(uid, landlordEmail, rent, paymentMonth)
{
    var data = {
      RenterId: uid,
      LandlordEmail: landlordEmail, // will be converted to LandlordID in backend
      Rent: rent, 
      Month: paymentMonth
    };
    
    $.ajax({
       type: "POST",
       url: "/api.php",
       data: 
       {
           endpoint: "Payments",
           command: "insert_payment",
           data: data 
       },
       success: function(res) {
           // nothing should really happen here at this point really, it's all backend work
       }
    });
}


/********* UTILITY FUNCTIONS ******************/

function IsValidSubmission()
{
    var cardType = $.payment.cardType($('.cc-number').val());
    $('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
    $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
    $('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
    $('#address1').toggleInputError(!$('#address1').val());
    $('#address2').toggleInputError(!$('#address2').val());
    $('#city').toggleInputError(!$('#city').val());
    $('#state').toggleInputError(!$('#state').val());
    $('#postal').toggleInputError(!$('#postal').val());
    $('#name_on_card').toggleInputError(!$('#name_on_card').val());
    
    return FindAndReportErrors();
}

function FindAndReportErrors()
{
    $('.validation').removeClass('text-danger text-success');
    $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
    
    return ($('.has-error').length ? false : true);
}

function GetMonth(date)
{
    return date.val().trim().split("/")[0].replace(" ", "");
}

function GetYear(date)
{
    return date.val().trim().split("/")[1].replace(" ", "");
}

function GetLastName(name)
{ 
    if (name.val().trim().split(" ").length > 2)
    {
        return name.val().trim().split(" ")[name.val().trim().split(" ").length - 1];
    }
    else if (name.val().trim().split(" ").length > 1)
    {
        return name.val().trim().split(" ")[1];
    }
    else
    {
       return "N/A"; 
    }
}
