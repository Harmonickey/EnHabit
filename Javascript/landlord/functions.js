
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

function GetAllApplicants()
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
            command: "get_all_applicants",
            endpoint: "Applicants"
        },
        success: function(res) 
        {
            try
            {
                if (!res || Contains(res, "No Applicants Found"))
                {
                    throw new Error("No Applicants Found");
                }
                else
                {
                    $("#accordion").html("");

                    var data = JSON.parse(res);
                    
                    if (Contains(res, "Error"))
                    {
                        throw new Error(res);
                    }
                    else
                    {
                        for (var i = 0; i < data.length; i++)
                        {
                            var oid = data[i]._id.$oid;
                            
                            $("#accordion").append(CreateAccordionApplicantsView(oid, data[i]));
                        }
                    }
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                $("#accordion").html("<p>No Applicants</p>");
            }    
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            $("#accordion").html("<p>No Applicants</p>");
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
                    $("#accordion").html("<p>No Listings</p>");
                    $(".actions a").show();
                }
                else if (Contains(res, "No Matching Entries"))
                {
                    $("#accordion").html("<p>No Listings</p>");
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
                            SetTextBoxWithTags(oid);
                            
                            addedFiles[oid] = false;
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

function getAccount()
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
                        FillAccountInfo(data);
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
            $(".account .fa-spinner").remove();
        }
    });
}

function SetBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":last").bootstrapSwitch({onText: "Yes", offText: "No"});
    $(checkboxes[checkboxes.length - 1]).bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
}

function SetGeocompleteTextBox(rowId)
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

function SetTextBoxWithTags(rowId)
{
   $("#" + rowId + " input[data-role='tagsinput']").tagsinput();
}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[2]).pikaday(
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
    
    // this only skips with facebook accounts
    if (Contains(data["Email"], "@"))
    {
        $(inputs[1]).val(data["Email"]);
    }
    $(inputs[2]).val(data["FirstName"]);
    $(inputs[3]).val(data["LastName"]);
    $(inputs[4]).val(data["PhoneNumber"]);
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
                            if ($("#accordion").text() == "")
                            {
                                $("#accordion").text("No Listings");
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
                        $("#" + id + " button").prop("disabled", false);
                        $($("#" + id + " button")[1]).text("Delete");
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                    $("#" + id + " button").prop("disabled", false);
                    $($("#" + id + " button")[1]).text("Delete");
                }
            });
        }
    });
}

function UpdateListing(oid)
{
    var inputs = $("#" + oid + " input").not(":eq(7)");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Tags", "Animals", "Laundry", "Parking", "AirConditioning", "Type", "IsRented", "Latitude", "Longitude", "SelectedAddress"]);
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    data.id = oid;
    data.University = "Northwestern";
    data.Type = (data.Type == true ? "apartment" : "sublet");
    data.Address = data.Address.split(",")[0];
    data.Start = $.datepicker.formatDate('mm/dd/yy', new Date(data.Start));
    data.Pictures = pictures[oid];
    
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
            
            if (addedFiles[oid] == false)
            {
                ProcessListing();
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

function CreateListing()
{
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(12)");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "Type", "Tags", "Latitude", "Longitude", "SelectedAddress"]);
    
    var error = BuildError(data);
    
    data.University = "Northwestern";
    data.Type = (data.Type == true ? "apartment" : "sublet");
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
            dropzones["create"].processQueue();
        }
    }
    catch(e)
    {
        $("#create-listing-button").text("Create Listing");
        $("#create-listing-button").prop("disabled", false);
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
                            if ($("#accordion").text() == "No Listings")
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
                            SetTextBoxWithTags(oid)
                            
                            $("#createListingModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center'});
                            
                            numUploaded[oid] = 0;
                            
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
                $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
            },
            complete: function()
            {
                $("#create-listing-button").text("Create Listing");
                $("#create-listing-button").prop("disabled", false);
                
                dropzones["create"].destroy();
                
                CreateDropzone("create", "#createListingModal form");
            }
        });
    }
    else if (pendingUpdateData != null)
    {
        var id = pendingUpdateData.id;
        addedFiles[id] = false;
        
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
                    if (Contains(res, "Okay"))
                    {
                        var inputs = $("#" + id + " input");
                        var headingInputs = $("#heading" + id + " label");
                        
                        $(headingInputs[0]).text("Address: " + $(inputs[0]).val());
                        $(headingInputs[1]).text("Unit: " + $(inputs[1]).val());
                        $(headingInputs[2]).text("Rent: $" + $(inputs[2]).autoNumeric('get') + "/Month");
                        $(headingInputs[3]).text("Start Date: " + $.datepicker.formatDate('mm/dd/yy', new Date($(inputs[3]).val())));
                        
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                        numUploaded[id] = 0;
                        
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
                    numUploaded[id] = 0;
                }
            },
            error: function(res, err)
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

function Login()
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
                        if (Contains(res, "Okay"))
                        {
                            if (!Contains(res, "Landlord"))
                            {
                                QuickLogout(); // clears the session variables
                                throw new Error("Tenants Cannot Login to Landlord Portal");
                            }
                            else
                            {
                                location.href="/landlord/listings/";
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
                    $(".login-error").show();
                    $(".login-error").text(res + " " + err);
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
                    location.href = "/landlord/login.php";
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
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
        
        try
        {
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
                },
                complete: function()
                {
                    $(".account button").prop("disabled", false);
                    $($(".account button")[1]).text("Delete");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    });
}

function AcceptApplicant(applicantId)
{
    // this should first move the data from the applicant table to the renter's table
    // then call RemoveApplicant()
    
    var data = { ApplicantId: applicantId };
    
    $.ajax(
    {
        type: "POST",
        url: "api.php",
        data:
        {
            command: "add_renter",
            data: data,
            endpoint: "Renters"
        },
        success: function(res)
        {
            try
            {
                if (res && res["Error"] == null)
                {
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Accepted Applicant", position: 'top-center'});
                    //RemoveApplicant(oid, true);
                }
                else
                {
                    throw new Error("Could Not Accept Applicant");
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

function RemoveApplicant(applicantId, isAccepting)
{
    var data = { id: applicantId };
    
    $.ajax(
    {
        type: "POST",
        url: "api.php",
        data:
        {
            command: "delete_applicant",
            data: data,
            endpoint: "Applicants"
        },
        success: function(res)
        {
            try
            {
                if (Contains(res, "Okay"))
                {
                    $("#" + oid).remove();
                    if (!isAccepting)
                    {
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Removed Applicant", position: 'top-center'});
                    }
                }
                else
                {
                    throw new Error("Problem Removing Applicant");
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
    $("#createListingModal .type-content input").bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
        
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
     
    $("#createListingModal .bootstrap-tagsinput").addClass("form-control");
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
        var id = $(this.element).data("pic-id");
        
        if (numUploaded[id] == numAdded[id] - 1)
        {
            numUploaded[id] = 0;
            numAdded[id] = 0;
            ProcessListing(); 
        }
        else
        {
            numUploaded[id]++;
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
            addedFiles[oid] = false;
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
         || elements[i] == "AirConditioning" || elements[i] == "Type")
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress")
        {
            data[elements[i]] = $(inputs[i]).val();
        }
        else if (elements[i] == "Rent")
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
    if (fields.PhoneNumber === "" || (fields.PhoneNumber !== undefined && !IsValidPhoneNumber(fields.PhoneNumber)))
    {
        errorArr.push("Valid Phone Number");
    }
    if (fields.Start === "")
    {
        errorArr.push("Valid Lease Start Date");
    }
    if (fields.Password !== "" || fields.Confirm !== "")
    {
        if (fields.Password !== fields.Confirm)
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
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
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
                            "<div class='col-lg-5 col-md-5 col-sm-5'>" +
                                "<label>Is Rented</label><input type='checkbox' " + (data.IsRented ? "checked" : "") + " data-size='mini' />" +
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
                                "<button class='btn btn-primary' onclick='UpdateListing(\"" + oid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='DeleteListing(\"" + oid + "\");'>Delete</button>" +
                            "</div>" +
                        "</div>" +
                        "<input type='hidden' value='" + data.WorldCoordinates.x + "' /><input type='hidden' value='" + data.WorldCoordinates.y + "' /><input type='hidden' value='" + data.Address + "' />" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function CreateAccordionApplicantsView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label class='text-capitalize'>Name: " + data.FirstName + " " + data.LastName + "</label>" +
                            "<label>Address: " + data.Address + " " + (data.Unit ? data.Unit : " ") + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +   
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Name</label><p class='firstname'>" + data.FirstName + " " + data.LastName + "</p>" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Address:</label><p class='address'>" + data.Address + " " + (data.Unit ? data.Unit : " ") + "</p>" +
                            "</div>" +                         
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Job Title:</label><p>" + data.JobTitle + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Salary:</label><p>$" + data.Salary + "</p>" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px;'>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary' onclick='AcceptApplicant(\"" + oid + "\");'>Accept</button>" + 
                                "<button class='btn btn-danger' onclick='RemoveApplicant(\"" + oid + "\", false);'>Remove</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}