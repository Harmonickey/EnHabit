
/**********************

EVENT HANDLERS

**********************/

var savedUsername = "";
var pendingData = null;
var numUploaded = 0;
var numAdded = 0;
var pendingUpdateData = null;
var threshold = 0.000;

$(function() {
    var height = $("html").outerHeight(true) - $(".navbar").outerHeight(true) - $(".subnavbar").outerHeight(true) - $(".footer").outerHeight(true);
   
<<<<<<< HEAD
    $(".main").css("min-height", height + "px");
   
    if ($.fn.lightbox) {
       $('.ui-lightbox').lightbox();
    }
    
<<<<<<< HEAD
<<<<<<< HEAD
   if (location.hash == "#successpayment")
=======
   if (location.hash == "successpayment")
>>>>>>> 921ffff... 117 payment enhancement
   {
       $.msgGrowl ({ type: 'success', title: 'Success', text: "Payment Successfully Sent!", position: 'top-center'});
       location.hash = "";
   }      
<<<<<<< HEAD
   else if (location.hash == "#cancelledpayment")
=======
   else if (location.hash == "cancelledpayment")
>>>>>>> 921ffff... 117 payment enhancement
   {
       $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Payment Cancelled!", position: 'top-center'});
       location.hash = "";
   }
<<<<<<< HEAD
=======
    if (location.hash == "#successpayment")
    {
       $.msgGrowl ({ type: 'success', title: 'Success', text: "Payment Successfully Sent!", position: 'top-center'});
       location.hash = "";
    }      
    else if (location.hash == "#cancelledpayment")
    {
       $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Payment Cancelled!", position: 'top-center'});
       location.hash = "";
    }
>>>>>>> ef00d00... 130 memo
    
    if (location.hash == "#success")
    {
       $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
       
       location.hash = "";
<<<<<<< HEAD
   }
=======
>>>>>>> 921ffff... 117 payment enhancement
=======
    }
>>>>>>> ef00d00... 130 memo
=======
   $(".main").css("min-height", height + "px");
   
   if ($.fn.lightbox) {
        $('.ui-lightbox').lightbox();
    }
>>>>>>> 1a55107... 107 adaptive payments
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        
                        $("#payment").append(CreatePaymentView(oid, data));
                        
                        $("#paymentNote").keyup(function() {
                            var charactersLeft = 100 - $("#paymentNote").val().length;
=======
>>>>>>> a007760... 107 redirect
                            
<<<<<<< HEAD
                            $("#charactersLeft").text(charactersLeft);
                        });
                        
                        $("#GetPaymentKey").click(function() {
                            GetPayKey(oid, data);
                        });
=======
=======
>>>>>>> 7319f63... 107 better flow
                            
<<<<<<< HEAD
                        GetPayKey();
>>>>>>> 1a55107... 107 adaptive payments
=======
                        $("#payment").append(CreatePaymentView(oid, data));
<<<<<<< HEAD
>>>>>>> a9f934a... 107 payment stuff
=======
                        
                        GetPayKey();
>>>>>>> 152205d... 107 more paypal
=======
                        $("#payment").append(CreatePaymentView(oid, data, paykey));
                       
                        var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});
<<<<<<< HEAD
>>>>>>> 268c466... 107 flip flow
=======
=======
                         
=======
                        
>>>>>>> 1c87344... 107 redirect
                        GetPayKey(oid, data);
>>>>>>> 014529f... 107 better flow
>>>>>>> 7319f63... 107 better flow
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
                            threshold = data[0].Threshold;
                            
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
<<<<<<< HEAD
=======
                    {
<<<<<<< HEAD
                        $("#landlord-filter").append("<option value='" + landlord + "'>" + landlord + "</option>")
                    });
                    /*
                    $($("#createListingModal .ui-widget input")[0]).autocomplete(
>>>>>>> 9869d16... 107 can delete listing with pictures
                    {
                        $("#landlords-filter").append("<option value='" + landlord + "'>" + landlord + "</option>")
                    });
<<<<<<< HEAD
                    
                    GetAllListings();
=======
                    */
                    $($("#createListingModal .ui-widget input")[1]).autocomplete(
                    {
                        source: function(request, response) 
                        {
                            var results = $.ui.autocomplete.filter(userList, request.term);

                            response(results.slice(0, 5)); // limit to 5 results at a time
                        }
                    });
>>>>>>> 9869d16... 107 can delete listing with pictures
=======
                        $("#landlords-filter").append("<option value='" + landlord + "'>" + landlord + "</option>")
                    });
                    
                    GetAllListings();
>>>>>>> 0dc8937... 107 updating deleting creating
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

<<<<<<< HEAD
function GetAllTransactions()
{  
    var data = { "TenantPaymentHistory": true };

    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "get_all_transactions",
            data: data,
            endpoint: "Payments"
        },
        success: function(res) 
        {
            try
            {
                if (!res)
                {
                    throw new Error("Unable to retrieve payments");
                    $("#paymentHistory").html("<p>No Payments Yet</p>");
                }
                else if (Contains(res, "No Payments"))
                {
                    $("#paymentHistory").html("<p>No Payments Yet</p>");
                }
                else
                {
                    $("#paymentHistory").html("");

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
                            
                            $("#paymentHistory").append(CreatePaymentHistoryView(oid, data[i]));
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

=======
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
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
<<<<<<< HEAD
    $("#" + rowId + " .yesno").bootstrapSwitch({onText: "Yes", offText: "No"});
    $("#" + rowId + " .leasetype").bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $("#" + rowId + " .buildingtype").bootstrapSwitch({onText: "Apartment", offText: "House"});
=======
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":eq(5)").bootstrapSwitch({onText: "Yes", offText: "No"});
    //$(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Apartment", offText: "House"});
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
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
                            $(".listings-message").hide();
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
<<<<<<< HEAD
<<<<<<< HEAD
    var inputs = $("#" + id + " input, #" + id + " select, #" + id + " textarea");
    
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "University", "Animals", "Laundry", "Parking", "AirConditioning", "IsRented", "LeaseType", "BuildingType", "IsActive", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
=======
    var inputs = $("#" + id + " input, #" + id + " textarea");
=======
    var inputs = $("#" + id + " input, #" + id + " select, #" + id + " textarea");
>>>>>>> 0dc8937... 107 updating deleting creating
    
<<<<<<< HEAD
<<<<<<< HEAD
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "IsRented", "LeaseType", "BuildingType", "IsActive", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "IsRented", "BuildingType", "IsActive", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 65a35be... 107 lease type and front page fixes
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "University", "Animals", "Laundry", "Parking", "AirConditioning", "IsRented", "BuildingType", "IsActive", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> b30758c... 107 universities
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    data.id = id;
<<<<<<< HEAD
<<<<<<< HEAD
    data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
=======
    data.University = "Northwestern";
=======
>>>>>>> b30758c... 107 universities
    //data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
>>>>>>> 65a35be... 107 lease type and front page fixes
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
    
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "University", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
    
    var error = BuildError(data);
    
    data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "Landlord", "University", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> b30758c... 107 universities
    
    var error = BuildError(data);
    
    //data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
>>>>>>> 65a35be... 107 lease type and front page fixes
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
                            
                            threshold = listing.Threshold;
                            
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
<<<<<<< HEAD
                        window.location = "/tenant/listings/#success"
                        window.location.reload();
=======
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
>>>>>>> 1dc1327... 107 listing active after update
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6d15b60... 107 revert to old logout
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
<<<<<<< HEAD
                    location.href = "/#loggedout";
=======
                    location.href = "/";
>>>>>>> 6d15b60... 107 revert to old logout
                }
                else
                {
                    throw new Error("Problem with Logging Out");
                }
<<<<<<< HEAD
<<<<<<< HEAD
=======
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
>>>>>>> 6d15b60... 107 revert to old logout
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
<<<<<<< HEAD
=======
    $.post("/logout.php");
>>>>>>> 69861d1... 107 logout flow
=======
>>>>>>> 6d15b60... 107 revert to old logout
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
function GetPayKey(oid, data)
{
    data.Memo = $("#paymentNote").val().replace("'", "");
=======
function MakeAdaptivePayment(uid)
=======
function GetPayKey()
>>>>>>> 152205d... 107 more paypal
{
    var rent = $(".rent").text().replace("$", "");
    var landlordEmail = $(".landlordEmail").text();
    
    var data = 
    {
        "Rent": rent,
        "LandlordEmail": landlordEmail
    };
>>>>>>> 1a55107... 107 adaptive payments
    
=======
function GetPayKey(oid, data)
{
>>>>>>> 7319f63... 107 better flow
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
<<<<<<< HEAD
            $("#GetPaymentKey").prop("disabled", true);
            $("#GetPaymentKey").html("<i class='fa fa-cc-paypal' style='margin-right: 5px'></i>Paying...");
=======
            $(".adaptive-payment button").prop("disabled", true);
            $($(".adaptive-payment button")[1]).text("Deleting...");
>>>>>>> 1a55107... 107 adaptive payments
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
<<<<<<< HEAD
<<<<<<< HEAD
                var payResponse = JSON.parse(res);
                
                if (payResponse["error"])
                {
                   throw Error("Unable to Get Payment Key"); 
<<<<<<< HEAD
                }
                else
                {
                    // get pay key
                    var paykey = payResponse["payKey"];
                    
                    // set it in the DOM
                    $("#paykey").val(paykey);
                    
                    // init the PayPal popup object
                    var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});
                    
                    // programmatically submit
                    $("#submitBtn").click();
=======
                var data = JSON.parse(res);
=======
                var payResponse = JSON.parse(res);
>>>>>>> 7319f63... 107 better flow
                
                if (payResponse["error"])
                {
                   throw Error("Unable to Process Payment"); 
=======
>>>>>>> e1e8f31... 117 renters 2
                }
                else
                {
                    var paykey = payResponse["payKey"];
                    
<<<<<<< HEAD
                    GetRenter(paykey);
=======
                    $("#payment").append(CreatePaymentView(oid, data));
                     
                    $("#paykey").val(paykey);
                    
                    var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});
>>>>>>> 014529f... 107 better flow
                }
<<<<<<< HEAD
                else
                {
                    throw new Error(res);
>>>>>>> 1a55107... 107 adaptive payments
                }
=======
>>>>>>> ab9b7e1... 107 small syntax
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
<<<<<<< HEAD
            $("#GetPaymentKey").prop("disabled", false);
            $("#GetPaymentKey").html("<i class='fa fa-cc-paypal' style='margin-right: 5px'></i>Pay Rent");
=======
            $(".adaptive-payment button").prop("disabled", false);
            $($(".adaptive-payment button")[1]).text("Delete");
>>>>>>> 1a55107... 107 adaptive payments
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
<<<<<<< HEAD
<<<<<<< HEAD
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University")
=======
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord")
>>>>>>> 0dc8937... 107 updating deleting creating
=======
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University")
>>>>>>> 8da06d7... 107 various bug fixes
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
    
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b30758c... 107 universities
    var universities = "";
    $.each(universitiesList, function(index, university) {
        universities += "<option value='" + university + "'" + (data.University == university ? "selected" : "") + ">" + university + "</option>";
    });
    
<<<<<<< HEAD
    var bedrooms = "";
    for (var i = 0; i <= 10; i++)
    {
        bedrooms += "<option value='" + (i == 0 ? "studio" : i) + "'" + (data.Bedrooms == i ? "selected" : "") + ">" + (i == 0 ? "studio" : i) + (i == 10 ? "+" : "") + "</option>";
    }
    var bathrooms = "";
    for (var i = 0; i <= 10; i++)
    {
        bathrooms += "<option value='" + i + "'" + (data.Bathrooms == i ? "selected" : "") + ">" + i + (i == 10 ? "+" : "") +"</option>";
    }
    
=======
>>>>>>> 0dc8937... 107 updating deleting creating
=======
>>>>>>> b30758c... 107 universities
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
<<<<<<< HEAD
                                "<label>Bedrooms</label>" + 
                                "<select class='form-control'>" + bedrooms + "</select>" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label>" + 
                                "<select class='form-control'>" + bathrooms + "</select>" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label>" + 
                                "<select class='form-control'>" + universities + "</select>" +
=======
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>University</label>" + 
                                "<select class='form-control'>" + universities + "</select>" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px'>" +
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Animals</label><input class='yesno' type='checkbox' " + (data.HasAnimals ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Laundry</label><input class='yesno' type='checkbox' " + (data.HasLaundry ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Parking</label><input class='yesno' type='checkbox' " + (data.HasParking ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>AC</label><input class='yesno' type='checkbox' " + (data.HasAirConditioning ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px'>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Is Rented</label><input class='yesno' type='checkbox' " + (data.IsRented ? "checked" : "") + " data-size='mini' disabled/>" +
                            "</div>" + 
<<<<<<< HEAD
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Lease Type</label><input class='leasetype' type='checkbox' " + (data.LeaseType == "rental" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Building Type</label><input class='buildingtype' type='checkbox' " + (data.BuildingType == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px'>" + 
=======
                            //"<div class='col-lg-3 col-md-3 col-sm-3'>" +
                            //    "<label>Lease Type</label><input type='checkbox' " + (data.LeaseType == "rental" //? "checked" : "") + " data-size='mini' />" +
                            //"</div>" +
>>>>>>> 65a35be... 107 lease type and front page fixes
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Listing Active</label><input class='yesno activecheckbox' type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini'" + (data.Pictures == null || data.Pictures.length == 0 || data.IsPastThreshold ? "disabled" : "") + "/>" +
                            "</div>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.Pictures == null || data.Pictures.length == 0 ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing You Must Include Images!</label>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.IsPastThreshold ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing, Please Choose an Address Within " + threshold + " miles of this University!</label>" +
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
<<<<<<< HEAD
<<<<<<< HEAD
                                "<label>Info</label><textarea rows='4' cols='50' class='form-control' >" + (data.Notes ? notes : "") + "</textarea>" +
=======
                                "<label>Info</label><textarea rows='4' cols='50' class='form-control' >" + (data.Notes ? data.Notes : "") + "</textarea>" +
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
                                "<label>Info</label><textarea rows='4' cols='50' class='form-control' >" + (data.Notes ? notes : "") + "</textarea>" +
>>>>>>> 0dc8937... 107 updating deleting creating
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

function GetNextMonth(today)
{
    today.setMonth(today.getMonth() + 1);
    
    var monthNum = today.getMonth() + 1;
    
    switch(monthNum)
    {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7: 
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}

/* Rent, HasPaidRent, Address,  */
function CreatePaymentView(oid, data, paykey)
{
    var today = new Date();
    var nextMonth = "Ex: " + GetNextMonth(today) + "'s Rent";
    
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
<<<<<<< HEAD
<<<<<<< HEAD
                                "<label>Rent Due</label><p class='rent'>$" + data.Rent + "</p>" + 
=======
                                "<label>Rent Due</label><p>$" + data.Rent + "</p>" + 
>>>>>>> 65240df... 107 various payments fixes
=======
                                "<label>Rent Due</label><p class='rent'>$" + data.Rent + "</p>" + 
>>>>>>> 63a17b2... 107 payments additions
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Landlord Email</label><p class='landlordEmail'>" + data.LandlordEmail + "</p>" + 
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                            "<div class='row'>" +
                                "<div class='col-lg-7 col-md-7 col-sm-7'>" +    
                                    "<label>Optional Payment Note:</label>" + 
                                    "<input type='text' class='form-control' style='margin-bottom: 15px;' id='paymentNote' value='' name='paymentNote' placeholder=\"" + nextMonth + "\" maxlength='100'>" +
                                "</div>" +
                                "<div class='col-lg-3 col-md-3 col-sm-3' style='margin-top: 25px'>" +
                                    "<span id='charactersLeft'>100</span> characters left" +
                                "</div>" +
                            "</div>" +
                            "<button class='btn btn-primary btn-success' id='GetPaymentKey')'><i class='fa fa-cc-paypal' style='margin-right: 5px'></i>Pay Rent</button>" +
                            "<form action='https://www.paypal.com/webapps/adaptivepayment/flow/pay' target='PPDGFrame' class='standard'>" +
                                "<button class='hidden' id='submitBtn'></button>" +
                                "<input id='type' type='hidden' name='expType' value='light'><input id='paykey' type='hidden' name='paykey' value=''>" +
                            "</form>" +
=======
                                "<button class='btn btn-primary btn-success' onclick='MakeAdaptivePayment('" + oid + "');'><i class='fa fa-cc-paypal'></i> Pay Rent</button>" +
>>>>>>> 1a55107... 107 adaptive payments
=======
                                "<button class='btn btn-primary btn-success' onclick='MakeAdaptivePayment(\"" + oid + "\");'><i class='fa fa-cc-paypal'></i> Pay Rent</button>" +
>>>>>>> a878a32... 107 escape quotation
=======
                            "<form action='https://www.sandbox.paypal.com/webapps/adaptivepayment/flow/pay' target='PPDGFrame' class='standard'>" +
                                "<input type='image' id='submitBtn' value='Pay Rent' src='https://www.paypalobjects.com/en_US/i/btn/btn_paynowCC_LG.gif'>" +
=======
                            "<form action='https://www.paypal.com/webapps/adaptivepayment/flow/pay' target='PPDGFrame' class='standard'>" +
                                "<button class='btn btn-primary btn-success' id='submitBtn'><i class='fa fa-cc-paypal'></i> Pay Rent</button>" +
<<<<<<< HEAD
>>>>>>> a155d99... 107 endpoints
                                "<input id='type' type='hidden' name='expType' value='light'><input id='paykey' type='hidden' name='paykey' value=''>" +
=======
                                "<input id='type' type='hidden' name='expType' value='light'><input id='paykey' type='hidden' name='paykey' value='" + paykey + "'>" +
>>>>>>> 268c466... 107 flip flow
                            "</form>" +
>>>>>>> 152205d... 107 more paypal
                            "</div>" +
                        "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
            "</div>";
}

function CreatePaymentHistoryView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>Paid Rent: $" + data.Rent + "</label>" +
                            "<label>Month: " + data.Month + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +   
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Rent</label><p class='rent'>$" + data.Rent + "</p>" +
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Month</label><p class='address'>" + data.Month + "</p>" + 
                            "</div>" +                           
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}
