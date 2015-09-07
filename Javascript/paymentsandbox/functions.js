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

    $('#pay-now').on("click", function(e) 
    {
        e.preventDefault(); // don't allow form submission default behavior

        // check if there are any errors
        if (IsValidSubmission())
        {
            ProcessPayment();
        }
    });
  
    $("#cc-number").keyup(function() {
        if ($.payment.validateCardNumber($(this).val()))
        {
            $(this).addClass("valid");
        }
    });
});

function ProcessPayment()
{
    var data = {
        amount: "0.01",
        description: "testing",
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
    
    console.log(data);
    
    $.msgGrowl ({ type: 'success', title: 'Success', text: "Test Success Message!", position: 'top-center'}); 
    /*
    $.ajax({
       url: "/api.php",
       data: 
       {
           endpoint: "Payments",
           command: "process_payment",
           data: data 
       },
       success: function(res) {
           
           console.log(res);
           
       }
    });
    */
}

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