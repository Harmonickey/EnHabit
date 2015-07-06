
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
        url: "/admin/admin_api.php",
        data: 
        {
            command: "get_all_users"
        },
        success: function(res) 
        {
            var data = JSON.parse(res);
            
            for (var i = 0; i < data.length; i++)
            {
                data[i] = sanitize(data[i]);
               
                //fill in all user data
                $("#user-list tr:last").after(
                    "<tr id='" + data[i]._id.$oid + "'>"   +
                        "<td><textarea class='form-control'>" + data[i].Username + "</textarea></td>" +
                        "<td><textarea class='form-control'>" + data[i].FirstName + "</textarea></td>" +
                        "<td><textarea class='form-control'>" + data[i].LastName + "</textarea></td>" +
                        "<td><textarea class='form-control'>" + data[i].PhoneNumber + "</textarea></td>" +
                        "<td><textarea class='form-control'>" + data[i].Email + "</textarea></td>" +
                        "<td><input type='checkbox' " + (data[i].Landlord ? "checked" : "") + " data-size='mini'></td>" +
                        "<td><input type='checkbox' " + (data[i].Active ? "checked" : "") + " data-size='mini'></td>" +
                        "<td><input type='checkbox' " + (data[i].IsAdmin ? "checked" : "") + " data-size='mini'></td>" +
                        "<td><button class='btn btn-primary' onclick='update_user(\"" + data[i]._id.$oid + "\");'>Update</button>" + 
                        "<td><button class='btn btn-danger' onclick='delete_user(\"" + data[i]._id.$oid + "\");'>Delete</button>" +
                    "</tr>");
                    
                $("#user-list tr:last input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
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
        url: "/admin/admin_api.php",
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
        url: "/admin/admin_api.php",
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
    var userfield = $("#" + id + " textarea");
    
    //valid fields first
    var username = $(userfield[0]).val().trim();
    var firstname = $(userfield[1]).val().trim();
    var lastname = $(userfield[2]).val().trim();
    var phonenumber = $(userfield[3]).val().trim();
    var email = $(userfield[4]).val().trim();
    var landlord = $(userfield[5]).val();
    var active = $(userfield[6]).val();
    var isadmin = $(userfield[7]).val();
    
    $.ajax(
    {
        type: "POST",
        url: "/admin/admin_api.php",
        beforeSend: function()
        {
            $("#" + id + " button").prop("disabled", true);
            $($("#" + id + " button")[0]).text("Updating...");
        },
        data:
        {
            command: "update_user",
            data: 
            {
                "id": id, 
                "username": username, 
                "firstname": firstname, 
                "lastname": lastname, 
                "phonenumber": phonenumber, 
                "email": email,
                "landlord": landlord,
                "active": active,
                "isadmin": isadmin
            }
        },
        success: function(res)
        {    
            var data = JSON.parse(res);
            
            if (data["error"])
            {
                $(".user-error").show();
                $(".user-success").hide();
                $(".user-error").text(data["error"]);
            }
            else if (!res)
            {
                $(".user-error").show();
                $(".user-success").hide();
                $(".user-error").text("Unable to Update User!");
            }
            else
            {
                $(".user-error").hide();
                for (var i = 0; i < data.length; i++)
                {
                   $($(userfield)[0]).text(data[i].Username);
                   $($(userfield)[1]).text(data[i].FirstName);
                   $($(userfield)[2]).text(data[i].LastName);
                   $($(userfield)[3]).text(data[i].PhoneNumber);
                   $($(userfield)[4]).text(data[i].Email);
                   $($(userfield)[5]).val(data[i].landlord);
                   $($(userfield)[6]).val(data[i].active);
                   $($(userfield)[7]).val(data[i].isadmin);
                }
                
                $(".user-success").show();
                $(".user-success").text("Updated Successfully!");
            }
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        },
        complete: function()
        {
            $("#" + id + " button").prop("disabled", false);
            $($("#" + id + " button")[0]).text("Update");
        }
    });
}

function delete_user(id)
{
    //check if the user really wants to do so
    
    $.ajax(
    {
        type: "POST",
        url: "/admin/admin_api.php",
        data:
        {
            command: "delete_user",
            data:
            {
                id: id
            }
        },
        success: function(res)
        {
            if (contains(res, "Okay"))
            {
                $("#" + id).remove();
                $(".user-error").hide();
                $(".user-success").show();
                $(".user-success").text("User Deleted Successfully!");
            }
            else
            {
                $(".user-error").show();
                $(".user-success").hide();
                $(".user-error").text(res);
            }
            
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function create_user()
{
    var userfield = $("#create-user input");
    
    //valid fields first
    var username = $(userfield[0]).val().trim();
    var password = $(userfield[1]).val().trim();
    var firstname = $(userfield[2]).val().trim();
    var lastname = $(userfield[3]).val().trim();
    var phonenumber = $(userfield[4]).val().trim();
    var email = $(userfield[5]).val().trim();
    var landlord = $(userfield[6]).val();
    var active = $(userfield[7]).val();
    var isadmin = $(userfield[8]).val();
    
    $.ajax(
    {
        type: "POST",
        url: "/admin/admin_api.php",
        beforeSend: function()
        {
            $("#create-user button").prop("disabled", true);
            $("#create-user button").text("Creating...");
        },
        data:
        {
            command: "create_user",
            data: 
            {
                "id": id, 
                "username": username, 
                "password": password,
                "firstname": firstname, 
                "lastname": lastname, 
                "phonenumber": phonenumber, 
                "email": email,
                "landlord": landlord,
                "active": active,
                "isadmin": isadmin
            }
        },
        success: function(res)
        {    
            var data = JSON.parse(res);
            
            if (data["error"])
            {
                $(".user-error").show();
                $(".user-success").hide();
                $(".user-error").text(data["error"]);
            }
            else if (!res)
            {
                $(".user-error").show();
                $(".user-success").hide();
                $(".user-error").text("Unable to Create User!");
            }
            else
            {
                //prepend to table list
                $(".user-error").hide();
                
                //append after the header (first tr)
                $("#user-list tr:first").after(
                    "<tr id='" + data._id.$oid + "'>"   +
                        "<td><textarea style='resize:none;' class='form-control'>" + data.Username + "</textarea></td>" +
                        "<td><textarea style='resize:none;' class='form-control'>" + data.FirstName + "</textarea></td>" +
                        "<td><textarea style='resize:none;' class='form-control'>" + data.LastName + "</textarea></td>" +
                        "<td><textarea style='resize:none;' class='form-control'>" + data.PhoneNumber + "</textarea></td>" +
                        "<td><textarea style='resize:none;' class='form-control'>" + data.Email + "</textarea></td>" +
                        "<td><input type='checkbox' " + (data.Landlord ? "checked" : "") + "data-size='mini'></td>" +
                        "<td><input type='checkbox' " + (data.Active ? "checked" : "") + "data-size='mini'></td>" +
                        "<td><input type='checkbox' " + (data.IsAdmin ? "checked" : "") + "data-size='mini'></td>" +
                        "<td><button class='btn btn-primary' onclick='update_user(\"" + data._id.$oid + "\");'>Update</button>" + 
                        "<td><button class='btn btn-danger' onclick='delete_user(\"" + data._id.$oid + "\");'>Delete</button>" +
                    "</tr>");
               
                $(".user-success").show();
                $(".user-success").text("User Created Successfully!");
            }
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        },
        complete: function()
        {
            var username = $(userfield[0]).val("");
            var password = $(userfield[1]).val("");
            var firstname = $(userfield[2]).val("");
            var lastname = $(userfield[3]).val("");
            var phonenumber = $(userfield[4]).val("");
            var email = $(userfield[5]).val("");
            var landlord = $(userfield[6]).prop("checked", false);
            var active = $(userfield[7]).prop("checked", true);
            var isadmin = $(userfield[8]).prop("checked", false);
            
            $("#create-user button").prop("disabled", false);
            $("#create-user button").text("Create New User");
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
            url: "/admin/admin_api.php",
            beforeSend: function ()
            {
                $(".login-action").text("Processing...");
                $(".login-action").prop("disabled", true);
            },
            data:
            {
                command: "login_admin",
                data: 
                {
                    "username": username, 
                    "password": password
                },
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
        url: "/admin/logout.php",
        success: function(res)
        {
            if (contains(res, "Successfully"))
            {
                location.href = "/admin/login.php";
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

function init_checkboxes()
{
    $("input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function contains(haystack, needle)
{
    return (haystack.indexOf(needle) != -1)
}

function sanitize(data)
{
    data.FirstName = (data.FirstName ? data.FirstName : "-");
    data.LastName = (data.LastName ? data.LastName : "-");
    data.Email = (data.Email ? data.Email : "-");
    data.PhoneNumber = (data.PhoneNumber ? data.PhoneNumber : "-");
    
    return data;
}
