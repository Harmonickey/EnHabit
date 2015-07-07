
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
    var switches = $("#" + id + " input");
    
    var data = buildData(userfield, ["username", "firstname", "lastname", "phonenumber", "email", "landlord", "active", "isadmin"], switches);
    
    data["id"] = id;
    
    var error = buildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'bottom-right'});
        
        resetUsers();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"], position: 'bottom-right'});
                    
                    resetUsers();
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update User!", position: 'bottom-right'});
                    
                    resetUsers();
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
                    
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Updated Successfully!", position: 'bottom-right'});
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
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "User Deleted Successfully!", position: 'bottom-right'});
                    }
                    else
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'bottom-right'});
                    }
                },
                error: function(res, err)
                {
                    console.log(res);
                    console.log(err);
                }
            });
        }
    });
    
    
}

function create_user()
{
    var userfield = $("#create-user input[type='text'], #create-user input[type='password']");
    var switches = $("#create-user input[type='checkbox']");
    
    var data = buildData(userfield, ["username", "password", "firstname", "lastname", "phonenumber", "email", "landlord", "active", "isadmin"], switches);
    
    var error = buildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'bottom-right'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"], position: 'bottom-right'});
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Create User!", position: 'bottom-right'});
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
                            "<td><input type='checkbox' " + (data.Landlord ? "checked " : "") + "data-size='mini'></td>" +
                            "<td><input type='checkbox' " + (data.Active ? "checked " : "") + "data-size='mini'></td>" +
                            "<td><input type='checkbox' " + (data.IsAdmin ? "checked " : "") + "data-size='mini'></td>" +
                            "<td><button class='btn btn-primary' onclick='update_user(\"" + data._id.$oid + "\");'>Update</button>" + 
                            "<td><button class='btn btn-danger' onclick='delete_user(\"" + data._id.$oid + "\");'>Delete</button>" +
                        "</tr>");
                        
                    $("#user-list tr:nth-child(2) input").bootstrapSwitch({onText: "Yes", offText: "No"});
                   
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "User Created Successfully!", position: 'bottom-right'});
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

function resetUsers()
{
    $("#user-list tr").not(":first").remove();
    
    get_all_users();
}

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

function buildData(formfield, elements, switches)
{   
    var data = {};
    
    for (var i = 0, j = 0; i < elements.length; i++)
    {
        if ((elements[i] == "landlord" || elements[i] == "active" || elements[i] == "isadmin") && switches.length > 0)
        {
            data[elements[i]] = $(switches[j]).prop("checked");
            j++;
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
    var error_arr = [];
    
    var beginning = "Please Include ";
    
    if (fields.username == "")
    {
        error_arr.push("Username");
    }
    if (fields.password == "")
    {
        error_arr.push("Password");
    }
    if (fields.firstname == "")
    {
        error_arr.push("First Name");
    }
    if (fields.lastname == "")
    {
        error_arr.push("Last Name");
    }
    if (fields.email == "" || (fields.email != null && !isValidEmail(fields.email)))
    {
        error_arr.push("Valid Email");
    }
    if (fields.phonenumber == "" || (fields.phonenumber != null && !isValidPhoneNumber(fields.phonenumber)))
    {
        error_arr.push("Valid Phone Number");
    }
    if (fields.address == "" || fields.latitude == "" || fields.longitude == "")
    {
        error_arr.push("Valid Address - Must Select Google's Result");
    }
    if (fields.address != "" && fields.address != fields.selected_address)
	{
		error_arr.push("Valid Address - Do Not Modify Google's Result After Selecting");
	}
    if (fields.bedrooms == "")
    {
        error_arr.push("Valid Number of Bedrooms");
    }
    if (fields.bathrooms == "")
    {
        error_arr.push("Valid Number of Bathrooms");
    }
    if (fields.rent == "")
    {
        error_arr.push("Valid Monthly Rent Amount");
    }
    if (fields.start_date == "")
    {
        error_arr.push("Valid Lease Start Date");
    }
    if (fields.animals == "")
    {
        error_arr.push("If Animals Are Allowed");
    }
    if (fields.laundry == "")
    {
        error_arr.push("If In-Unit Laundry is Available");
    }
    
    if (error_arr.length > 0)
    {
        var last = " and " + error_arr[error_arr.length - 1];
        error_arr.splice(error_arr.length - 1, 1);
        
        return beginning + error_arr.join(", ") + last;
    }
    
    return beginning;
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