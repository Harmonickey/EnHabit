
$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});

function get_all_users()
{
    $.ajax(
    {
        type: "POST",
        url: "admin_api.php",
        data: 
        {
            command: "get_all_users"
        },
        success: function(res) 
        {
            console.log(res);
            
            var data = JSON.parse(res).data;
            
            for (var i = 0; i < data.length; i++)
            {
               console.log(data[i].Username);
               
               // here I would put all the user information into the table, complete with buttons to delete/update them by id
            }
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function get_all_transactions()
{  
    $.ajax(
    {
        type: "POST",
        url: "admin_api.php",
        data:
        {
            command: "get_all_transactions"
        },
        success: function(res) 
        {
            console.log(res);
            
            for (var i = 0; i < data.length; i++)
            {
               console.log(data[i]);
               
               // here I would put all the user information into the table, complete with buttons to delete/update them by id
            }
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function delete_old_listings()
{
    // check if the user really wants to do so
    
    $.ajax(
    {
        type: "POST",
        url: "admin_api.php",
        data:
        {
            command: "delete_old_listings"
        },
        success: function(res)
        {
            console.log(res);
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function update_user(id)
{
    //valid fields first
    
    $.ajax(
    {
        type: "POST",
        url: "admin_api.php",
        data:
        {
            command: "update_user",
            data: id
        },
        success: function(res)
        {
            console.log(res);
            
            //here we would update the UI to reflect the backend changes
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function delete_user(id)
{
    //check if the user really wants to do so
    
    $.ajax(
    {
        type: "POST",
        url: "admin_api.php",
        data:
        {
            command: "delete_user",
            data: id
        },
        success: function(res)
        {
            console.log(res);
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function login_admin()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    if (!username || !password)
    {
        $("#admin-login-error").text("Please enter Username and Password");
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "admin_api.php",
            beforeSend: function ()
            {
                $(".login-action").text("Processing...");
                $(".login-action").prop("disabled", true);
            },
            data:
            {
                command: "login_admin",
                data: {"username": username, "password": password},
                user: username
            },
            success: function(res)
            {
                console.log(res);
                if (contains(res, "Okay"))
                {
                    //session variable should be set now
                    location.href="/admin"; // goto admin landing
                }
                else
                {
                    $("#admin-login-error").show();
                    $("#admin-login-error").text(res);
                }
            },
            error: function(res, err)
            {
                console.log(res);
                console.log(err);
            },
            complete: function() 
            {
                $(".login-action").text("Sign In");
                $(".login-action").prop("disabled", false);
            }
        });
    }
}

function logout_admin()
{
    $.ajax(
    {
        type: "POST",
        url: "logout.php",
        success: function(res)
        {
            if (contains(res, "Successfully"))
            {
                location.href = "login.php";
            }
            else
            {
                console.log(res); //print the error
            }
        },
        error: function(err, res)
        {
            console.log(err);
            console.log(res);
        }
    });
}

function contains(haystack, needle)
{
    return (haystack.indexOf(needle) != -1)
}
