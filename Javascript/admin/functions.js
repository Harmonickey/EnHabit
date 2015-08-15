
/**********************

EVENT HANDLERS

**********************/

var savedUsername = "";
var pendingData = null;
var numUploaded = {};
var numAdded = {};
var pendingUpdateData = null;

$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});

function getAllUsersAndLandlords()
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
                    if (res && !contains(res, "No Users"))
                    {             
                        var data = JSON.parse(res);
                        
                        for (var i = 0; i < data.length; i++)
                        {
                            if (data[i].IsLandlord)
                            {
                                landlordList.push(data[i].Username)
                            }
                            else
                            {
                                userList.push(data[i].Username);
                            }
                        }
                        
                        $($("#createListingModal .ui-widget input")[0]).autocomplete({
                           source: function(request, response) {
                                var results = $.ui.autocomplete.filter(landlordList, request.term);

                                response(results.slice(0, 5)); // limit to 5 results at a time
                            } 
                        });
                        
                        $($("#createListingModal .ui-widget input")[1]).autocomplete({
                           source: function(request, response) {
                                var results = $.ui.autocomplete.filter(userList, request.term);

                                response(results.slice(0, 5)); // limit to 5 results at a time
                            }
                        });
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function getAllUsers()
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
                        $("#accordion").html("");
                
                        var data = JSON.parse(res);
                        
                        for (var i = 0; i < data.length; i++)
                        {
                            var uid = data[i]._id.$oid;
                           
                            //fill in all user data
                            $("#accordion").append(createAccordionUsersView(uid, data[i]));
                            
                            setBootstrapSwitchesForUsers(uid);
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    $(".actions a").show();
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                                
                                added_files[oid] = false;
                            }
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    $(".actions a").show();
                }
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    $(".actions a").show();
                }    
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                $(".actions a").show();
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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

function update_account(uid)
{
    var userfield = $("#" + uid + " input");
    
    var data = buildData(userfield, ["username", "firstname", "lastname", "phonenumber", "password", "confirm", "email", "isactive", "isverified", "islandlord", "isadmin"]);
    
    data.id = uid;
    
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
                    $("#" + uid + " button").prop("disabled", true);
                    $($("#" + uid + " button")[0]).text("Updating...");
                },
                data:
                {
                    command: "update_account",
                    endpoint: "Accounts",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update User", position: 'top-center'});
                        }
                        else if (contains(res, "Okay"))
                        {
                            var inputs = $("#" + uid + " input");
                            var headingInputs = $("#heading" + uid + " label");
                            
                            $(headingInputs[0]).text("Username: " + $(inputs[0]).val());
                            $(headingInputs[1]).text("First Name: " + $(inputs[1]).val());
                            $(headingInputs[2]).text("Last Name: " + $(inputs[2]).val());
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                            
                            // close the div
                            $("#heading" + uid + " a").click();
                        }
                        else
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                },
                complete: function()
                {
                    $("#" + uid + " button").prop("disabled", false);
                    $($("#" + uid + " button")[0]).text("Update");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
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
    
    $(row[2]).geocomplete()
        .bind("geocode:result", function(event, result){
            $(hidden[0]).val(result.geometry.location.A);
            $(hidden[1]).val(result.geometry.location.F);
            $(hidden[2]).val($(row[2]).val());
        });
}

function setTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
    $(row[4]).autoNumeric('init', 
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
    $($("#" + rowId + " input[type='text']")[5]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[3]).val()) //current
    });
}

function update_listing(oid)
{
    var inputs = $("#" + oid + " input").not(":eq(10)");
    
    var data = buildData(inputs, ["user", "landlord", "address", "unit", "rent", "start", "university", "bedrooms", "bathrooms", "tags", "animals", "laundry", "parking", "airConditioning", "type", "latitude", "longitude", "selected_address"]);
    
    //first validate that the fields are filled out
    var error = buildError(data);
    
    data.id = oid;
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
            pendingUpdateData = data;
            
            $($("#" + oid + " button")[0]).text("Updating...");
            $("#" + oid + " button").prop("disabled", true);
            
            dropzones[oid].processQueue();
            
            if (added_files[oid] == false)
            {
                process_listing();
            }
        }
    }
    catch(e)
    {
        $($("#" + oid + " button")[0]).text("Update");
        $("#" + oid + " button").prop("disabled", false);
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function delete_account(uid)
{
    $.msgbox("<p>Are you sure you want to delete your account?<br>Please Enter your Password to Confirm.</p>", {
        type    : "prompt",
        inputs  : [
          {type: "password", label: "Password:", required: true}
        ],
        buttons : [
          {type: "submit", value: "OK"},
          {type: "cancel", value: "Cancel"}
        ]
    }, function(password) {
        
        var data = {"password": password, "id": uid};
        
        try
        {
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                beforeSend: function()
                {
                    $("#" + uid + " button").prop("disabled", true);
                    $($("#" + uid + " button")[1]).text("Deleting...");
                },
                data:
                {
                    command: "delete_account",
                    endpoint: "Accounts",
                    data: data
                },
                success: function(res)
                {
                    if (contains(res, "Okay"))
                    {
                        // remove the row that we just selected
                        $("#" + uid).parent().remove();
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
                complete: function()
                {
                    $("#" + uid + " button").prop("disabled", false);
                    $($("#" + uid + " button")[1]).text("Delete");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                        data: { oid: oid },
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
                                $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'top-center'});
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
                            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                        }
                    }
                });
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        }
    });
}

function create_account()
{
    var userfield = $("#createUserModal input");
    
    var data = buildData(userfield, ["username", "password", "confirm", "firstname", "lastname", "email", "phonenumber", "islandlord", "isactive", "isverified", "isadmin"]);
    
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
                    command: "create_account",
                    endpoint: "Accounts",
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
                                
                                setBootstrapSwitchesForUsers(uid);
                                
                                $("#createUserModal").modal('hide');
                                
                                $.msgGrowl ({ type: 'success', title: 'Success', text: "User Created Successfully!", position: 'top-center'});
                            }
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                },
                complete: function()
                {
                    $("#create-user-button").text("Create User");
                    $("#create-user-button").prop("disabled", false);
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    }
}

function create_listing()
{
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(15)");
    
    var data = buildData(inputs, ["address", "unit", "rent", "start", "university", "bedrooms", "bathrooms", "animals", "laundry", "parking", "airConditioning", "type", "landlord", "user", "tags", "latitude", "longitude", "selected_address"]);
    
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
            $("#create-listing-button").prop("disabled", true);
            
            // async call, caught in dropzone.success event handler below
            dropzones["create"].processQueue();
        }
    }
    catch(e)
    {
        $("#create-listing-button").prop("disabled", false);
        $("#create-listing-button").text("Create Listing");
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function process_listing()
{
    if (pendingData == null && pendingUpdateData == null)
    {
        return;
    }
    
    if (pendingData != null)
    {
        // create listing
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "create_listing",
                data: pendingData,
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
                            setTextBoxWithTags(oid)
                            
                            $("#createListingModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center'});
                            
                            $(".actions a").hide();
                            
                            numUploaded = 0;
                            
                            pendingData = null;
                        }
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                }
            },
            complete: function()
            {
                $("#create-listing-button").prop("disabled", false);
                $("#create-listing-button").text("Create Listing");
            }
        });
    }
    else if (pendingUpdateData != null)
    {
        var id = pendingUpdateData.id;
        added_files[id] = false;
        
        // update listing
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "update_listing",
                data: pendingUpdateData,
                endpoint: "Listings"
            },
            success: function(res)
            { 
                try
                {
                    if (contains(res, "Okay"))
                    {
                        var inputs = $("#" + id + " input");
                        var headingInputs = $("#heading" + id + " label");
                        
                        $(headingInputs[0]).text("Address: " + $(inputs[2]).val());
                        $(headingInputs[1]).text("Unit: " + $(inputs[3]).val());
                        $(headingInputs[2]).text("Rent: $" + $(inputs[4]).autoNumeric('get') + "/Month");
                        $(headingInputs[3]).text("Start Date: " + $.datepicker.formatDate('mm/dd/yy', new Date($(inputs[5]).val())));
                        $(headingInputs[4]).text("University: " + $(inputs[6]).val());
                        
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                        numUploaded = 0;
                        
                        pendingUpdateData = null;
                        
                        // close the div
                        $("#heading" + id + " a").click();
                    }
                    else
                    {
                        throw new Error("Problem Updating Listing");
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    numUploaded = 0;
                }
            },
            error: function(err, res)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            },
            complete: function()
            {
                $("#" + id + " button").prop("disabled", false);
                $($("#" + id + " button")[0]).text("Update");
            }
        });
    }
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                }
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
            var hiddenFields = $("#createListingModal input[type='hidden']");
            var keys = Object.keys(result.geometry.location);
            $(hiddenFields[0]).val(result.geometry.location[keys[0]]);
            $(hiddenFields[1]).val(result.geometry.location[keys[1]]);
            $(hiddenFields[2]).val($(listing_modal[0]).val());
        });
    
    $("#createListingModal input[type='checkbox']").not(".type-content input").bootstrapSwitch({onText: "Yes", offText: "No"});
    $("#createListingModal .type-content input").bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
    
    $(listing_modal[2]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(listing_modal[3]).pikaday(
    {
        minDate: new Date(),
        setDefaultDate: new Date()
    });
         
    $("#createListingModal .bootstrap-tagsinput").addClass("form-control");
}

function initSpecialFieldsUser()
{    
    $("#createUserModal input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
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
        var oid = $(this.element).data("pic-id");
        if (numUploaded[oid] == numAdded[oid] - 1)
        {
            numUploaded[oid] = 0;
            numAdded[oid] = 0;
            process_listing(); 
        }
        else
        {
            numUploaded[oid]++;
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
                        : (file.name.split(".").length > 1 ? file.name.split(".")[0] + "_" + Math.random().toString(36).slice(2) + "." + file.name.split(".")[file.name.split(".").length - 1]
                                                           : Math.random().toString(36).slice(2) + "_" + file.name));
        pictures[oid].push(filename);
        
        if (!file.alreadyUploaded)
        {
            this.files[this.files.length - 1].serverFileName = filename;
        }
        
        added_files[oid] = true;
        
        numAdded[oid]++;
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
        
        numAdded[oid]--;
        
        if (numAdded[oid] < 0)
        {
            added_files[oid] = false;
            numAdded[oid] = 0;
        }
    });
    
    numAdded[key] = 0;
    numUploaded[key] = 0;
    if (existingPics != null)
    {
        for (var i = 0; i < existingPics.length; i++)
        {
            var mockFile = { name: existingPics[i], alreadyUploaded: true};

            myDropzone.emit("addedfile", mockFile);
            numAdded[key]--;
            myDropzone.emit("thumbnail", mockFile, "http://images.lbkstudios.net/enhabit/images/" + mockFile.name);
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
         || elements[i] == "isadmin" || elements[i] == "isverified" || elements[i] == "islandlord")
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
    if (fields.user === "" && fields.landlord === "")
    {
        error_arr.push("Either a Tenant and/or Landlord");
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
                            (data.Unit ? "<label>Unit: " + data.Unit + "</label>" : "") +
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
                                "<label>User</label><input type='text' class='form-control' value='" + data.Username + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Landlord</label><input type='text' class='form-control' value='" + data.Landlord + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Address</label><input type='text' class='form-control' value='" + data.Address + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-1 col-md-1 col-sm-1'>" +
                                "<label>Unit</label><input type='text' class='form-control' value='" + (data.Unit ? data.Unit : "") + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Rent/Month</label><input type='text' class='form-control' value='" + data.Price + "' />" + 
                            "</div>" +                
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Start Date</label><input type='text' class='form-control' value='" + formattedDate(data.Start) + "' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label><input type='text' class='form-control' value='" + data.University + "' />" +
                            "</div>" + 
                            "<div class='col-lg-1 col-md-1 col-sm-1'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-1 col-md-1 col-sm-1'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
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
                                "<form action='http://images.lbkstudios.net/enhabit/upload_file.php' data-pic-id='" + oid + "' class='dropzone'></form>" +
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
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Username</label><input type='text' class='form-control' value='" + data.Username + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>First Name</label><input type='text' class='form-control' value='" + data.FirstName + "' />" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Last Name</label><input type='text' class='form-control' value='" + data.LastName + "' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Phone Number</label><input type='text' class='form-control' value='" + data.PhoneNumber + "' />" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Password</label><input type='password' class='form-control' />" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Confirm Password</label><input type='password' class='form-control' />" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row'>" +
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Email Address</label><input type='text' class='form-control' value='" + data.Email + "' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Active</label><br><input type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini' />" + 
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Verified</label><br><input type='checkbox' " + (data.IsVerified ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Landlord</label><br><input type='checkbox' " + (data.IsLandlord ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Admin</label><br><input type='checkbox' " + (data.IsAdmin ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary' onclick='update_account(\"" + uid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='delete_account(\"" + uid + "\");'>Delete</button>" +
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
