
/**********************

EVENT HANDLERS

**********************/

$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});


/**********************

ADMIN FUNCTIONS

**********************/

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
                data[i] = sanitizeUserListingData(data[i]);
               
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
    
    var data = buildData(userfield, ["username", "firstname", "lastname", "phonenumber", "email", "landlord", "active", "isadmin"]);
    
    var error = buildError(data);
    
    if (error != "Please Include<br>")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error});
    }
    else
    {
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
                data: data
            },
            success: function(res)
            {    
                var data = JSON.parse(res);
                
                if (data["error"])
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"]});
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update User!"});
                }
                else
                {
                    for (var i = 0; i < data.length; i++)
                    {
                       $($(userfield)[0]).text(data[i].Username);
                       $($(userfield)[1]).text(data[i].FirstName);
                       $($(userfield)[2]).text(data[i].LastName);
                       $($(userfield)[3]).text(data[i].PhoneNumber);
                       $($(userfield)[4]).text(data[i].Email);
                       $($(userfield)[5]).prop("checked", data[i].Landlord);
                       $($(userfield)[6]).prop("checked", data[i].Active);
                       $($(userfield)[7]).prop("checked", data[i].IsAdmin);
                    }
                    
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Updated Successfully!"});
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
}

function delete_user(id)
{
    //check if the user really wants to do so
    $.msgbox("Are you sure that you want to delete this user?", 
    {
        type: "confirm",
		buttons : 
        [
            {type: "submit", value: "Yes"},
            {type: "submit", value: "No"},
            {type: "cancel", value: "Cancel"}
		]
	}, 
    function(result) 
    {
        console.log(result);
        /*
        if (result === "Yes")
        {
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
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "User Deleted Successfully!"});
                    }
                    else
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: res});
                    }
                    
                },
                error: function(res, err)
                {
                    console.log(res);
                    console.log(err);
                }
            });
        }
        */
    });
    
    
}

function create_user()
{
    var userfield = $("#create-user input");
    
    var data = buildData(userfield, ["username", "password", "firstname", "lastname", "phonenumber", "email", "landlord", "active", "isadmin"]);
    
    var error = buildError(data);
    
    if (error != "Please Include<br>")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error});
    }
    else
    {
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
                data: data
            },
            success: function(res)
            {    
                var data = JSON.parse(res);
                
                if (data["error"])
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"]});
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Create User!"});
                }
                else
                {
                    //append after the header (first tr)
                    $("#user-list tr:first").after(
                        "<tr id='" + data._id.$oid + "'>"   +
                            "<td><textarea class='form-control'>" + data.Username + "</textarea></td>" +
                            "<td><textarea class='form-control'>" + data.FirstName + "</textarea></td>" +
                            "<td><textarea class='form-control'>" + data.LastName + "</textarea></td>" +
                            "<td><textarea class='form-control'>" + data.PhoneNumber + "</textarea></td>" +
                            "<td><textarea class='form-control'>" + data.Email + "</textarea></td>" +
                            "<td><input type='checkbox' " + (data.Landlord ? "checked" : "") + "data-size='mini'></td>" +
                            "<td><input type='checkbox' " + (data.Active ? "checked" : "") + "data-size='mini'></td>" +
                            "<td><input type='checkbox' " + (data.IsAdmin ? "checked" : "") + "data-size='mini'></td>" +
                            "<td><button class='btn btn-primary' onclick='update_user(\"" + data._id.$oid + "\");'>Update</button>" + 
                            "<td><button class='btn btn-danger' onclick='delete_user(\"" + data._id.$oid + "\");'>Delete</button>" +
                        "</tr>");
                        
                    $("#user-list tr:second input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
                   
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "User Created Successfully!"});
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

/**********************

UTILITY FUNCTIONS

**********************/

function init_checkboxes()
{
    $("input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function contains(haystack, needle)
{
    return (haystack.indexOf(needle) != -1)
}

function sanitizeUserListingData(data)
{
    data.FirstName = (data.FirstName ? data.FirstName : "-");
    data.LastName = (data.LastName ? data.LastName : "-");
    data.Email = (data.Email ? data.Email : "-");
    data.PhoneNumber = (data.PhoneNumber ? data.PhoneNumber : "-");
    
    return data;
}

function buildData(formfield, elements)
{   
    var data = {};
    
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i] == "landlord" || elements[i] == "active" || elements[i] == "isadmin")
        {
            data[elements[i]] = checkbox_to_boolean($(formfield[i]).val());
        }
        else
        {
            data[elements[i]] = $(formfield[i]).val().trim();
        }
    }
    
    return data;
}

function buildError(fields)
{
    var error = "Please Include<br>";
    
    if (fields.username == "")
    {
        error += "Username<br>";
    }
    if (fields.password == "")
    {
        error += "Password<br>";
    }
    if (fields.firstname == "")
    {
        error += "First Name<br>";
    }
    if (fields.lastname == "")
    {
        error += "Last Name<br>";
    }
    if (fields.email == "" || (fields.email != null && !isValidEmail(fields.email)))
    {
        error += "Valid Email<br>";
    }
    if (fields.phonenumber == "" || (fields.phonenumber != null && !isValidPhoneNumber(fields.phonenumber)))
    {
        error += "Valid Phone Number<br>";
    }
    if (fields.address == "" || fields.latitude == "" || fields.longitude == "")
    {
        error += "Valid Address - Must Select Google's Result<br>";
    }
    if (fields.address != "" && fields.address != fields.selected_address)
	{
		error += "Valid Address - Do Not Modify Google's Result After Selecting<br>";
	}
    if (fields.bedrooms == "")
    {
        error += "Valid Number of Bedrooms<br>";
    }
    if (fields.bathrooms == "")
    {
        error += "Valid Number of Bathrooms<br>";
    }
    if (fields.rent == "")
    {
        error += "Valid Monthy Rent Amount<br>";
    }
    if (fields.start_date == "")
    {
        error += "Valid Lease Start Date<br>";
    }
    if (fields.animals == "")
    {
        error += "If Animals Are Allowed<br>";
    }
    if (fields.laundry == "")
    {
        error += "If In-Unit Laundry is Available<br>";
    }
    
    return error;
}

function isValidEmail(em)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(em);
}

function isValidPhoneNumber(pn)
{
    /*
	Valid Formats are...
	(123) 456-7890
	123-456-7890
	123.456.7890
	1234567890
	+31636363634
	075-63546725
	*/

    return (pn.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) !== null);
}

function checkbox_to_boolean(value)
{
    return (value === "on");
}