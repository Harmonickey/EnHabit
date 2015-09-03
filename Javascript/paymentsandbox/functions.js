$(function() {
    $('.demo .numbers li').wrapInner('<a href="#"></a>').click(function(e) {
      e.preventDefault();
      $('.demo .numbers').slideUp(100);
      return $('#card_number').val($(this).text()).trigger('input');
    });
    $('body').click(function() {
      return $('.demo .numbers').slideUp(100);
    });
    $('.demo .numbers').click(function(e) {
      return e.stopPropagation();
    });
    $('#sample-numbers-trigger').click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      return $('.demo .numbers').slideDown(100);
    });
    $('.demo .numbers').hide();
    $('.vertical.maestro').hide().css({
      opacity: 0
    });
    return $('#card_number').validateCreditCard(function(result) {
      $(this).removeClass();
      if (result.card_type == null) {
        $('.vertical.maestro').slideUp({
          duration: 200
        }).animate({
          opacity: 0
        }, {
          queue: false,
          duration: 200
        });
        return;
      }
      $(this).addClass(result.card_type.name);
      if (result.card_type.name === 'maestro') {
        $('.vertical.maestro').slideDown({
          duration: 200
        }).animate({
          opacity: 1
        }, {
          queue: false
        });
      } else {
        $('.vertical.maestro').slideUp({
          duration: 200
        }).animate({
          opacity: 0
        }, {
          queue: false,
          duration: 200
        });
      }
      if (result.valid) {
        return $(this).addClass('valid');
      } else {
        return $(this).removeClass('valid');
      }
    }, {
      accept: ['visa', 'visa_electron', 'mastercard', 'maestro', 'discover']
    });
});

function ProcessPayment()
{
    // if valid, then continue
    // if (valid)
      
    var data = {
        method: "credit_card",
        card: $("#card_number").val().trim(),
        month: $("#expiry_date").val().trim().split("/")[0],
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