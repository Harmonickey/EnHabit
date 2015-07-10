
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

function getAllListings()
{
    $.ajax(
    {
        type: "POST",
        url: "/admin/admin_api.php",
        data: 
        {
            command: "get_all_listings"
        },
        success: function(res) 
        {
            if (!contains(res, "No"))
            {
                var data = JSON.parse(res);
                
                for (var i = 0; i < data.length; i++)
                {
                    $("#accordion > div:last").after(
                        "<div class='panel panel-default'>" +
                            "<div class='panel-heading' role='tab' id='heading" + data[i]._id.$oid + "'>" +
                                "<h4 class='panel-title'>" +
                                    "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + data[i]._id.$oid + "' aria-expanded='false' aria-controls='" + data[i]._id.$oid + "'>" +
                                        "<label>Username</label><input type='text' class='form-control' value='" + data[i].Username + "' /> " + "<label>Address</label><input type='text' class='form-control' value='" + data[i].address + "' /> " + "<label>Price</label><input type='text' class='form-control' value='" + data[i].price + "' />" + "</label>Start Date</label><input type='text' class='form-control' value='" + formattedDate(data[i].start) + "' />" + 
                                    "</a>" +
                                "</h4>" +
                            "</div>" +
                            "<div id='" + data[i]._id.$oid + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + data[i]._id.$oid + "'>" +
                                "<div class='panel-body'>" +
                                    "<label>Bedrooms</label><input type='text' class='form-control' value='" + data[i].bedrooms + "' />" +
                                    "<label>Bathrooms</label><input type='text' class='form-control' value='" + data[i].bathrooms + "' />" +
                                    "<label>Animals</label><input type='checkbox' " + (data[i].animals ? "checked" : "") + " data-size='mini' />" +
                                    "<label>Laundry</label><input type='checkbox' " + (data[i].laundry ? "checked" : "") + " data-size='mini' />" +
                                    "<label>Parking</label><input type='checkbox' " + (data[i].parking ? "checked" : "") + " data-size='mini' />" +
                                    "<label>AC</label><input type='checkbox' " + (data[i].ac ? "checked" : "") + " data-size='mini' />" +
                                    "<label>Type</label><input type='text' " + (data[i].type ? "checked" : "") + " data-role='tabsinput' />" +
                                    "<button class='btn btn-primary' onclick='update_listing(\"" + data[i]._id.$oid + "\");'>Update</button>" + 
                                    "<button class='btn btn-danger' onclick='delete_listing(\"" + data[i]._id.$oid + "\");'>Delete</button>" +
                                    "<input type='hidden' value='" + data[i].worldCoordinates.x + "' /><input type='hidden' value='" + data[i].worldCoordinates.y + "' /><input type='hidden' value='" + data[i].address + "' />" +
                                "</div>" +
                            "</div>" +
                        "</div>");
                        
                    setGeocompleteTextBox(data[i]._id.$oid);
                    setTextBoxWithAutoNumeric(data[i]._id.$oid);
                    setDatePickerTextBox(data[i]._id.$oid);
                     
                    $("#listing-list tr:last input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
                }
            }
        },
        error: function(res, err)
        {
            console.log(res);
            console.log(err);
        }
    });
}

function setGeocompleteTextBox(rowId)
{
    var row = $("#" + rowId + " td input[type='text']");
    var hidden = $("#" + rowId + " input[type='hidden']");
    
    $(row[2]).geocomplete()
        .bind("geocode:result", function(event, result){
            $(hidden[0]).val(result.geometry.location.A);
            $(hidden[1]).val(result.geometry.location.F);
            $(hidden[2]).val($(row[2]).val());
        });
}

function setTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " td input[type='text']");
    
    $(row[1]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(row[3]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
    
    $(row[4]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
}

function setDatePickerTextBox(rowId)
{
    $($("#" + rowId + " td input[type='text']")[5]).datepicker();
}

function getAllTransactions()
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
    $.msgbox("Are you sure that you want to delete all records older than ONE year?", 
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
                beforeSend: function()
                {
                    $("#purge-btn").text("Purging...");
                    disableButtons(); 
                },
                data:
                {
                    command: "delete_old_listings"
                },
                success: function(res)
                {
                    resetListings();
                },
                error: function(res, err)
                {
                    console.log(res);
                    console.log(err);
                },
                complete: function()
                {
                    $("#purge-btn").text("Purge Old Listings");
                    enableButtons();
                }
            });
        }
    });
}

function update_listing(id)
{
    var userfield = $("#" + id + " input[type='text']");
    var inputs = $("#" + id + " input[type='checkbox'], #" + id + " input[type='hidden']");
    
    var data = buildData(userfield, ["username", "rent", "address", "bedrooms", "bathrooms", "start_date", "animals", "laundry", "latitude", "longitude", "selected_address"], inputs);
    
    data["id"] = id;
    
    var error = buildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({type: 'error', title: 'Error', text: error, position: 'bottom-right'});
        
        resetListings();
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/admin/admin_api.php",
            beforeSend: function()
            {
                $($("#" + id + " button")[0]).text("Updating...");
                disableButtons();
            },
            data:
            {
                command: "update_listing",
                data: data
            },
            success: function(res)
            {    
                var data = JSON.parse(res);
                
                if (data["error"])
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"], position: 'bottom-right'});
                    
                    resetListings();
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update Listing!", position: 'bottom-right'});
                    
                    resetListings();
                }
                else
                {
                    // update the fields from the query 
                    $($(userfield)[0]).text(data.Username);
                    $($(userfield)[1]).text(data.price);
                    $($(userfield)[2]).text(data.address);
                    $($(userfield)[3]).text(data.bedrooms);
                    $($(userfield)[4]).text(data.bathrooms);
                    $($(userfield)[5]).text(formattedDate(data.start));
                    $($(inputs)[0]).prop("checked", data.animals);
                    $($(inputs)[1]).prop("checked", data.laundry);
                    $($(inputs)[2]).val(data.worldCoordinates.x);
                    $($(inputs)[3]).val(data.worldCoordinates.y);
                    
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
                $($("#" + id + " button")[0]).text("Update");
                enableButtons();
            }
        });
    }
}

function delete_listing(id)
{
    //check if the user really wants to do so
    $.msgbox("Are you sure that you want to delete this listing?", 
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
                beforeSend: function()
                {
                   $($("#" + id + " button")[1]).text("Deleting..."); 
                },
                data:
                {
                    command: "delete_listing",
                    data:
                    {
                        id: id
                    }
                },
                success: function(res)
                {
                    if (contains(res, "Okay"))
                    {
                        // remove the row that we just selected
                        $("#" + id).remove();
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'bottom-right'});
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
                },
                complete: function() {
                    enableButtons();
                }
            });
        }
    });
}

function create_listing()
{
    var userfield = $("#create-listing input[type='text']");
    var inputs = $("#create-listing input[type='checkbox'], #create-listing input[type='hidden']");
    
    var data = buildData(userfield, ["username", "rent", "address", "bedrooms", "bathrooms", "start_date", "animals", "laundry", "latitude", "longitude", "selected_address"], inputs);
    
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
                $("#create-listing button").text("Creating...");
                disableButtons();
            },
            data:
            {
                command: "create_listing",
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Create Listing!", position: 'bottom-right'});
                }
                else
                {
                    //append after the header (first tr)
                    $("#user-list tr:first").after(
                        "<tr id='" + data._id.$oid + "'>"   +
                            "<td><input type='text' class='form-control' value='" + data.Username + "' /></td>" +
                            "<td><input type='text' class='form-control' value='" + data.price + "' /></td>" +
                            "<td><input type='text' class='form-control' value='" + data.address + "' /></td>" +
                            "<td><input type='text' class='form-control' value='" + data.bedrooms + "' /></td>" +
                            "<td><input type='text' class='form-control' value='" + data.bathrooms + "' /></td>" +
                            "<td><input type='text' class='form-control' value='" + formattedDate(data[i].start) + "' /></td>" +
                            "<td><input type='checkbox' " + (data.animals ? "checked " : "") + "data-size='mini' /></td>" +
                            "<td><input type='checkbox' " + (data.laundry ? "checked " : "") + "data-size='mini' /></td>" +
                            "<td><button class='btn btn-primary' onclick='update_user(\"" + data._id.$oid + "\");'>Update</button></td>" + 
                            "<td><button class='btn btn-danger' onclick='delete_user(\"" + data._id.$oid + "\");'>Delete</button></td>" +
                            "<input type='hidden' value='" + data[i].worldCoordinates.x + "' /><input type='hidden' value='" + data[i].worldCoordinates.y + "' /><input type='hidden' value='" + data[i].address + "' />" +
                        "</tr>");
                        
                    // activate toggle switches for these new guys
                    $("#listing-list tr:nth-child(2) input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
                   
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'bottom-right'});
                    
                    // reset the create-row
                    $(userfield[0]).val("");
                    $(userfield[1]).val("");
                    $(userfield[2]).val("");
                    $(userfield[3]).val("");
                    $(userfield[4]).val("");
                    $(userfield[5]).val("");
                    $(userfield[6]).val("");
                    $(inputs[0]).prop("checked", false);
                    $(inputs[1]).prop("checked", false);
                    $(inputs[2]).val("");
                    $(inputs[3]).val("");
                
                }
            },
            error: function(res, err)
            {
                console.log(res);
                console.log(err);
            },
            complete: function()
            {
                $$("#create-listing button").text("Create New Listing");
                enableButtons();
            }
        });
    }
}

function login_listings()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    if (!username || !password)
    {
        $("#listings-login-error").text("Please enter Username and Password");
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/listings/listing_api.php",
            beforeSend: function ()
            {
                $(".login-action").text("Processing...");
                $(".login-action").prop("disabled", true);
            },
            data:
            {
                command: "login_listings",
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
                    // goto landing
                    if (contains(res, "Landlord"))
                    {
                        location.href="/listings/landlord";
                    }
                    else
                    {
                        location.href="/listings/tenant"
                    }
                }
                else
                {
                    $("#listings-login-error").show();
                    $("#listings-login-error").text(res);
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

function logout_listings()
{
    $.ajax(
    {
        type: "POST",
        url: "/listings/logout.php",
        success: function(res)
        {
            if (contains(res, "Successfully"))
            {
                location.href = "/listings/login.php";
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

function resetListings()
{
    $("#listing-list tr").not(":first").remove();
    
    get_all_listings();
}

function initCheckboxes()
{
    $("input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function initCreateListing()
{
    var create_listing = $("#createListingModal input");
    
    $(create_listing[1]).geocomplete()
        .bind("geocode:result", function(event, result){
            $($("#create-listing input[type='hidden']")[0]).val(result.geometry.location.A);
            $($("#create-listing input[type='hidden']")[1]).val(result.geometry.location.F);
            $($("#create-listing input[type='hidden']")[2]).val($(create_listing[2]).val());
        });
        
    $(create_listing[2]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(create_listing[3]).datepicker();
    
    $(create_listing[4]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
    
    $(create_listing[5]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
}

function contains(haystack, needle)
{  
    return (haystack.indexOf(needle) != -1)
}

function buildData(formfield, elements, inputs)
{   
    var data = {};
    
    for (var i = 0, j = 0; i < elements.length; i++)
    {
        if ((elements[i] == "landlord" || elements[i] == "active" || elements[i] == "isadmin" || elements[i] == "animals" || elements[i] == "laundry") && inputs.length > 0)
        {
            data[elements[i]] = $(inputs[j]).prop("checked");
            j++;
        }
        else if ((elements[i] == "latitude" || elements[i] == "longitude" || elements[i] == "selected_address") && inputs.length > 0)
        {
            data[elements[i]] = $(inputs[j]).val();
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
    
    if (fields.username === "")
    {
        error_arr.push("Username");
    }
    if (fields.password === "")
    {
        error_arr.push("Password");
    }
    if (fields.firstname === "")
    {
        error_arr.push("First Name");
    }
    if (fields.lastname === "")
    {
        error_arr.push("Last Name");
    }
    if (fields.email === "" || ((fields.email !== null && fields.email !== undefined) && !isValidEmail(fields.email)))
    {
        error_arr.push("Valid Email");
    }
    if (fields.phonenumber === "" || ((fields.phonenumber !== null && fields.phonenumber !== undefined) && !isValidPhoneNumber(fields.phonenumber)))
    {
        error_arr.push("Valid Phone Number");
    }
    if (fields.address === "" || fields.latitude === "" || fields.longitude === "")
    {
        error_arr.push("Valid Address - Must Select Google's Result");
    }
    if (fields.address !== "" && fields.address !== fields.selected_address)
	{
		error_arr.push("Valid Address - Do Not Modify Google's Result After Selecting");
	}
    if (fields.bedrooms === "")
    {
        error_arr.push("Valid Number of Bedrooms");
    }
    if (fields.bathrooms === "")
    {
        error_arr.push("Valid Number of Bathrooms");
    }
    if (fields.rent === "")
    {
        error_arr.push("Valid Monthly Rent Amount");
    }
    if (fields.start_date === "")
    {
        error_arr.push("Valid Lease Start Date");
    }
    if (error_arr.length > 0)
    {
        if (error_arr.length == 1)
        {
            return beginning + error_arr[0];
        }
        else
        {
            var last = " and " + error_arr[error_arr.length - 1];
            error_arr.splice(error_arr.length - 1, 1);
            
            return beginning + error_arr.join(", ") + last;
        }
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

function disableButtons()
{
    $("button").prop("disabled", true);
}

function enableButtons()
{
    $("button").prop("disabled", false);
}

function formattedDate(dateString)
{
    var date = new Date(dateString);
    var year = date.getFullYear()
    var month = (date.getMonth() + 1)
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return "" + month + "/" + day + "/" + year;
}