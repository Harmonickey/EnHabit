
/**********************

EVENT HANDLERS

**********************/

var savedUsername = "";
var pendingData = null;
var numUploaded = 0;

$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});

function getAllUsers()
{
    try
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data: 
            {
                command: "get_all_users",
                endpoint: "Accounts"
            },
            success: function(res) 
            {
                try
                {
                    if (!res)
                    {
                        throw new Error("Unable to retrieve users");
                        $("#accordion").html("<p>No Users Yet</p>");
                        $(".actions a").show();
                    }
                    else if (contains(res, "No Users"))
                    {
                        $("#accordion").html("<p>No Users Yet</p>");
                        $(".actions a").show();
                    }
                    else
                    {                   
                        var data = JSON.parse(res);
                        
                        for (var i = 0; i < data.length; i++)
                        {
                            var oid = data[i]._id.$oid;
                           
                            //fill in all user data
                            $("#accordion").append(createAccordionUsersView(oid, data[i]));
                            
                            setBootstrapSwitchesForUsers(oid);
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    $(".actions a").show();
                }
            },
            error: function(res, err)
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    $(".actions a").show();
                }
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function getAllListings()
{
    try
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                //spinner on accordion area
                $("#accordion").html("<i class='fa fa-spinner fa-pulse' />")
            },
            data:
            {
                command: "get_listings",
                endpoint: "Listings"
            },
            success: function(res) 
            {
                try
                {
                    if (!res)
                    {
                        throw new Error("Unable to retrieve listings");
                        $("#accordion").html("<p>No Listings Yet</p>");
                        $(".actions a").show();
                    }
                    else if (contains(res, "No Matching Entries"))
                    {
                        $("#accordion").html("<p>No Listings Yet</p>");
                        $(".actions a").show();
                    }
                    else
                    {
                        $("#accordion").html("");

                        var data = JSON.parse(res);
                        
                        if (contains(res, "Error"))
                        {
                            throw new Error(res);
                            $(".actions a").show();
                        }
                        else
                        {
                            for (var i = 0; i < data.length; i++)
                            {
                                var oid = data[i]._id.$oid;
                                
                                $("#accordion").append(createAccordionView(oid, data[i]));
                                
                                var selector = "[id='" + oid + "'] form";
                                
                                createDropzone(oid, selector, data[i].Pictures);
                                    
                                setGeocompleteTextBox(oid);
                                setTextBoxWithAutoNumeric(oid);
                                setDatePickerTextBox(oid);
                                setBootstrapSwitches(oid);
                                setTextBoxWithTags(oid);
                            }
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    $(".actions a").show();
                }
            },
            error: function(res, err)
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    $(".actions a").show();
                }
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function getAllTransactions()
{  
    try
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "get_all_transactions",
                endpoint: "Payments"
            },
            success: function(res) 
            {
                try
                {
                    if (!res)
                    {
                        throw new Error("Unable to retrieve payments");
                        $("#accordion").html("<p>No Payments Yet</p>");
                        $(".actions a").show();
                    }
                    else if (contains(res, "No Payments"))
                    {
                        $("#accordion").html("<p>No Payments Yet</p>");
                        $(".actions a").show();
                    }
                    else
                    {
                        $("#accordion").html("");

                        var data = JSON.parse(res);
                        
                        if (contains(res, "Error"))
                        {
                            throw new Error(res);
                            $(".actions a").show();
                        }
                        else
                        {
                            for (var i = 0; i < data.length; i++)
                            {
                                var oid = data[i]._id.$oid;
                                
                                $("#accordion").append(createAccordionPaymentsView(oid, data[i]));
                            }
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    $(".actions a").show();
                }    
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-left'});
                $(".actions a").show();
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
        $(".actions a").show();
    }
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
                url: "/api.php",
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

function update_user(oid)
{
    var userfield = $("#" + oid + " input[type='text']");
    var switches = $("#" + oid + " input[type='checkbox']");
    
    var data = buildData(userfield, ["username", "firstname", "lastname", "isadmin", "phonenumber", "email", "isactive", "isverified"], switches);
    
    data.oid = oid;
    
    var error = buildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'top-center'});
        
        resetUsers();
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                $($("#" + oid + " button")[0]).text("Updating...");
                disableButtons();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: data["error"], position: 'top-center'});
                    
                    resetUsers();
                }
                else if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update User!", position: 'top-center'});
                    
                    resetUsers();
                }
                else
                {
                    // update the fields from the query 
                    $($(userfield)[0]).text(data.Username);
                    $($(userfield)[1]).text(data.FirstName);
                    $($(userfield)[2]).text(data.LastName);
                    $($(userfield)[3]).text(data.PhoneNumber);
                    $($(userfield)[4]).text(data.Email);
                    $($(switches)[1]).prop("checked", data.IsActive);
                    $($(switches)[2]).prop("checked", data.IsAdmin);
                    $($(switches)[3]).prop("checked", data.IsVerified);
                    
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Updated Successfully!", position: 'top-center'});
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            },
            complete: function()
            {
                $($("#" + oid + " button")[0]).text("Update");
                enableButtons();
            }
        });
    }
}

function setBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":last").bootstrapSwitch({onText: "Yes", offText: "No"});
    $(checkboxes[checkboxes.length - 1]).bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
}

function setBootstrapSwitchesForUsers(rowId)
{
    $("#" + rowId + " input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function setGeocompleteTextBox(rowId)
{
    var row = $("#" + rowId + " div input[type='text']");
    var hidden = $("#" + rowId + " input[type='hidden']");
    
    $(row[0]).geocomplete()
        .bind("geocode:result", function(event, result){
            $(hidden[0]).val(result.geometry.location.A);
            $(hidden[1]).val(result.geometry.location.F);
            $(hidden[2]).val($(row[0]).val());
        });
}

function setTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
    $(row[1]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
}

function setTextBoxWithTags(rowId)
{
   $("#" + rowId + " input[data-role='tagsinput']").tagsinput();
}

function setDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[2]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[2]).val()) //current
    });
}

function update_listing(oid)
{
    var inputs = $("#" + oid + " input").not(":eq(6)");
    
    var data = buildData(inputs, ["address", "unit", "rent", "start", "university", "bedrooms", "bathrooms", "tags", "animals", "laundry", "parking", "airConditioning", "type", "latitude", "longitude", "selected_address"]);
    
    //first validate that the fields are filled out
    var error = buildError(data);
    
    data.oid = oid;
    data.type = (data.type == true ? "apartment" : "sublet");
    data.address = data.address.split(",")[0];
    data.start = $.datepicker.formatDate('mm/dd/yy', new Date(data.start));
    data.pictures = pictures[oid];
    
    try
    {
        if (error != "Please Include ")
        {
            throw new Error(error);
        }
        else
        {
            dropzones[oid].processQueue();
            
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                data:
                {
                    command: "update_listing",
                    data: data,
                    endpoint: "Listings"
                },
                beforeSend: function()
                {
                    $("#" + oid + " button").prop("disabled", true);
                    $($("#" + oid + " button")[0]).text("Updating...");
                },
                success: function(res)
                { 
                    try
                    {
                        if (contains(res, "Okay"))
                        {
                            var inputs = $("#" + oid + " input");
                            var headingInputs = $("#heading" + oid + " label");
                            
                            $(headingInputs[0]).text("Address: " + $(inputs[0]).val());
                            $(headingInputs[1]).text("Unit: " + $(inputs[1]).val());
                            $(headingInputs[2]).text("Rent: " + $(inputs[2]).val());
                            $(headingInputs[3]).text("Start Date: " + $(inputs[3]).val());
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                            numUploaded = 0;
                            
                            // close the div
                            $("#heading" + oid + " a").click();
                        }
                        else
                        {
                            throw new Error("Problem Updating Listing");
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                        numUploaded = 0;
                    }
                },
                error: function(err, res)
                {
                    try
                    {
                        throw new Error(err + " " + res);
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    }
                },
                complete: function()
                {
                    $("#" + oid + " button").prop("disabled", false);
                    $($("#" + oid + " button")[0]).text("Update");
                }
            });
        }
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function delete_user(uid)
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
                url: "/api.php",
                beforeSend: function()
                {
                   $($("#" + uid + " button")[1]).text("Deleting...");
                   disableButtons();
                },
                data:
                {
                    command: "delete_user",
                    data:
                    {
                        uid: uid
                    }
                },
                success: function(res)
                {
                    if (contains(res, "Okay"))
                    {
                        // remove the row that we just selected
                        $("#" + uid).remove();
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "User Deleted Successfully!", position: 'top-center'});
                    }
                    else
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                },
                complete: function() {
                    enableButtons();
                }
            });
        }
    });  
}

function delete_listing(oid)
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
            try
            {
                $.ajax(
                {
                    type: "POST",
                    url: "/api.php",
                    beforeSend: function()
                    {
                        $("#" + oid + " button").prop("disabled", true);
                        $($("#" + oid + " button")[1]).text("Deleting...");
                    },
                    data:
                    {
                        command: "delete_listing",
                        data:
                        {
                            oid: oid
                        },
                        endpoint: "Listings"
                    },
                    success: function(res)
                    {
                        try
                        {
                            if (contains(res, "Okay"))
                            {
                                // remove the row that we just selected
                                $("#" + oid).parent().remove();
                                $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'top-left'});
                                if ($("#accordion").text() == "")
                                {
                                    $("#accordion").text("No Listings Yet");
                                }
                            }
                            else
                            {
                                throw new Error("Problem Deleting Listing");
                            }
                        }
                        catch(e)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                        }
                    },
                    error: function(res, err)
                    {
                        try
                        {
                            throw new Error(res + " " + err);
                        }
                        catch(e)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                        }
                    }
                });
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
            }
        }
    });
}

function create_user()
{
    var userfield = $("#create-user input[type='text']");
    
    var data = buildData(userfield, ["username", "password", "firstname", "lastname", "phonenumber", "email", "landlord", "isactive", "isadmin", "isverified"]);
    
    var error = buildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'top-center'});
    }
    else
    {
        try
        {
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                beforeSend: function()
                {
                    $("#create-user-button").text("Creating...");
                    $("#create-user-button").prop("disabled", "true");
                },
                data:
                {
                    command: "create_user",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            throw new Error("Unable to Create User");
                        }
                        else
                        {
                            var user = JSON.parse(res);
                                
                            if (user["error"])
                            {
                                throw new Error(user["error"]);
                            }
                            else
                            {
                                if ($("#accordion").text() == "No Users Yet")
                                {
                                    $("#accordion").html("");
                                }
                                
                                var uid = user._id.$oid;
                                
                                $("#accordion").append(createAccordionUsersView(uid, user));
                            }
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-left'});
                },
                complete: function()
                {
                    $("#create-user-button").text("Create New User");
                    $("#create-user-button").prop("disabled", "false");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
        }
    }
}

function create_listing()
{
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(11)");
    
    var data = buildData(inputs, ["address", "unit", "rent", "start", "university", "bedrooms", "bathrooms", "animals", "laundry", "parking", "airConditioning", "type", "tags", "latitude", "longitude", "selected_address"]);
    
    var error = buildError(data);
    
    data.type = (data.type == true ? "apartment" : "sublet");
    data.address = data.address.split(",")[0];
    data.start = $.datepicker.formatDate('mm/dd/yy', new Date(data.start));
    data.pictures = pictures["create"]; // global variable modified by dropzone.js, by my custom functions
    
    try
    {
        if (error != "Please Include ")
        {
            throw new Error(error);
        }
        else
        {
            // need to put data into a saved state because uploading fileSize
            // is asynchronous
            pendingData = data;
            
            $("#create-listing-button").text("Creating...");
            $("#create-listing-button").prop("disabled", false);
            
            // async call, caught in dropzone.success event handler below
            dropzones["create"].processQueue();
        }
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function process_listing()
{
    var data = pendingData;
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "create_listing",
            data: data,
            endpoint: "Listings"
        },
        success: function(res)
        {    
            try
            {
                if (!res)
                {
                    throw new Error("Unable to Create Listing");
                }
                else
                {
                    var listing = JSON.parse(res);
                        
                    if (listing["error"])
                    {
                        throw new Error(listing["error"]);
                    }
                    else
                    {
                        if ($("#accordion").text() == "No Listing Yet")
                        {
                            $("#accordion").html("");
                        }
                        
                        var oid = listing._id.$oid;
                        
                        $("#accordion").append(createAccordionView(oid, listing));
                            
                        var selector = "[id='" + oid + "'] form";
                            
                        createDropzone(oid, selector, listing.Pictures);
                            
                        setGeocompleteTextBox(oid);
                        setTextBoxWithAutoNumeric(oid);
                        setDatePickerTextBox(oid);
                        setBootstrapSwitches(oid); 
                        setTextBoxWithTags(oid);
                        
                        $("#createListingModal").modal('hide');
                        
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-left'});
                        
                        $(".actions a").hide();
                        
                        numUploaded = 0;
                        
                        pendingData = null;
                    }
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
            }
        },
        error: function(res, err)
        {
            try
            {
                throw new Error(res + " " + err);
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
            }
        },
        complete: function()
        {
            $("#create-listing-button").prop("disabled", false);
            $("#create-listing-button").text("Create New Listing");
        }
    });
}

function login()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    try
    {
        if (!username || !password)
        {
            throw new Error("Please enter Username and Password");
        }
        else
        {           
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                beforeSend: function ()
                {
                    $(".login-action").text("Processing...");
                    $(".login-action").prop("disabled", true);
                },
                data:
                {
                    command: "login",
                    data: 
                    {
                        "username": username, 
                        "password": password
                    },
                    user: username,
                    endpoint: "Accounts"
                },
                success: function(res)
                {
                    try
                    {
                        if (contains(res, "Okay"))
                        {
                            if (!contains(res, "Admin"))
                            {
                                quick_logout(); // clears the session variables
                                throw new Error("You Must Be an Admin To Login");
                            }
                            else
                            {
                                location.href="/admin/";
                            }                   
                        }
                        else
                        {
                            throw new Error("Problem Logging In");
                        }
                    }
                    catch(e)
                    {
                        $(".login-error").show();
                        $(".login-error").text(e.message);
                    }
                },
                error: function(res, err)
                {
                    try
                    {
                        throw new Error(res + " " + err);
                    }
                    catch(e)
                    {
                        $(".login-error").show();
                        $(".login-error").text(e.message);
                    }
                },
                complete: function() 
                {
                    $(".login-action").text("Sign In");
                    $(".login-action").prop("disabled", false);
                }
            });
        }
    }
    catch(e)
    {
        $(".login-error").show();
        $(".login-error").text(e.message);
    }
}

function quick_logout()
{
    $.post("/logout.php");
}

function logout()
{
    try
    {
        $.ajax(
        {
            type: "POST",
            url: "/logout.php",
            success: function(res)
            {
                try
                {
                    if (contains(res, "Successfully"))
                    {
                        // TODO: Ideally I'd like this to be a server redirect in PHP, location would
                        // be a POST element, this is good for now
                        location.href = "/admin/login.php";
                    }
                    else
                    {
                        throw new Error("Problem with Logging Out");
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }    
            },
            error: function(err, res)
            {
                try
                {
                    throw new Error(err + " " + res);
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function displayAnalytics(analytics)
{
    var visits = analytics[0];
    var percentNewVisits = parseInt(analytics[1]);
    var uniqueVisits = analytics[2];
    var averageTimeOnSite = parseInt(analytics[3]);
    var averagePageLoad = parseInt(analytics[4]);
    
    var averageTimeFormatted = formattedTime(averageTimeOnSite);
    var averageLoadFormatted = formattedTime(averagePageLoad);
    
    $("#site-visits").text(visits);
    $("#unique-visits").text(uniqueVisits);
    $("#new-visits").text(percentNewVisits + "%");
    $("#average-time-on-site").text(averageTimeFormatted);
    $("#page-download-time").text(averageLoadFormatted);
}

/**********************

UTILITY FUNCTIONS

**********************/

function resetListings()
{
    $("#listing-list tr").not(":first").remove();
    
    getAllListings();
}

function initSpecialFields()
{
    var listing_modal = $("#createListingModal input");
    
    $(listing_modal[0]).geocomplete()
        .bind("geocode:result", function(event, result){
            $($("#createListingModal input[type='hidden']")[0]).val(result.geometry.location.A);
            $($("#createListingModal input[type='hidden']")[1]).val(result.geometry.location.F);
            $($("#createListingModal input[type='hidden']")[2]).val($(listing_modal[0]).val());
        });
        
    $("#createListingModal input[type='checkbox']").not(".type-content input").bootstrapSwitch({onText: "Yes", offText: "No"});
    $("#createListingModal .type-content input").bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
        
    $(listing_modal[1]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(listing_modal[2]).pikaday(
    {
        minDate: new Date(), 
        setDefaultDate: new Date()
    });
}

function initSpecialFieldsUser()
{    
    $("#createListingModal input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function createDropzone(key, element, existingPics)
{
    dropzones[key] = new Dropzone(element,
    {
        addRemoveLinks: true,
        autoProcessQueue: false
    });
    
    var myDropzone = dropzones[key];
    
    myDropzone.on("success", function(file)
    {
        if (numUploaded == this.files.length - 1)
        {
            numUploaded = 0;
            if (pendingData != null)
            {
                process_listing(); 
            }
        }
        else
        {
            numUploaded++;
        }
    });
    
    myDropzone.on("addedfile", function(file) 
    {
        var oid = $(this.element).data("pic-id");
        if (pictures[oid] == null)
        {
            pictures[oid] = [];
        }
        var filename = (file.alreadyUploaded 
                        ? file.name
                        : file.name.split(".")[0] + "_" + Math.random().toString(36).slice(2) + "." + file.name.split(".")[1]);
        pictures[oid].push(filename);
        
        if (!file.alreadyUploaded)
        {
            this.files[this.files.length - 1].serverFileName = filename;
        }
    });
    
    myDropzone.on("removedfile", function(file) 
    {
        var index = this.files.indexOf(file);
        
        var oid = $(this.element).data("pic-id");
        if (pictures[oid] == null)
        {
            pictures[oid] = [];
        }
        pictures[oid].splice(index, 1); 
    });
    
    if (existingPics != null)
    {
        for (var i = 0; i < existingPics.length; i++)
        {
            var mockFile = { name: existingPics[i], alreadyUploaded: true};

            myDropzone.emit("addedfile", mockFile);
            myDropzone.emit("thumbnail", mockFile, "http://images.lbkstudios.net/images/enhabit/images/" + mockFile.name);
            myDropzone.emit("complete", mockFile);
        }
    }
}

function contains(haystack, needle)
{  
    return (haystack.indexOf(needle) != -1)
}

function buildData(inputs, elements)
{   
    var data = {};
    
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i] == "animals" || elements[i] == "laundry" || elements[i] == "parking" 
         || elements[i] == "airConditioning" || elements[i] == "type" || elements[i] == "isactive"
         || elements[i] == "isadmin" || elements[i] == "isverified")
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
        else if (elements[i] == "latitude" || elements[i] == "longitude" || elements[i] == "selected_address")
        {
            data[elements[i]] = $(inputs[i]).val();
        }
        else if (elements[i] == "rent")
        {
            data[elements[i]] = $(inputs[i]).autoNumeric('get');
        }
        else
        {
            if ($(inputs[i]).data("role") == "tagsinput")
            {
                data[elements[i]] = $(inputs[i]).tagsinput("items");
            }
            else if ($(inputs[i]).attr("placeholder") !== "")
            {
                data[elements[i]] = $(inputs[i]).val().trim();
            }
        }
    }
    
    return data;
}

function buildError(fields)
{
    var error_arr = [];
    
    var beginning = "Please Include ";
    
    if (fields.firstname === "")
    {
        error_arr.push("Valid First Name");
    }
    if (fields.lastname === "")
    {
        error_arr.push("Valid Last Name");    
    }
    if (fields.username === "")
    {
        error_arr.push("Valid Username");
    }
    if (fields.address === "" || fields.latitude === "" || fields.longitude === "")
    {
        error_arr.push("Valid Address - Must Select Google's Result");
    }
    if (fields.address !== "" && fields.address !== fields.selected_address)
	{
		error_arr.push("Valid Address - Do Not Modify Google's Result After Selecting");
	}
    if (fields.rent === "")
    {
        error_arr.push("Valid Monthly Rent Amount");
    }
    if (fields.firstname === "")
    {
        error_arr.push("Valid First Name");
    }
    if (fields.lastname === "")
    {
        error_arr.push("Valid Last Name");
    }
    if (fields.email === "" || (fields.email != null && !isValidEmail(fields.email)))
    {
        error_arr.push("Valid Email");
    }
    if (fields.phonenumber === "" || (fields.phonenumber != null && !isValidPhoneNumber(fields.phonenumber)))
    {
        error_arr.push("Valid Phone Number");
    }
    if (fields.start === "")
    {
        error_arr.push("Valid Lease Start Date");
    }
    if (fields.password != "" || fields.confirm != "")
    {
        if (fields.password != fields.confirm)
        {
            error_arr.push("Matching Password and Confirmation");
        }
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
    var parts = dateString.split("T")[0].split("-");
    
    return parts[1] + "/" + parts[2] + "/" + parts[0];
}

function formattedTime(time)
    {
        var hours = parseInt( time / 3600 ) % 24;
        var minutes = parseInt( time / 60 ) % 60;
        var seconds = time % 60;
        
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    }

function createAccordionView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>Address: " + data.Address + "</label>" + 
                            "<label>Rent: $" + data.Price + "/Month</label>" + 
                            "<label>Start Date: " + formattedDate(data.Start) + "</label>" +
                            "<label>University: " + data.University + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Address</label><input type='text' class='form-control' value='" + data.Address + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Unit</label><input type='text' class='form-control' value='" + (data.Unit ? data.Unit : "") + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Rent/Month</label><input type='text' class='form-control' value='" + data.Price + "' />" + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Start Date</label><input type='text' class='form-control' value='" + formattedDate(data.Start) + "' />" +
                            "</div>" +                          
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label><input type='text' class='form-control' value='" + data.University + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Tags (Optional)</label><input type='text' class='form-control' value='" + (data.Tags ? data.Tags.join(",") : "") + "' data-role='tagsinput' />" + 
                            "</div>" + 
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Animals</label><input type='checkbox' " + (data.HasAnimals ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Laundry</label><input type='checkbox' " + (data.HasLaundry ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Parking</label><input type='checkbox' " + (data.HasParking ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>AC</label><input type='checkbox' " + (data.HasAirConditioning ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Type</label><input type='checkbox' " + (data.Type == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Images (Will Upload Upon Submit)</label>" +
                                "<form action='/Libraries/upload_file.php' data-pic-id='" + oid + "' class='dropzone'></form>" +
                            "</div>" + 
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary' onclick='update_listing(\"" + oid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='delete_listing(\"" + oid + "\");'>Delete</button>" +
                            "</div>" +
                        "</div>" +
                        "<input type='hidden' value='" + data.WorldCoordinates.x + "' /><input type='hidden' value='" + data.WorldCoordinates.y + "' /><input type='hidden' value='" + data.Address + "' />" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function createAccordionUsersView(uid, data)
{           
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + uid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + uid + "' aria-expanded='false' aria-controls='" + uid + "'>" +
                            "<label>Username: " + data.Username + "</label>" + 
                            "<label>First Name: " + data.FirstName + "</label>" + 
                            "<label>Last Name: " + data.LastName + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + uid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + uid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Username</label><input type='text' class='form-control' value='" + data.Username + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>First Name</label><input type='text' class='form-control' value='" + data.FirstName + "' />" + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Last Name</label><input type='text' class='form-control' value='" + data.LastName + "' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Admin</label><br><input type='checkbox' " + (data.IsAdmin ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Phone Number</label><input type='text' class='form-control' value='" + data.PhoneNumber + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Email Address</label><input type='text' class='form-control' value='" + data.Email + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Active</label><br><input type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini' />" + 
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Verified</label><br><input type='checkbox' " + (data.IsVerified ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary' onclick='update_user(\"" + uid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='delete_user(\"" + uid + "\");'>Delete</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function createAccordionPaymentsView(oid, data)
{           
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        
                    "</div>" +
                "</div>" +
            "</div>";
}
