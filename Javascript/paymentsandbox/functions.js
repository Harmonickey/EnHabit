$(function() {
    
    jQuery(function($) {
      $('[data-numeric]').payment('restrictNumeric');
      $('.cc-number').payment('formatCardNumber');
      $('.cc-exp').payment('formatCardExpiry');
      $('.cc-cvc').payment('formatCardCVC');

      $.fn.toggleInputError = function(erred) {
        this.parent('.form-group').toggleClass('has-error', erred);
        return this;
      };

      $('#pay-now').on("click", function(e) {
        e.preventDefault();

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
        
        $('.cc-brand').text(cardType);

        $('.validation').removeClass('text-danger text-success');
        $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
      });

    });
});

function ProcessPayment()
{
    var data = {
        method: "credit_card",
        card: $("#cc-number").val().trim(),
        cvv: $("#cvv").val().trim(),
        month: $("#cc-exp").val().trim().split("/")[0],
        year: "20" + $("#expiry_date").val().trim().split("/")[1],
        firstName: $("#name_on_card").val().trim().split(" ")[0],
        lastName: $("#name_on_card").val().trim().split(" ")[1],
        addressLine1: $("#address1").val().trim(),
        addressLine2: $("#address2").val().trim(),
        city: $("#city").val().trim(),
        state: $("#state").val().trim(),
        postal: $("#postal").val().trim()
    };
    
    if ($("#name_on_card").split(" ").length > 2)
    {
        data.lastName = $("#name_on_card").split(" ")[2];
    }
    
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