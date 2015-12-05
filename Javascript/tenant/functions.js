
/**********************

EVENT HANDLERS

**********************/

var savedUsername = "";
var pendingData = null;
var numUploaded = 0;
var numAdded = 0;
var pendingUpdateData = null;

$(function() {
   var height = $("html").outerHeight(true) - $(".navbar").outerHeight(true) - $(".subnavbar").outerHeight(true) - $(".footer").outerHeight(true);
   
   $(".main").css("min-height", height + "px");
   
   if ($.fn.lightbox) {
        $('.ui-lightbox').lightbox();
    }
});

$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});

function GetRenter()
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
            command: "get_renter",
            endpoint: "Renters"
        },
        success: function(res) 
        {
            try
            {
                if (!res || Contains(res, "No Payment"))
                {
                    throw new Error("No Payment");              
                }
                else
                {
                    $("#payment").html("");
                    
                    var data = JSON.parse(res);
                    
                    if (Contains(res, "Error"))
                    {
                        throw new Error(res);
                    }
                    else
                    {
                        var oid = data._id.$oid;
                            
                        GetPayKey();
                    }                       
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                $("#payment").html("<p>" + e.message + "</p>");
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            $("#payment").html("<p>No Payment</p>");
        }
    });
}

function GetAllListings()
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
                    throw new Error("No Listings Found");
                    $("#accordion").html("<p>No Listing Yet</p>");
                    $(".listings-message").hide();
                    $(".actions a").show();                      
                }
                else if (Contains(res, "No Matching Entries"))
                {
                    $("#accordion").html("<p>No Listing Yet</p>");
                    $(".listings-message").hide();
                    $(".actions a").show();
                }
                else
                {
                    $("#accordion").html("");
                    
                    var data = JSON.parse(res);
                    
                    if (Contains(res, "Error"))
                    {
                        throw new Error(res);
                        $(".actions a").show();
                        $(".listings-message").hide();
                    }
                    else
                    {
                        for (var i = 0; i < data.length; i++)
                        {
                            var oid = data[i]._id.$oid;
                            
                            $("#accordion").append(CreateAccordionView(oid, data[i]));
                            
                            var selector = "[id='" + oid + "'] form";
                            
                            CreateDropzone(oid, selector, data[i].Pictures);
                                
                            SetGeocompleteTextBox(oid);
                            SetTextBoxWithAutoNumeric(oid);
                            SetDatePickerTextBox(oid);
                            SetBootstrapSwitches(oid);
                            
                            addedFiles[oid] = false;
                            $(".listings-message").show();
                        }
                        
                        if (data.length == 0)
                        {
                            $(".actions a").show();
                            $(".listings-message").hide();
                        }
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function GetAllLandlords()
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
                if (res && !Contains(res, "No Users"))
                {             
                    var data = JSON.parse(res);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        if (data[i].IsLandlord)
                        {
                            landlordList.push(data[i].Username)
                        }
                    }
                    
                    $.each(landlordList, function(index, landlord)
                    {
                        $("#landlords-filter").append("<option value='" + landlord + "'>" + landlord + "</option>")
                    });
                    
                    GetAllListings();
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function GetAccount(isListingPage)
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $(".account").prepend("<i class='fa fa-spinner fa-pulse' />");
        },
        data: 
        {
            command: "get_user_info",
            endpoint: "Accounts"
        },
        success: function(res) 
        {
            try
            {
                if (!res || Contains(res, "Could Not Find User"))
                {
                    throw new Error("Unable to retrieve account info");
                }
                else
                {
                    $(".account .fa-spinner").remove();

                    var data = JSON.parse(res);
                    
                    if (Contains(res, "Error"))
                    {
                        throw new Error(res);
                    }
                    else
                    {
                        if (isListingPage)
                        {
                            HandleCreateListingButton(data);
                        }
                        else
                        {
                            FillAccountInfo(data);
                        }
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        },
        complete: function()
        {
            $(".account .fa-spinner").remove();
        }
    });
}

function HandleCreateListingButton(data)
{
    if (Contains(data.Username, "Facebook"))
    {
        $("#create-listing-button").remove(); // create listing button
        $("#createListingModal").remove(); // create listing modal
        $("#create-listing-warning").show();
    }
}

function SetBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":eq(5)").bootstrapSwitch({onText: "Yes", offText: "No"});
    //$(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Apartment", offText: "House"});
}

function SetGeocompleteTextBox(rowId)
{
    var row = $("#" + rowId + " div input[type='text']");
    var hidden = $("#" + rowId + " input[type='hidden']");
    
    $(row[0]).geocomplete()
        .bind("geocode:result", function(event, result){
            var keys = Object.keys(result.geometry.location);
            $(hidden[0]).val(result.geometry.location[keys[0]]);
            $(hidden[1]).val(result.geometry.location[keys[1]]);
            $(hidden[2]).val($(row[0]).val());
        });
}

function SetTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
    $(row[2]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[3]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[2]).val()) //current
    });
}

function FillAccountInfo(data)
{
    var inputs = $(".account input");
    
    // this only skips with facebook accounts
    if (!Contains(data["Username"], "Facebook"))
    {
        $(inputs[0]).val(data["Username"]);
    }
    savedUsername = data["Username"];
    
    // and, this only skips with facebook accounts too
    if (Contains(data["Email"], "@"))
    {
        $(inputs[1]).val(data["Email"]);
    }
    $(inputs[2]).val(data["FirstName"]);
    $(inputs[3]).val(data["LastName"]);
    
    if (Contains(data["PhoneNumber"], "-"))
    {
        $(inputs[4]).val(data["PhoneNumber"]);
    }
}

function DeleteListing(id)
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
                url: "/api.php",
                beforeSend: function()
                {
                    $("#" + id + " button").prop("disabled", true);
                    $($("#" + id + " button")[1]).text("Deleting...");
                },
                data:
                {
                    command: "delete_listing",
                    data:
                    {
                        id: id
                    },
                    endpoint: "Listings"
                },
                success: function(res)
                {
                    try
                    {
                        if (Contains(res, "Okay"))
                        {
                            // remove the row that we just selected
                            $("#" + id).parent().remove();
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'top-center'});
                            $(".actions a").show();
                            $("#accordion").text("No Listing Yet");
                        }
                        else
                        {
                            throw new Error("Problem Deleting Listing");
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                        $("#" + id + " button").prop("disabled", false);
                        $($("#" + id + " button")[1]).text("Delete");
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                    $("#" + id + " button").prop("disabled", false);
                    $($("#" + id + " button")[1]).text("Delete");
                }
            });
        }
    });
}

function GetAllUniversities()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
            command: "get_all_universities",
            endpoint: "Universities"
        },
        success: function(res) 
        {
            try
            {
                if (res && !Contains(res, "No Universities"))
                {             
                    var data = JSON.parse(res);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        universitiesList.push(data[i].UniversityName);
                        $("#universities-filter").append("<option value='" + data[i].UniversityName + "'>" + data[i].UniversityName + "</option>");
                    }
                    
                    GetAllLandlords();
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });     
}

function UpdateListing(id)
{
    var inputs = $("#" + id + " input, #" + id + " select, #" + id + " textarea");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "University", "Animals", "Laundry", "Parking", "AirConditioning", "IsRented", "BuildingType", "IsActive", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    data.id = id;
    //data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
    data.BuildingType = (data.BuildingType == true ? "apartment" : "house");
    data.Address = data.Address.split(",")[0];
    data.Start = $.datepicker.formatDate('mm/dd/yy', new Date(data.Start));
    data.Pictures = pictures[id];
    
    try
    {
        if (error != "Please Include ")
        {
            throw new Error(error);
        }
        else
        { 
            pendingUpdateData = data;
            
            $($("#" + id + " button")[0]).text("Updating...");
            $("#" + id + " button").prop("disabled", true);
            
            dropzones[id].processQueue();
            
            if (addedFiles[id] == false)
            {             
                ProcessListing();
            }
        }
    }
    catch(e)
    {
        $($("#" + id + " button")[0]).text("Update");
        $("#" + id + " button").prop("disabled", false);
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function CreateListing()
{   
    var inputs = $("#createListingModal input, #createListingModal select, #createListingModal textarea");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "Landlord", "University", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    var error = BuildError(data);
    
    //data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
    data.BuildingType = (data.BuildingType == true ? "apartment" : "house");
    data.Address = data.Address.split(",")[0];
    data.Start = $.datepicker.formatDate('mm/dd/yy', new Date(data.Start));
    data.Pictures = pictures["create"]; // global variable modified by dropzone.js, by my custom functions
    
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
            if (numAdded == 0)
            {
                ProcessListing();
            }
            else
            {
                dropzones["create"].processQueue();
            }
        }
    }
    catch(e)
    {
        $("#create-listing-button").prop("disabled", false);
        $("#create-listing-button").text("Create Listing");
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function ProcessListing()
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
                            var userId = listing.UserId;
                            
                            $("#accordion").append(CreateAccordionView(oid, listing));
                                
                            var selector = "[id='" + oid + "'] form";
                                
                            CreateDropzone(oid, selector, listing.Pictures);
                                
                            SetGeocompleteTextBox(oid);
                            SetTextBoxWithAutoNumeric(oid);
                            SetDatePickerTextBox(oid);
                            SetBootstrapSwitches(oid);
                            
                            $("#createListingModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center'});
                            
                            $(".actions a").hide();
                            $(".listings-message").show();
                            
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
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            },
            complete: function()
            {
                $("#create-listing-button").prop("disabled", false);
                $("#create-listing-button").text("Create Listing");
                
                dropzones["create"].destroy();
                
                CreateDropzone("create", "#createListingModal form");
            }
        });
    }
    else if (pendingUpdateData != null)
    {
        var id = pendingUpdateData.id;
        
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
            beforeSend: function()
            {
                $("#" + id + " button").prop("disabled", true);
                $($("#" + id + " button")[0]).text("Updating...");
            },
            success: function(res)
            { 
                try
                {
                    if (Contains(res, "Okay"))
                    {
                        var inputs = $("#" + id + " input");
                        var headingInputs = $("#heading" + id + " label");
                        
                        $(headingInputs[0]).text("Address: " + $(inputs[0]).val());
                        $(headingInputs[1]).text("Unit: " + $(inputs[1]).val());
                        $(headingInputs[2]).text("Rent: $" + $(inputs[2]).autoNumeric('get') + "/Month");
                        $(headingInputs[3]).text("Start Date: " + $.datepicker.formatDate('mm/dd/yy', new Date($(inputs[3]).val())));
                        
                        if (addedFiles[id])
                        {
                            $("#" + id + " .activecheckbox").prop("disabled", false);
                            $("#" + id + " .activecheckbox").parent().parent().removeClass("bootstrap-switch-disabled");
                        }
                        else if (pictures[id].length == 0)
                        {
                            $("#" + id + " .activecheckbox").prop("disabled", true);
                            $("#" + id + " .activecheckbox").parent().parent().addClass("bootstrap-switch-disabled");
                        }
                        
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                        numUploaded = 0;
                        addedFiles[id] = false;
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
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            },
            complete: function()
            {
                $("#" + id + " button").prop("disabled", false);
                $($("#" + id + " button")[0]).text("Update");
                numUploaded = 0;
                addedFiles[id] = false;
                pendingUpdateData = null;
            }
        });
    }
}

function Login()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    try
    {
        if (!username || !password)
        {
            throw new Error("Please Include Username and Password");
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
                        "Username": username, 
                        "Password": password
                    },
                    user: username,
                    endpoint: "Accounts"
                },
                success: function(res)
                {
                    try
                    {
                        if (Contains(res, "Okay"))
                        {
                            if (Contains(res, "Landlord"))
                            {
                                QuickLogout(); // clears the session variables
                                throw new Error("Landlords Cannot Login to Tenant Portal");
                            }
                            else
                            {
                                location.href="/tenant/listings/"
                            }
                        }
                        else
                        {
                            throw new Error(res);
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
                        throw new Error(res);
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

function QuickLogout()
{
    $.post("/logout.php");
}

function Logout()
{
    $.ajax(
    {
        type: "POST",
        url: "/logout.php",
        success: function(res)
        {
            try
            {
                if (Contains(res, "Successfully"))
                {
                    // TODO: Ideally I'd like this to be a server redirect in PHP, location would
                    // be a POST element, this is good for now
                    location.href = "/";
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
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}


function UpdateAccount()
{
    var inputs = $(".account input");
    
    var data = BuildData(inputs, ["Username", "Email", "FirstName", "LastName", "PhoneNumber", "Password", "Confirm"]);
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    try
    {
        if (error != "Please Include ")
        {
            throw new Error(error);
        }
        else
        {
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                data:
                {
                    command: "update_account",
                    data: data,
                    endpoint: "Accounts"
                },
                beforeSend: function()
                {
                    $(".account button").prop("disabled", true);
                    $($(".account button")[0]).text("Updating...");
                },
                success: function(res)
                { 
                    try
                    {
                        if (Contains(res, "Okay"))
                        {
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Account", position: 'top-center'});
                            $("#title_username").html("<i class='fa fa-user'></i>" + data.Username + "<b class='caret'></b>");
                        }
                        else
                        {
                            throw new Error("Problem Updating Account");
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                },
                complete: function()
                {
                    $(".account button").prop("disabled", false);
                    $($(".account button")[0]).text("Update Account");
                }
            });
        }
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function DeleteAccount()
{
    //check if the user really wants to do so
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
        
        var data = {"Password": password};
        
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                $(".account button").prop("disabled", true);
                $($(".account button")[1]).text("Deleting...");
            },
            data:
            {
                command: "delete_account",
                data: data,
                endpoint: "Accounts"
            },
            success: function(res)
            {
                try
                {
                    if (Contains(res, "Okay"))
                    {
                        Logout();
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            },
            complete: function()
            {
                $(".account button").prop("disabled", false);
                $($(".account button")[1]).text("Delete");
            }
        });
    });
}

function MakeAdaptivePayment(uid)
{
    var rent = $("#" + uid + " .rent").text().replace("$", "");
    var landlordEmail = $("#" + uid + " .landlordEmail").text();
    
    var data = 
    {
        "Rent": rent,
        "LandlordEmail": landlordEmail
    };
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $(".adaptive-payment button").prop("disabled", true);
            $($(".adaptive-payment button")[1]).text("Deleting...");
        },
        data:
        {
            command: "adaptive_payment",
            data: data,
            endpoint: "Payments"
        },
        success: function(res)
        {
            try
            {
                var data = JSON.parse(res);
                
                if (data["error"])
                {
                   throw Error("Unable to Process Payment"); 
                }
                else
                {
                    var paykey = data["PayKey"];
                    
                    var href = $("#paypal-adaptive").attr("onclick", "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=" + paykey);
                    
                    $("#paypal-adaptive").click();
                }
                else
                {
                    throw new Error(res);
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        },
        complete: function()
        {
            $(".adaptive-payment button").prop("disabled", false);
            $($(".adaptive-payment button")[1]).text("Delete");
        }
    });
}

function OpenPaymentModal(uid)
{
    $("#createPaymentModal").modal('show');
    
    $("#pay-now").attr("onclick", "MakePayment('" + uid + "')");
}

function MakePayment(uid)
{
    var rent = $("#" + uid + " .rent").text().replace("$", "");
    var description = "Payment from Enhabit System";
    var landlordEmail = $("#" + uid + " .landlordEmail").text();
    
    // call from my custom payment library
    if (IsValidSubmission())
    {
        ProcessPayment(uid, rent, description, landlordEmail);
    }
}

/**********************

UTILITY FUNCTIONS

**********************/

function ResetListings()
{
    $("#listing-list tr").not(":first").remove();
    
    GetAllListings();
}

function InitSpecialFields()
{
    var listingModal = $("#createListingModal input");
    
    $(listingModal[0]).geocomplete()
        .bind("geocode:result", function(event, result){
            var hiddenFields = $("#createListingModal input[type='hidden']");
            var keys = Object.keys(result.geometry.location);
            $(hiddenFields[0]).val(result.geometry.location[keys[0]]);
            $(hiddenFields[1]).val(result.geometry.location[keys[1]]);
            $(hiddenFields[2]).val($(listingModal[0]).val());
        });
        
    $("#createListingModal input[type='checkbox']").not(".type-content input").bootstrapSwitch({onText: "Yes", offText: "No"});
    //$($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Rental", offText: "Sublet", 'state': true, 'setState': true});
    //$($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Apartment", offText: "House", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
    
    $(listingModal[2]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(listingModal[3]).pikaday(
    {
        minDate: new Date(), 
        setDefaultDate: new Date()
    });
}

function CreateDropzone(key, element, existingPics)
{
    dropzones[key] = new Dropzone(element,
    {
        addRemoveLinks: true,
        autoProcessQueue: false
    });
    
    var myDropzone = dropzones[key];
    
    myDropzone.on("success", function(file)
    {   
        if (numUploaded == numAdded - 1)
        {
            numUploaded = 0;
            numAdded = 0;
            $(".dz-progress").remove();
            ProcessListing(); 
        }
        else
        {
            numUploaded++;
            $(".dz-progress").remove();
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
        
        addedFiles[oid] = true;
        
        numAdded++;
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
        
        numAdded--;
        
        if (numAdded < 0)
        {
            addedFiles[oid] = false;
            numAdded = 0;
        }
    });
    
    if (existingPics != null)
    {
        for (var i = 0; i < existingPics.length; i++)
        {
            var mockFile = { name: existingPics[i], alreadyUploaded: true};

            myDropzone.emit("addedfile", mockFile);
            numAdded--;
            myDropzone.emit("thumbnail", mockFile, "/images/enhabit/images/" + mockFile.name);
            myDropzone.emit("complete", mockFile);
        }
    }
}

function Contains(haystack, needle)
{  
    return (haystack.indexOf(needle) != -1)
}

function BuildData(inputs, elements)
{   
    var data = {};
    
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i] == "Animals" || elements[i] == "Laundry" || elements[i] == "Parking" 
         || elements[i] == "AirConditioning" || elements[i] == "IsRented" || elements[i] == "LeaseType" || elements[i] == "BuildingType" || elements[i] == "IsActive")
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University")
        {
            data[elements[i]] = $(inputs[i]).val().replace("'", "&#39;").replace("\"", "&#34;");
        }
        else if (elements[i] == "Rent")
        {
            data[elements[i]] = $(inputs[i]).autoNumeric('get');
        }
        else
        {
            if ($(inputs[i]).attr("placeholder") !== "")
            {
                data[elements[i]] = $(inputs[i]).val().trim();
            }
        }
    }
    
    return data;
}

function BuildError(fields)
{
    var errorArr = [];
    
    var beginning = "Please Include ";
    
    if (fields.Username === "")
    {
        errorArr.push("Valid Username");
    }
    if (fields.Address === "" || fields.Latitude === "" || fields.Longitude === "")
    {
        errorArr.push("Valid Address - Must Select Google's Result");
    }
    if (fields.Address !== "" && fields.Address !== fields.SelectedAddress)
	{
		errorArr.push("Valid Address - Do Not Modify Google's Result After Selecting");
	}
    if (fields.Rent === "")
    {
        errorArr.push("Valid Monthly Rent Amount");
    }
    if (fields.FirstName === "")
    {
        errorArr.push("Valid First Name");
    }
    if (fields.LastName === "")
    {
        errorArr.push("Valid Last Name");
    }
    if (fields.Email === "" || (fields.Email !== undefined && !IsValidEmail(fields.Email)))
    {
        errorArr.push("Valid Email");
    }
    if (fields.PhoneNumber !== "" && fields.PhoneNumber !== undefined)
    {
        if (!IsValidPhoneNumber(fields.PhoneNumber))
        {
            errorArr.push("Valid Phone Number");
        }
    }
    if (fields.Start === "")
    {
        errorArr.push("Valid Lease Start Date");
    }
    if (fields.Password !== "" || fields.Confirm !== "")
    {
        if (fields.Password != fields.Confirm)
        {
            errorArr.push("Matching Password and Confirmation");
        }
    }
    if (errorArr.length > 0)
    {
        if (errorArr.length == 1)
        {
            return beginning + errorArr[0];
        }
        else
        {
            var last = " and " + errorArr[errorArr.length - 1];
            errorArr.splice(errorArr.length - 1, 1);
            
            return beginning + errorArr.join(", ") + last;
        }
    }
    
    return beginning;
}

function IsValidEmail(em)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(em);
}

function IsValidPhoneNumber(pn)
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

function DisableButtons()
{
    $("button").prop("disabled", true);
}

function EnableButtons()
{
    $("button").prop("disabled", false);
}

function FormattedDate(dateString)
{
    var parts = dateString.split("T")[0].split("-");
    
    return parts[1] + "/" + parts[2] + "/" + parts[0];
}

function CreateAccordionView(oid, data)
{   
    var landlords = "";
    $.each(landlordList, function(index, landlord) {
        landlords += "<option value='" + landlord + "'" + (data.Landlord == landlord ? "selected" : "") + ">" + landlord + "</option>";
    });
    
    var universities = "";
    $.each(universitiesList, function(index, university) {
        universities += "<option value='" + university + "'" + (data.University == university ? "selected" : "") + ">" + university + "</option>";
    });
    
    var notes = data.Notes.replace("#39", "'").replace("#34", "\"");

    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>Address: " + data.Address + "</label>" + 
                            (data.Unit ? "<label>Unit: " + data.Unit + "</label>" : "") +
                            "<label>Rent: $" + data.Price + "/Month</label>" + 
                            "<label>Start Date: " + FormattedDate(data.Start) + "</label>" +
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
                                "<label>Start Date</label><input type='text' class='form-control' value='" + FormattedDate(data.Start) + "' />" +
                            "</div>" + 
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label>" + 
                                "<select class='form-control'>" + universities + "</select>" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px'>" +
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
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Is Rented</label><input type='checkbox' " + (data.IsRented ? "checked" : "") + " data-size='mini' disabled/>" +
                            "</div>" + 
                            //"<div class='col-lg-3 col-md-3 col-sm-3'>" +
                            //    "<label>Lease Type</label><input type='checkbox' " + (data.LeaseType == "rental" //? "checked" : "") + " data-size='mini' />" +
                            //"</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Building Type</label><input type='checkbox' " + (data.BuildingType == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px'>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Listing Active</label><input class='activecheckbox' type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini'" + (data.Pictures == null || data.Pictures.length == 0 ? "disabled" : "") + "/>" +
                            "</div>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.Pictures == null || data.Pictures.length == 0 ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing You Must Include Images!</label>" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Landlord</label>" + 
                                "<select class='form-control'>" + landlords + "</select>" +
                            "</div>" + 
                        "</div>" +
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Info</label><textarea rows='4' cols='50' class='form-control' >" + (data.Notes ? notes : "") + "</textarea>" +
                            "</div>" + 
                        "</div>" +
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Images (Will Upload Upon Submit)</label>" +
                                "<form action='/images/enhabit/upload_file.php' data-pic-id='" + oid + "' class='dropzone'></form>" +
                            "</div>" + 
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='UpdateListing(\"" + oid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='DeleteListing(\"" + oid + "\");'>Delete</button>" +
                            "</div>" +
                        "</div>" +
                        "<input type='hidden' value='" + data.WorldCoordinates.x + "' /><input type='hidden' value='" + data.WorldCoordinates.y + "' /><input type='hidden' value='" + data.Address + "' />" +
                    "</div>" +
                "</div>" +
            "</div>";
}

/* Rent, HasPaidRent, Address,  */
function CreatePaymentView(oid, data, paykey)
{
    return "<div class='panel panel-default'>" +
                "<div id='" + oid + "' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Address</label><p>" + data.Address + "</p> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Unit</label><p>" + (data.Unit ? data.Unit : "") + "</p>" + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Rent Due</label><p class='rent'>$" + data.Rent + "</p>" + 
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Landlord Email</label><p class='landlordEmail'>" + data.LandlordEmail + "</p>" + 
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='MakeAdaptivePayment('" + oid + "');'><i class='fa fa-cc-paypal'></i> Pay Rent</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
            "</div>";
}
