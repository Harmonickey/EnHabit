
/**********************

EVENT HANDLERS

**********************/

var savedUsername = "";
var pendingData = null;
var numUploaded = {};
var numAdded = {};
var pendingUpdateData = null;

$(function() {
   var height = $("html").outerHeight(true) - $(".navbar").outerHeight(true) - $(".subnavbar").outerHeight(true) - $(".footer").outerHeight(true);
   
   $(".main").css("min-height", height + "px");
});

$(document).on("keypress", function(e)
{
    var code = e.keyCode || e.which;
    if (code == 13)
    {
        $(".login-action").click();
    }
});

function GetAllUsersAndLandlords(isRenterPage)
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
                            landlordList.push(data[i].Username);
                            if (isRenterPage)
                            {
                                $("#landlords").append("<option value='" + data[i].Username + "'>" + data[i].Username + "</option>");
                            }
                        }
                        else
                        {
                            userList.push(data[i].Username);
                            if (isRenterPage)
                            {
                                $("#users").append("<option value='" + data[i].Username + "'>" + data[i].Username + "</option>");
                            }
                        }
                    }
                    
                    if (!isRenterPage)
                    {
                        $($("#createListingModal .ui-widget input")[0]).autocomplete(
                        {
                            source: function(request, response) 
                            {
                                var results = $.ui.autocomplete.filter(landlordList, request.term);

                                response(results.slice(0, 5)); // limit to 5 results at a time
                            } 
                        });
                        
                        $($("#createListingModal .ui-widget input")[1]).autocomplete(
                        {
                            source: function(request, response) 
                            {
                                var results = $.ui.autocomplete.filter(userList, request.term);

                                response(results.slice(0, 5)); // limit to 5 results at a time
                            }
                        });
                    }
                    else
                    {
                        $("#users").siblings("i").hide();
                        $("#landlords").siblings("i").hide();
                        
                        $("#users").show();
                        $("#users").siblings("label").show();
                        $("#landlords").show();
                        $("#landlords").siblings("label").show();
                        
                        GetListingsByLandlord({"value": $("#landlords").val()});
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

function SortByUsername(a, b){
  var aName = a.Username.toLowerCase();
  var bName = b.Username.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function GetAllUsers()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            //spinner on accordion area
            $("#accordion").html("<i class='fa fa-spinner fa-pulse' />");
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
                    throw new Error("No Users Found");
                    $("#accordion").html("<p>No Users Yet</p>");
                    $(".actions a").show();
                }
                else if (Contains(res, "No Users"))
                {
                    $("#accordion").html("<p>No Users Yet</p>");
                    $(".actions a").show();
                }
                else
                {             
                    $("#accordion").html("");
            
                    var data = JSON.parse(res);
                    
                    data = data.sort(SortByUsername);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        var uid = data[i]._id.$oid;
                       
                        //fill in all user data
                        $("#accordion").append(CreateAccordionUsersView(uid, data[i]));
                        
                        SetBootstrapSwitchesForUsers(uid);
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function GetListingsByLandlord(obj)
{
    var name = obj.value;
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $("#addRenter").hide();
            $("#listings").hide();
            $("#listings").siblings("label").hide();
            $("#listings").siblings("p").hide();
            $("#listings").siblings("i").show();
        },
        data: 
        {
            command: "get_listings",
            data: {
                Landlord: name,
                IsRented: false
            },
            endpoint: "Listings"
        },
        success: function(res) 
        {
            try
            {
                if (res && !Contains(res, "No Matching Entries"))
                {
                    $("#listings").html("");

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
                            
                            var address = data[i].Address + (data[i].Unit ? " " + data[i].Unit : "");
                            
                            $("#listings").append("<option value='" + oid + "'>" + address + "</option>");
                        }
                        
                        $("#listings").show();
                        $("#listings").siblings("label").show();
                        $("#addRenter").show();
                    }
                }
                else
                {
                    $("#listings").siblings("p").show();
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
            $("#listings").siblings("i").hide();
        }
    });
}

function AddRenter()
{
    var renter = $("#users").val();
    var landlord = $("#landlords").val();
    var listingId = $("#listings").val();
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $("#addRenter").prop("disabled", true);
            $("#addRenter").text("Adding...");
        },
        data: 
        {
            command: "add_renter",
            data: {
                Renter: renter,
                Landlord: landlord,
                ListingId: listingId
            },
            endpoint: "Renters"
        },
        success: function(res) 
        {
            try
            {
                if (!res)
                {
                    throw new Error("Could not add renter");
                }
                else
                {
                    var data = JSON.parse(res);
                    
                    if (Contains(res, "Error"))
                    {
                        throw new Error(res);
                    }
                    else
                    {
                        if ($("#accordion").text() == "No Renters Found")
                        {
                            $("#accordion").html("");
                        }
                        
                        var oid = data._id.$oid;
                            
                        $("#accordion").append(CreateAccordionRentersView(oid, data));
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
            $("#addRenter").prop("disabled", false);
            $("#addRenter").text("Add Renter");
        }
    });
}

function GetAllRenters()
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
            command: "get_all_renters",
            endpoint: "Renters"
        },
        success: function(res) 
        {
            try
            {
                if (!res || Contains(res, "No Renters Found"))
                {
                    throw new Error("No Renters Found");
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
                            
                            $("#accordion").append(CreateAccordionRentersView(oid, data[i]));
                        }
                    }
                }
            }
            catch(e)
            {
                $("#accordion").html("<p>" + e.message + "</p>");
            }
        },
        error: function(res, err)
        {
            $("#accordion").html("<p>" + res +  "</p>");
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
    var description = "Payment from Admin Portal";
    var landlordEmail = $("#" + uid + " .landlordEmail").text();
    
    // call from my custom payment library
    if (IsValidSubmission())
    {
        ProcessPayment(uid, rent, description, landlordEmail);
    }
}

function DeleteRenter(id)
{
    //check if the user really wants to do so
    $.msgbox("Are you sure that you want to delete this renter?", 
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
                    command: "delete_renter",
                    data: 
                    { 
                        id: id 
                    },
                    endpoint: "Renters"
                },
                success: function(res)
                {
                    try
                    {
                        if (Contains(res, "Okay"))
                        {
                            // remove the row that we just selected
                            $("#" + id).parent().remove();
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Renter Deleted Successfully!", position: 'top-center'});
                            if ($("#accordion").text() == "")
                            {
                                $("#accordion").text("No Renters Found");
                            }
                        }
                        else
                        {
                            throw new Error("Problem Deleting Renter");
                        }
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                        $("#" + id + " button").prop("disabled", false);
                        $($("#" + id + " button")[1]).text("Delete Renter");
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                    $("#" + id + " button").prop("disabled", false);
                    $($("#" + id + " button")[1]).text("Delete Renter");
                }
            });
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
                            
                            addedFiles[oid] = false;
                            
                            SetUserAndLandlordFields(oid);
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            $(".actions a").show();
        }
    });
}

function GetAllTransactions()
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
                else if (Contains(res, "No Payments"))
                {
                    $("#accordion").html("<p>No Payments Yet</p>");
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
                            
                            $("#accordion").append(CreateAccordionPaymentsView(oid, data[i]));
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
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            $(".actions a").show();
        }
    });
}

function DeleteOldListings()
{
    // check if the user really wants to do so
    $.msgbox("Are you sure that you want to delete all listings older than ONE year?", 
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
                    DisableButtons(); 
                },
                data:
                {
                    command: "delete_old_listings"
                },
                success: function(res)
                {
                    ResetListings();
                },
                error: function(res, err)
                {
                    console.log(res);
                    console.log(err);
                },
                complete: function()
                {
                    $("#purge-btn").text("Purge Old Listings");
                    EnableButtons();
                }
            });
        }
    });
}

function UpdateAccount(uid)
{
    var userfield = $("#" + uid + " input");
    
    var data = BuildData(userfield, ["Username", "FirstName", "LastName", "PhoneNumber", "Password", "Confirm", "Email", "IsActive", "IsVerified", "IsLandlord", "IsAdmin"]);
    
    data.id = uid;
    
    var error = BuildError(data);
    
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
                        else if (Contains(res, "Okay"))
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

function SetUserAndLandlordFields(rowId)
{
    // set users
    $($("#" + rowId + " input")[0]).autocomplete(
    {
        source: function(request, response) 
        {
            var results = $.ui.autocomplete.filter(userList, request.term);

            response(results.slice(0, 5)); // limit to 5 results at a time
        } 
    });
    
    // set landlords
    $("#" + rowId + " input")[1]).autocomplete(
    {
        source: function(request, response) 
        {
            var results = $.ui.autocomplete.filter(landlordList, request.term);

            response(results.slice(0, 5)); // limit to 5 results at a time
        }
    });
}

function SetBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":eq(4), :eq(5)").bootstrapSwitch({onText: "Yes", offText: "No"});
    $(checkboxes[checkboxes.length - 3]).bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Apartment", offText: "House"});
}

function SetBootstrapSwitchesForUsers(rowId)
{
    $("#" + rowId + " input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function SetGeocompleteTextBox(rowId)
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

function SetTextBoxWithAutoNumeric(rowId)
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

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[5]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[3]).val()) //current
    });
}

function UpdateListing(oid)
{
    var inputs = $("#" + oid + " input, #" + oid + " textarea");
    
    var data = BuildData(inputs, ["User", "Landlord", "Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "IsActive", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    data.id = oid;
    data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
    data.BuildingType = (data.BuildingType == true ? "apartment" : "house");
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

function DeleteAccount(uid)
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
        
        var data = {"Password": password, "id": uid};
        
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
                if (Contains(res, "Okay"))
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
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            },
            complete: function()
            {
                $("#" + uid + " button").prop("disabled", false);
                $($("#" + uid + " button")[1]).text("Delete");
            }
        });
    });  
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                    $("#" + id + " button").prop("disabled", false);
                    $($("#" + id + " button")[1]).text("Delete");
                }
            });
        }
    });
}

function CreateAccount()
{
    var userfield = $("#createUserModal input");
    
    var data = BuildData(userfield, ["Username", "Password", "Confirm", "FirstName", "LastName", "Email", "PhoneNumber", "IsLandlord", "IsActive", "IsVerified", "IsAdmin"]);
    
    var error = BuildError(data);
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'top-center'});
    }
    else
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
                            
                            $("#accordion").append(CreateAccordionUsersView(uid, user));
                            
                            SetBootstrapSwitchesForUsers(uid);
                            
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
}

function CreateListing()
{
    var inputs = $("#createListingModal input, #createListingModal select, #createListingModal textarea");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "User", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    var error = BuildError(data);
    
    data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
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
                        
                        $(headingInputs[0]).text("Address: " + $(inputs[2]).val());
                        $(headingInputs[1]).text("Unit: " + $(inputs[3]).val());
                        $(headingInputs[2]).text("Rent: $" + $(inputs[4]).autoNumeric('get') + "/Month");
                        $(headingInputs[3]).text("Start Date: " + $.datepicker.formatDate('mm/dd/yy', new Date($(inputs[5]).val())));
                        $(headingInputs[4]).text("University: " + $(inputs[6]).val());
                        
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
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
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
                        if (!Contains(res, "Admin"))
                        {
                            QuickLogout(); // clears the session variables
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
                    $(".login-action").text("Sign In");
                    $(".login-action").prop("disabled", false);
                }
            },
            error: function(res, err)
            {
                $(".login-error").show();
                $(".login-error").text(res);
                $(".login-action").text("Sign In");
                $(".login-action").prop("disabled", false);
            }
        });
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
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function DisplayAnalytics(analytics)
{
    var visits = analytics[0];
    var percentNewVisits = parseInt(analytics[1]);
    var uniqueVisits = analytics[2];
    var averageTimeOnSite = parseInt(analytics[3]);
    var averagePageLoad = parseInt(analytics[4]);
    
    var averageTimeFormatted = FormattedTime(averageTimeOnSite);
    var averageLoadFormatted = FormattedTime(averagePageLoad);
    
    $("#site-visits").text(visits);
    $("#unique-visits").text(uniqueVisits);
    $("#new-visits").text(percentNewVisits + "%");
    $("#average-time-on-site").text(averageTimeFormatted);
    $("#page-download-time").text(averageLoadFormatted);
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
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Apartment", offText: "Sublet", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[1]).bootstrapSwitch({onText: "Apartment", offText: "Sublet", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[1]).prop("checked", true);
    
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

function InitSpecialFieldsUser()
{    
    $("#createUserModal input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
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
        var oid = $(this.element).data("pic-id");
        if (numUploaded[oid] == numAdded[oid] - 1)
        {
            numUploaded[oid] = 0;
            numAdded[oid] = 0;
            $(".dz-progress").remove();
            ProcessListing(); 
        }
        else
        {
            numUploaded[oid]++;
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
        if (elements[i] == "Animals" || elements[i] == "Laundry" || elements[i] == "Parking" || elements[i] == "AirConditioning" || elements[i] == "LeaseType" || elements[i] == "BuildingType" || elements[i] == "IsActive" || elements[i] == "IsAdmin" || elements[i] == "IsVerified" || elements[i] == "IsLandlord" || elements[i] == "IsRented")
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes")
        {
            data[elements[i]] = $(inputs[i]).val();
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
    
    if (fields.FirstName === "")
    {
        errorArr.push("Valid First Name");
    }
    if (fields.LastName === "")
    {
        errorArr.push("Valid Last Name");    
    }
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
        if (fields.Password !== fields.Confirm)
        {
            errorArr.push("Matching Password and Confirmation");
        }
    }
    if (fields.User === "" && fields.Landlord === "")
    {
        errorArr.push("Valid Tenant and/or Landlord");
    }
    if (fields.IsAdmin === true && fields.IsLandlord === true)
    {
        errorArr.push("Either Admin or Landlord, Not Both");
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

function FormattedTime(time)
{
    var hours = parseInt( time / 3600 ) % 24;
    var minutes = parseInt( time / 60 ) % 60;
    var seconds = time % 60;
    
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
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
                            "<label>University: " + data.University + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>User</label><input type='text' class='form-control' value='" + (data.Username ? data.Username : "") + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Landlord</label><input type='text' class='form-control' value='" + (data.Landlord ? data.Landlord : "") + "' /> " + 
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
                                "<label>Start Date</label><input type='text' class='form-control' value='" + FormattedDate(data.Start) + "' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label><input type='text' class='form-control' value='" + data.University + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
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
                                "<label>Lease Type</label><input type='checkbox' " + (data.LeaseType == "rental" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Building Type</label><input type='checkbox' " + (data.BuildingType == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px'>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Listing Active</label><input type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini'" + (data.IsActive ? "" : "disabled") + "/>" +
                            "</div>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                (data.IsActive ? "" : (data.Pictures == null || data.Pictures.length == 0 ? "<label style='color: red'>To Activate This Listing You Must Include Images!</label>" : "")) + 
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Info</label><textarea rows='4' cols='50' class='form-control' >" + (data.Notes ? data.Notes : "") + "</textarea>" +
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

function CreateAccordionUsersView(uid, data)
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
                                "<button class='btn btn-primary btn-success' onclick='UpdateAccount(\"" + uid + "\");'>Update</button>" + 
                                "<button class='btn btn-danger' onclick='DeleteAccount(\"" + uid + "\");'>Delete</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function CreateAccordionRentersView(uid, data)
{           
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + uid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + uid + "' aria-expanded='false' aria-controls='" + uid + "'>" +
                            "<label>Name: " + data.FirstName + " " + data.LastName + "</label>" +
                            "<label>Address: " + data.Address + (data.Unit ? " " + data.Unit : "") + "</label>" +
                            "<label>Rent: $" + data.Rent + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + uid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + uid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Name</label><p class='firstname'>" + data.FirstName + " " + data.LastName + "</p>" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Address</label><p class='address'>" + data.Address + (data.Unit ? " " + data.Unit : "") + "</p>" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Rent</label><p class='rent'>$" + data.Rent + "</p>" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Email Address</label><p class='email'>" + data.Email + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Phone Number</label><p class='phonenumber'>" + data.PhoneNumber + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Landlord Email</label><p class='landlordEmail'>" + data.LandlordEmail + "</p>" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='OpenPaymentModal(\"" + uid + "\");'><i class='fa fa-cc-paypal'></i> Pay Rent</button>" + 
                                "<button class='btn btn-danger' onclick='DeleteRenter(\"" + uid + "\");'>Delete Renter</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function CreateAccordionPaymentsView(oid, data)
{           
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>Name: " + data.FirstName + " " + data.LastName + "</label>" +
                            "<label>Rent: $" + data.Rent + "</label>" +
                            "<label>Month: " + data.Month + "</label>" +
                            "<label>Landlord: " + data.LandlordName + "</label>" +
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
                                "<label>Rent</label><p class='rent'>$" + data.Rent + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Month</label><p class='address'>" + data.Month + "</p>" + 
                            "</div>" +                           
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Email Address</label><p class='email'>" + data.Email + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Phone Number</label><p class='phonenumber'>" + data.PhoneNumber + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Landlord Email</label><p class='landlordEmail'>" + data.LandlordEmail + "</p>" +
                            "</div>" +
                        "</div>" + 
                    "</div>" +
                "</div>" +
            "</div>";
}

function AutoGenerateListings()
{
    var amount = $("#amount_to_autogenerate").val();
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $("#autogenerate").prop("disabled", true);
        },
        data:
        {
            command: "autogenerate_listings",
            data: 
            { 
                amount: amount
            },
            endpoint: "Listings"
        },
        success: function(res)
        {
            try
            {
                if (Contains(res, "Okay"))
                {
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Listings Generated!", position: 'top-center'});
                }
                else
                {
                    throw new Error("Problem Generating Listings");
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
            $("#autogenerate").prop("disabled", false);
        }
    });
}

function DeleteAutoGeneratedListings()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $("#deletegenerated").prop("disabled", true);
        },
        data:
        {
            command: "delete_autogenerated_listings",
            endpoint: "Listings"
        },
        success: function(res)
        {
            try
            {
                if (Contains(res, "Okay"))
                {
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Listings Deleted Successfully!", position: 'top-center'});
                }
                else
                {
                    throw new Error("Problem Deleting Listings");
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
            $("#deletegenerated").prop("disabled", false);
        }
    });
}
