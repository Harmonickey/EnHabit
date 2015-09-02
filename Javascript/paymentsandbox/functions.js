function ProcessPayment()
{
    $.ajax({
       url: "/api.php",
       data: {
           endpoint: "Payments"
           command: "get_token"
       },
       success: function(res) {
           var token = res.access_token;
       }
    });
    
}