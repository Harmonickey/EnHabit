

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
        
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "admin_api.php",
            data:
            {
                command: "login_admin",
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
}
