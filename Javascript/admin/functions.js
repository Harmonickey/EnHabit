
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
   
<<<<<<< HEAD
<<<<<<< HEAD
   if (location.hash == "#success")
=======
   if (location.hash == "success")
>>>>>>> da5fc3d... 119 hash usage
=======
   if (location.hash == "#success")
>>>>>>> aad23d3... 121 logging out stuff as well as when logged in the pay rent button changes
   {
       $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
       
       location.hash = "";
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d3d46cc... 120 add necessary files
function GetAllOutput()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            command: "get_output_data",
            endpoint: "Output"
        },
        beforeSend: function()
        {
            $('.commands').html("<i class='fa fa-spinner fa-pulse' />");
            $('.errors').html("<i class='fa fa-spinner fa-pulse' />");
=======
            command: "get_pricing",
            endpoint: "Pricing"
>>>>>>> d3d46cc... 120 add necessary files
=======
            command: "get_all_output",
=======
            command: "get_output_data",
>>>>>>> b1467c5... 120 error and debug string logging with times
            endpoint: "Output"
>>>>>>> 7ffe828... 120 modify command name
        },
        beforeSend: function()
        {
            $('.commands').html("<i class='fa fa-spinner fa-pulse' />");
            $('.errors').html("<i class='fa fa-spinner fa-pulse' />");
        },
        success: function(res) 
        {
            try
            {
<<<<<<< HEAD
<<<<<<< HEAD
                if (res)
=======
                if (res && !Contains(res, "No Pricing Markups"))
>>>>>>> d3d46cc... 120 add necessary files
=======
                if (res)
>>>>>>> 7ffe828... 120 modify command name
                {             
                    var data = JSON.parse(res);
                    var commands = data["Commands"];
                    var errors = data["Errors"];
                    
<<<<<<< HEAD
<<<<<<< HEAD
                    $(".commands").html("");
                    for (var i = 0; i < commands.length; i++)
                    {                            
                        $(".commands").append(CreateOutputView(commands[i]));
                    }
                    
                    $(".errors").html("");
=======
=======
                    $(".commands").html("");
>>>>>>> b1467c5... 120 error and debug string logging with times
                    for (var i = 0; i < commands.length; i++)
                    {                            
                        $(".commands").append(CreateOutputView(commands[i]));
                    }
                    
<<<<<<< HEAD
>>>>>>> d3d46cc... 120 add necessary files
=======
                    $(".errors").html("");
>>>>>>> b1467c5... 120 error and debug string logging with times
                    for (var i = 0; i < errors.length; i++)
                    {
                        $(".errors").append(CreateOutputView(errors[i]));
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

<<<<<<< HEAD
=======
>>>>>>> 2fdafcb... 115 frontend functions
=======
>>>>>>> d3d46cc... 120 add necessary files
function GetPricing()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
            command: "get_pricing",
            endpoint: "Pricing"
        },
        success: function(res) 
        {
            try
            {
                if (res && !Contains(res, "No Pricing Markups"))
                {             
                    var data = JSON.parse(res);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        var oid = data[i]._id.$oid;
                            
                        $("#accordion").append(CreateAccordionPricingView(oid, data[i]));
<<<<<<< HEAD
<<<<<<< HEAD
                        
                        SetTextBoxWithAutoNumericPricing(oid);
=======
>>>>>>> 2fdafcb... 115 frontend functions
=======
                        
<<<<<<< HEAD
                        SetTextBoxWithAutoNumeric(oid);
>>>>>>> a1a8ea2... 115 autonumeric
=======
                        SetTextBoxWithAutoNumericPricing(oid);
>>>>>>> 6f2b485... 115 rest of ui adjustments
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

<<<<<<< HEAD
=======
>>>>>>> f518129... 107 universities
=======
>>>>>>> 2fdafcb... 115 frontend functions
function GetAllUniversities(isListingPage)
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
<<<<<<< HEAD
<<<<<<< HEAD
                        universitiesList.push(data[i].UniversityName);
=======
                        universities.push(data[i].UniversityName);
>>>>>>> f518129... 107 universities
=======
                        universitiesList.push(data[i].UniversityName);
>>>>>>> cdca1eb... 107 university stuff
                        if (isListingPage)
                        {
                            $("#universities-filter").append("<option value='" + data[i].UniversityName + "'>" + data[i].UniversityName + "</option>");
                        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cdca1eb... 107 university stuff
                        else
                        {
                            var oid = data[i]._id.$oid;
                            
                            $("#accordion").append(CreateAccordionUniversitiesView(oid, data[i]));
                            
                            SetGeocompleteTextBox(oid);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a9a7cb8... 119 distance limit
                            SetTextBoxWithAutoNumericUniversity(oid);
                        }
                    }
                    
                    if (isListingPage)
                    {
                        GetAllListings();
                    }
=======
                    }
                    
                    GetAllListings();
>>>>>>> f518129... 107 universities
=======
                        }
                    }
                    
                    if (isListingPage)
                    {
                        GetAllListings();
                    }
>>>>>>> cdca1eb... 107 university stuff
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
                        $.each(landlordList, function(index, landlord)
                        {
                            $("#landlords-filter").append("<option value='" + landlord + "'>" + landlord + "</option>")
                        });
                        
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        GetAllUniversities(true);
=======
                        $($("#createListingModal .ui-widget input")[1]).autocomplete(
                        {
                            source: function(request, response) 
                            {
                                var results = $.ui.autocomplete.filter(userList, request.term);

                                response(results.slice(0, 5)); // limit to 5 results at a time
                            }
                        });
                        
                        SetUserAndLandlordFields();
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
                        GetAllListings();
>>>>>>> 0dc8937... 107 updating deleting creating
=======
                        GetAllUniversities(true);
>>>>>>> f518129... 107 universities
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
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
                            
                            $(headingInputs[1]).text("Username: " + $(inputs[0]).val());
                            $(headingInputs[2]).text("First Name: " + $(inputs[1]).val());
                            $(headingInputs[3]).text("Last Name: " + $(inputs[2]).val());
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated User", position: 'top-center'});
                            
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
function UpdatePricing(oid)
=======
function SetUserAndLandlordFields()
{
    var users = $("#accordion .users");
    var landlords = $("#accordion .landlords");
    
    $.each(users, function(index, user) 
    {
        $(user).autocomplete(
        {
            source: function(request, response) 
            {
                var results = $.ui.autocomplete.filter(userList, request.term);

                response(results.slice(0, 5)); // limit to 5 results at a time
            } 
        });
    });
    
    $.each(landlords, function(index, landlord) 
    {
        $(landlord).autocomplete(
        {
            source: function(request, response) 
            {
                var results = $.ui.autocomplete.filter(landlordList, request.term);

                response(results.slice(0, 5)); // limit to 5 results at a time
            }
        });
    });
}

=======
>>>>>>> 0dc8937... 107 updating deleting creating
=======
=======
function UpdatePricing(oid)
{
    var pricingField = $("#" + oid + " input");
    
    var data = BuildData(pricingField, ["ListingMarkup", "FeaturedMarkup"]);
    
    data.id = oid;
    
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
                    $("#" + oid + " button").prop("disabled", true);
                    $($("#" + oid + " button")[0]).text("Updating...");
                },
                data:
                {
                    command: "update_pricing",
                    endpoint: "Pricing",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update Pricing", position: 'top-center'});
                        }
                        else if (Contains(res, "Okay"))
                        {
                            var inputs = $("#" + oid + " input");
                            var headingInputs = $("#heading" + oid + " label");
                            
                            $(headingInputs[1]).text("Listing Markup: " + $(inputs[0]).val() + "%");
                            $(headingInputs[2]).text("Featured Markup: " + $(inputs[1]).val() + "%");
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Pricing", position: 'top-center'});
                            
                            // close the div
                            $("#heading" + oid + " a").click();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                },
                complete: function()
                {
                    $("#" + oid + " button").prop("disabled", false);
                    $($("#" + oid + " button")[0]).text("Update");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    }
}

>>>>>>> 2fdafcb... 115 frontend functions
function UpdateUniversity(oid)
{
    var universityfield = $("#" + oid + " input");
    
    var data = BuildData(universityfield, ["UniversityName", "Address", "Threshold", "Latitude", "Longitude", "SelectedAddress"]);
    
    data.id = oid;
    
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
                    $("#" + oid + " button").prop("disabled", true);
                    $($("#" + oid + " button")[0]).text("Updating...");
                },
                data:
                {
                    command: "update_university",
                    endpoint: "Universities",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update University", position: 'top-center'});
                        }
                        else if (Contains(res, "Okay"))
                        {
                            var inputs = $("#" + oid + " input");
                            var headingInputs = $("#heading" + oid + " label");
                            
                            $(headingInputs[0]).text("University Name: " + $(inputs[0]).val());
                            $(headingInputs[1]).text("Address: " + $(inputs[1]).val());
                            $(headingInputs[2]).text("Listing Distance (miles): " + $(inputs[2]).val());
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated University", position: 'top-center'});
                            
                            // close the div
                            $("#heading" + oid + " a").click();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                },
                complete: function()
                {
                    $("#" + oid + " button").prop("disabled", false);
                    $($("#" + oid + " button")[0]).text("Update");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    }
}

>>>>>>> f518129... 107 universities
function SetBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":eq(4)").bootstrapSwitch({onText: "Yes", offText: "No"});
    //$(checkboxes[checkboxes.length - 3]).bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $(checkboxes[checkboxes.length - 2]).bootstrapSwitch({onText: "Apartment", offText: "House"});
}

function SetBootstrapSwitchesForUsers(rowId)
{
    $("#" + rowId + " input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function SetGeocompleteTextBox(rowId)
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
{
    var pricingField = $("#" + oid + " input");
    
<<<<<<< HEAD
    var data = BuildData(pricingField, ["ListingMarkup", "FeaturedMarkup"]);
    
    data.id = oid;
    
<<<<<<< HEAD
    var error = BuildError(data);
=======
    $(row[2]).geocomplete()
=======
    $(row[1]).geocomplete()
>>>>>>> 64bd5e4... 107 admin fixes, portal fixes, front page addition, unit fixes
        .bind("geocode:result", function(event, result){
            var keys = Object.keys(result.geometry.location);
            $(hidden[0]).val(result.geometry.location[keys[0]]);
            $(hidden[1]).val(result.geometry.location[keys[1]]);
            $(hidden[2]).val($(row[1]).val());
        });
}

function SetTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
    
<<<<<<< HEAD
    if (error != "Please Include ")
=======
    $(row[3]).autoNumeric('init', 
>>>>>>> 0dc8937... 107 updating deleting creating
    {
<<<<<<< HEAD
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'top-center'});
    }
    else
=======
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[5]).pikaday(
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
    {
<<<<<<< HEAD
        try
=======
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[3]).val()) //current
    });
}

function UpdateListing(oid)
{
    var inputs = $("#" + oid + " input, #" + oid + " select, #" + oid + " textarea");
    
    var data = BuildData(inputs, ["User", "Landlord", "Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "IsActive", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    //first validate that the fields are filled out
    var error = BuildError(data);
    
    data.id = oid;
    //data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
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
>>>>>>> 65a35be... 107 lease type and front page fixes
        {
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                beforeSend: function()
                {
                    $("#" + oid + " button").prop("disabled", true);
                    $($("#" + oid + " button")[0]).text("Updating...");
                },
                data:
                {
                    command: "update_pricing",
                    endpoint: "Pricing",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update Pricing", position: 'top-center'});
                        }
                        else if (Contains(res, "Okay"))
                        {
                            var inputs = $("#" + oid + " input");
                            var headingInputs = $("#heading" + oid + " label");
                            
                            $(headingInputs[1]).text("Listing Markup: " + $(inputs[0]).val() + "%");
                            $(headingInputs[2]).text("Featured Markup: " + $(inputs[1]).val() + "%");
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Pricing", position: 'top-center'});
                            
                            // close the div
                            $("#heading" + oid + " a").click();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                },
                complete: function()
                {
                    $("#" + oid + " button").prop("disabled", false);
                    $($("#" + oid + " button")[0]).text("Update");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    }
}

function UpdateUniversity(oid)
{
<<<<<<< HEAD
    var universityfield = $("#" + oid + " input");
=======
    var inputs = $("#" + oid + " input, #" + oid + " textarea");
    
    var data = BuildData(inputs, ["User", "Landlord", "Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "IsActive", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
    
    var data = BuildData(universityfield, ["UniversityName", "Address", "Threshold", "Latitude", "Longitude", "SelectedAddress"]);
    
    data.id = oid;
    
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
                    $("#" + oid + " button").prop("disabled", true);
                    $($("#" + oid + " button")[0]).text("Updating...");
                },
                data:
                {
                    command: "update_university",
                    endpoint: "Universities",
                    data: data
                },
                success: function(res)
                {    
                    try
                    {
                        if (!res)
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Update University", position: 'top-center'});
                        }
                        else if (Contains(res, "Okay"))
                        {
                            var inputs = $("#" + oid + " input");
                            var headingInputs = $("#heading" + oid + " label");
                            
                            $(headingInputs[0]).text("University Name: " + $(inputs[0]).val());
                            $(headingInputs[1]).text("Address: " + $(inputs[1]).val());
                            $(headingInputs[2]).text("Listing Distance (miles): " + $(inputs[2]).val());
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated University", position: 'top-center'});
                            
                            // close the div
                            $("#heading" + oid + " a").click();
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
                    $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
                },
                complete: function()
                {
                    $("#" + oid + " button").prop("disabled", false);
                    $($("#" + oid + " button")[0]).text("Update");
                }
            });
        }
        catch(e)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
        }
    }
}

function SetBootstrapSwitches(rowId)
{
    $("#" + rowId + " .yesno").bootstrapSwitch({onText: "Yes", offText: "No"});
    $("#" + rowId + " .leasetype").bootstrapSwitch({onText: "Rental", offText: "Sublet"});
    $("#" + rowId + " .buildingtype").bootstrapSwitch({onText: "Apartment", offText: "House"});
}

function SetBootstrapSwitchesForUsers(rowId)
{
    $("#" + rowId + " input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});
}

function SetGeocompleteTextBox(rowId)
{
    var row = $("#" + rowId + " div input[type='text']");
    var hidden = $("#" + rowId + " input[type='hidden']");
    
    $(row[1]).geocomplete()
        .bind("geocode:result", function(event, result){
            var keys = Object.keys(result.geometry.location);
            $(hidden[0]).val(result.geometry.location[keys[0]]);
            $(hidden[1]).val(result.geometry.location[keys[1]]);
            $(hidden[2]).val($(row[1]).val());
        });
}

function SetTextBoxWithAutoNumeric(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
    $(row[3]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a9a7cb8... 119 distance limit
function SetTextBoxWithAutoNumericUniversity(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
    $(row[2]).autoNumeric('init', 
<<<<<<< HEAD
<<<<<<< HEAD
    { 
        vMax: '999.9999',
        vMin: '00.0000'
    });
}

=======
>>>>>>> a1a8ea2... 115 autonumeric
=======
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
=======
    { 
<<<<<<< HEAD
        vMax: '999.99',
        vMin: '00.00'
>>>>>>> 5e5dc97... 119 autonumeric
=======
        vMax: '999.9999',
        vMin: '00.0000'
>>>>>>> 47ff52d... 119 more decimals
    });
}

>>>>>>> a9a7cb8... 119 distance limit
function SetTextBoxWithAutoNumericPricing(rowId)
{
    var row = $("#" + rowId + " input[type='text']");
    
<<<<<<< HEAD
<<<<<<< HEAD
    $(row[0]).autoNumeric('init', 
    {
        aSign: '%', 
        pSign: 's',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5d7805a... 119 heading
        vMax: '99.99',
=======
        vMax: '100.00',
>>>>>>> ce68029... 119 heading
<<<<<<< HEAD
=======
        vMax: '99.99',
>>>>>>> 25d12c8... 115 100 exclusive
=======
>>>>>>> 5d7805a... 119 heading
        vMin: '0.00'
    });
    
    $(row[1]).autoNumeric('init', 
    {
        aSign: '%', 
        pSign: 's', 
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        vMax: '99.99',
=======
        vMax: '100.00',
>>>>>>> ce68029... 119 heading
=======
        vMax: '99.99',
>>>>>>> 25d12c8... 115 100 exclusive
        vMin: '0.00'
=======
    $(row[1]).autoNumeric('init', 
=======
    $(row[0]).autoNumeric('init', 
>>>>>>> 81816df... 115 adjust index
    {
        aSign: '%', 
        pSign: 's',
        vMax: '99',
        vMin: '0'
=======
        vMax: '100.00',
=======
        vMax: '99.99',
=======
        vMax: '100.00',
>>>>>>> ce68029... 119 heading
>>>>>>> 5d7805a... 119 heading
        vMin: '0.00'
>>>>>>> 1e9e699... 115 decimals
    });
    
    $(row[1]).autoNumeric('init', 
    {
        aSign: '%', 
        pSign: 's', 
<<<<<<< HEAD
        vMax: '99',
        vMin: '0'
>>>>>>> a1a8ea2... 115 autonumeric
=======
        vMax: '100.00',
        vMin: '0.00'
>>>>>>> 1e9e699... 115 decimals
    });
}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[4]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[3]).val()) //current
    });
}

function UpdateListing(oid)
{
    var inputs = $("#" + oid + " input, #" + oid + " select, #" + oid + " textarea");
    
    var data = BuildData(inputs, ["User", "Landlord", "Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "IsActive", "IsFeatured", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
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
            var data = { "id": uid };
            
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
        }  
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
    
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "User", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "Landlord", "User", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 65a35be... 107 lease type and front page fixes
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "BuildingType", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> 0dc8937... 107 updating deleting creating
=======
    var data = BuildData(inputs, ["Address", "Unit", "Rent", "Start", "University", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
>>>>>>> c7605ad... 132 lease type
    
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
            
            if (numAdded["create"] == 0)
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
                            
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4e2c6fb... 107 active changes
                            if (numUploaded[oid] > 0)
                            {
                                $("#" + oid + " .activecheckbox").prop("disabled", false);
                            }
                            
<<<<<<< HEAD
=======
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
>>>>>>> 4e2c6fb... 107 active changes
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
<<<<<<< HEAD
<<<<<<< HEAD
                        window.location = "/admin/listings/#success";
                        window.location.reload();
=======
                        var inputs = $("#" + id + " input");
                        var headingInputs = $("#heading" + id + " label");
                        
                        $(headingInputs[0]).text("Address: " + $(inputs[1]).val());
                        $(headingInputs[1]).text("Unit: " + $(inputs[2]).val());
                        $(headingInputs[2]).text("Rent: $" + $(inputs[3]).autoNumeric('get') + "/Month");
                        $(headingInputs[3]).text("Start Date: " + $.datepicker.formatDate('mm/dd/yy', new Date($(inputs[4]).val())));
                        $(headingInputs[4]).text("University: " + $(inputs[5]).val());
                        
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
                        numUploaded[id] = 0;
                        addedFiles[id] = false;
                        pendingUpdateData = null;
                        
                        // close the div
                        $("#heading" + id + " a").click();
>>>>>>> 0dc8937... 107 updating deleting creating
=======
                        window.location = "/admin/listings/#success";
>>>>>>> da5fc3d... 119 hash usage
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
                addedFiles[id] = false;
                numUploaded[id] = 0;
                pendingUpdateData = null;
<<<<<<< HEAD
            }
        });
    }
}

function AddUniversity()
{
    var universityfield = $("#addUniversityModal input");
    
    var data = BuildData(universityfield, ["UniversityName", "Address", "Threshold", "Latitude", "Longitude", "SelectedAddress"]);
    
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
                $("#add-university-button").text("Creating...");
                $("#add-university-button").prop("disabled", "true");
            },
            data:
            {
                command: "add_university",
                endpoint: "Universities",
                data: data
            },
            success: function(res)
            {    
                try
                {
                    if (!res)
                    {
                        throw new Error("Unable to Add University");
                    }
                    else
                    {
                        var university = JSON.parse(res);
                            
                        if (university["error"])
                        {
                            throw new Error(university["error"]);
                        }
                        else
                        {
                            if ($("#accordion").text() == "No Universities Yet")
                            {
                                $("#accordion").html("");
                            }
                            
                            var oid = university._id.$oid;
                            
                            $("#accordion").append(CreateAccordionUniversitiesView(oid, university));
                            
                            SetGeocompleteTextBox(oid);
                            
                            $("#addUniversityModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "University Added Successfully!", position: 'top-center'});
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
                $("#add-university-button").text("Add University");
                $("#add-university-button").prop("disabled", false);
=======
>>>>>>> 8946fe2... 107 active stuff
            }
        });
    }
}

function AddUniversity()
{
    var universityfield = $("#addUniversityModal input");
    
    var data = BuildData(universityfield, ["UniversityName", "Address", "Threshold", "Latitude", "Longitude", "SelectedAddress"]);
    
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
                $("#add-university-button").text("Creating...");
                $("#add-university-button").prop("disabled", "true");
            },
            data:
            {
                command: "add_university",
                endpoint: "Universities",
                data: data
            },
            success: function(res)
            {    
                try
                {
                    if (!res)
                    {
                        throw new Error("Unable to Add University");
                    }
                    else
                    {
                        var university = JSON.parse(res);
                            
                        if (university["error"])
                        {
                            throw new Error(university["error"]);
                        }
                        else
                        {
                            if ($("#accordion").text() == "No Universities Yet")
                            {
                                $("#accordion").html("");
                            }
                            
                            var oid = university._id.$oid;
                            
                            $("#accordion").append(CreateAccordionUniversitiesView(oid, university));
                            
                            SetGeocompleteTextBox(oid);
                            
                            $("#addUniversityModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "University Added Successfully!", position: 'top-center'});
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
                $("#add-university-button").text("Add University");
                $("#add-university-button").prop("disabled", false);
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
                $(".login-error").show();
                $(".login-error").text(res);
<<<<<<< HEAD
<<<<<<< HEAD
            },
            complete: function() 
            {
=======
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
            },
            complete: function() 
            {
>>>>>>> 5d4187a... 107 better message handling
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
<<<<<<< HEAD
                    location.href = "/#loggedout";
=======
                    location.href = "/";
>>>>>>> 6d15b60... 107 revert to old logout
=======
                    location.href = "/#loggedout";
>>>>>>> aad23d3... 121 logging out stuff as well as when logged in the pay rent button changes
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
<<<<<<< HEAD
=======
    $.post("/logout.php");
>>>>>>> 69861d1... 107 logout flow
=======
>>>>>>> 6d15b60... 107 revert to old logout
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
                    location.reload();
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
                    location.reload();
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d3d46cc... 120 add necessary files
            $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
        },
        complete: function()
        {
            $("#deletegenerated").prop("disabled", false);
<<<<<<< HEAD
=======
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
>>>>>>> d3d46cc... 120 add necessary files
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Rental", offText: "Sublet", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[1]).bootstrapSwitch({onText: "Apartment", offText: "House", 'state': true, 'setState': true});
=======
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Apartment", offText: "Sublet", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[1]).bootstrapSwitch({onText: "Apartment", offText: "Sublet", 'state': true, 'setState': true});
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
    $($("#createListingModal .type-content input")[1]).prop("checked", true);
=======
    //$($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Rental", offText: "Sublet", 'state': true, 'setState': true});
    //$($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Apartment", offText: "House", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
>>>>>>> 65a35be... 107 lease type and front page fixes
=======
    $($("#createListingModal .type-content input")[0]).bootstrapSwitch({onText: "Rental", offText: "Sublet", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[0]).prop("checked", true);
    $($("#createListingModal .type-content input")[1]).bootstrapSwitch({onText: "Apartment", offText: "House", 'state': true, 'setState': true});
    $($("#createListingModal .type-content input")[1]).prop("checked", true);
>>>>>>> 131255e... 132 bootstrap switches
    
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

function InitSpecialFieldsUniversity()
{    
    var universityModal = $("#addUniversityModal input");

    $(universityModal[1]).geocomplete()
        .bind("geocode:result", function(event, result){
            var hiddenFields = $("#addUniversityModal input[type='hidden']");
            var keys = Object.keys(result.geometry.location);
            $(hiddenFields[0]).val(result.geometry.location[keys[0]]);
            $(hiddenFields[1]).val(result.geometry.location[keys[1]]);
<<<<<<< HEAD
<<<<<<< HEAD
            $(hiddenFields[2]).val($(universityModal[1]).val());
=======
            $(hiddenFields[2]).val($(listingModal[0]).val());
>>>>>>> f518129... 107 universities
=======
            $(hiddenFields[2]).val($(universityModal[1]).val());
>>>>>>> aad98c9... 115 fixes to university
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
<<<<<<< HEAD
        if (elements[i] == "Animals" || elements[i] == "Laundry" || elements[i] == "Parking" || elements[i] == "AirConditioning" || elements[i] == "LeaseType" || elements[i] == "BuildingType" || elements[i] == "IsActive" || elements[i] == "IsAdmin" || elements[i] == "IsVerified" || elements[i] == "IsLandlord" || elements[i] == "IsRented" || elements[i] == "IsFeatured")
=======
        if (elements[i] == "Animals" || elements[i] == "Laundry" || elements[i] == "Parking" || elements[i] == "AirConditioning" || elements[i] == "LeaseType" || elements[i] == "BuildingType" || elements[i] == "IsActive" || elements[i] == "IsAdmin" || elements[i] == "IsVerified" || elements[i] == "IsLandlord" || elements[i] == "IsRented")
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        else if (elements[i] == "Rent" || elements[i] == "ListingMarkup" || elements[i] == "FeaturedMarkup")
=======
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University")
=======
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University" || elements[i] == "UniversityName")
>>>>>>> f518129... 107 universities
        {
            data[elements[i]] = $(inputs[i]).val().replace("'", "&#39;").replace("\"", "&#34;");
        }
=======
>>>>>>> 2fdafcb... 115 frontend functions
        else if (elements[i] == "Rent")
>>>>>>> 0dc8937... 107 updating deleting creating
=======
        else if (elements[i] == "Rent" || elements[i] == "ListingMarkup" || elements[i] == "FeaturedMarkup")
>>>>>>> aeb5bbb... 115 fix for pricing update
        {
            data[elements[i]] = $(inputs[i]).autoNumeric('get');
        }
        else
        {
            if ($(inputs[i]).attr("placeholder") !== "")
<<<<<<< HEAD
            {
                data[elements[i]] = $(inputs[i]).val().trim();
            }
            else
<<<<<<< HEAD
=======
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
>>>>>>> 2fdafcb... 115 frontend functions
            {
                data[elements[i]] = $(inputs[i]).val().replace("'", "&#39;").replace("\"", "&#34;");
            }
        }
    }
    
    return data;
}

function BuildError(fields)
{
    var errorArr = [];
    
    var beginning = "Please Include ";
    
    if (fields.UniversityName === "")
    {
        errorArr.push("Valid University Name");
    }
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
    if (fields.ListingMarkup === "")
    {
        errorArr.push("Valid Listing Markup");
    }
    if (fields.FeaturedMarkup === "")
    {
        errorArr.push("Valid Featured Markup");
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
    var landlords = "";
    $.each(landlordList, function(index, landlord) {
        landlords += "<option value='" + landlord + "'" + (data.Landlord == landlord ? "selected" : "") + ">" + landlord + "</option>";
    });
    
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f518129... 107 universities
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
>>>>>>> f518129... 107 universities
    var notes = data.Notes.replace("#39", "'").replace("#34", "\"");
    
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
                                "<label>User</label><input type='text' class='form-control users' value='" + (data.Username ? data.Username : "") + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
<<<<<<< HEAD
<<<<<<< HEAD
                                "<label>Landlord</label>" + 
                                "<select class='form-control'>" + landlords + "</select>" +
                            "</div>" + 
=======
                                "<label>Landlord</label><input type='text' class='form-control landlords' value='" + (data.Landlord ? data.Landlord : "") + "' /> " + 
                            "</div>" +
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
                                "<label>Landlord</label>" + 
                                "<select class='form-control'>" + landlords + "</select>" +
                            "</div>" + 
>>>>>>> 0dc8937... 107 updating deleting creating
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
<<<<<<< HEAD
<<<<<<< HEAD
                                "<label>University</label>" +
                                "<select class='form-control'>" + universities + "</select>" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bedrooms</label>" + 
                                "<select class='form-control'>" + bedrooms + "</select>" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label>" + 
                                "<select class='form-control'>" + bathrooms + "</select>" +
=======
                                "<label>University</label><input type='text' class='form-control' value='" + data.University + "' />" +
=======
                                "<label>University</label>" +
                                "<select class='form-control'>" + universities + "</select>" +
>>>>>>> f518129... 107 universities
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bedrooms</label><input type='text' class='form-control' value='" + data.Bedrooms + "' />" +
                            "</div>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Bathrooms</label><input type='text' class='form-control' value='" + data.Bathrooms + "' />" +
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
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
<<<<<<< HEAD
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Lease Type</label><input class='leasetype' type='checkbox' " + (data.LeaseType == "rental" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
=======
                            //"<div class='col-lg-3 col-md-3 col-sm-3'>" +
                            //    "<label>Lease Type</label><input type='checkbox' " + (data.LeaseType == "rental" //? "checked" : "") + " data-size='mini' />" +
                            //"</div>" +
>>>>>>> 65a35be... 107 lease type and front page fixes
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Building Type</label><input class='buildingtype' type='checkbox' " + (data.BuildingType == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px'>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Listing Active</label><input class='yesno activecheckbox' type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini'" + (data.Pictures == null || data.Pictures.length == 0 ? "disabled" : "") + "/>" +
                            "</div>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.Pictures == null || data.Pictures.length == 0 ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing, You Must Include Images!</label>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.IsPastThreshold ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing, The Address Must Be Within the University Radius!</label>" +                    
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px'>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Featured Listing</label><input class='yesno' type='checkbox' " + (data.IsFeatured ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row' style='margin-top: 10px'>" + 
                            "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                                "<label>Listing Active</label><input class='activecheckbox' type='checkbox' " + (data.IsActive ? "checked" : "") + " data-size='mini'" + (data.Pictures == null || data.Pictures.length == 0 ? "disabled" : "") + "/>" +
                            "</div>" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.Pictures == null || data.Pictures.length == 0 ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing, You Must Include Images!</label>" +
                                "<label style='color: red; " + (data.IsActive ? "display: none;" : (data.IsPastThreshold ? "" : "display: none;")) + "' class='activemsg'>To Activate This Listing, The Address Must Be Within the University Radius!</label>" +                    
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

function CreateAccordionUniversitiesView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>University Name: " + data.UniversityName + "</label>" +
                            "<label>Address: " + data.Address + "</label>" +
<<<<<<< HEAD
<<<<<<< HEAD
                            "<label>Listing Distance (miles): " + data.Threshold + "</label>" +
=======
>>>>>>> f518129... 107 universities
=======
                            "<label>Listing Distance (miles): " + data.Threshold + "</label>" +
>>>>>>> 33457ff... 119 getting distance calculations
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>University Name</label><input type='text' class='form-control' value='" + data.UniversityName + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Address</label><input type='text' class='form-control' value='" + data.Address + "' />" + 
                            "</div>" +
<<<<<<< HEAD
<<<<<<< HEAD
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Listing Distance (miles)</label><input type='text' class='form-control' value='" + data.Threshold + "' />" + 
                            "</div>" +
=======
>>>>>>> f518129... 107 universities
=======
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Listing Distance (miles)</label><input type='text' class='form-control' value='" + data.Threshold + "' />" + 
                            "</div>" +
>>>>>>> 33457ff... 119 getting distance calculations
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='UpdateUniversity(\"" + oid + "\");'>Update</button>" +
                            "</div>" +
                        "</div>" +
<<<<<<< HEAD
<<<<<<< HEAD
                        "<input type='hidden' value='" + data.WorldCoordinates.x + "' /><input type='hidden' value='" + data.WorldCoordinates.y + "' /><input type='hidden' value='" + data.Address + "' />" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function CreateAccordionPricingView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>University Name: " + data.UniversityName + "</label>" +
                            "<label>Listing Markup: " + data.ListingMarkup + "%</label>" +
                            "<label>Featured Markup: " + data.FeaturedMarkup + "%</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Listing Markup</label><input type='text' class='form-control' value='" + data.ListingMarkup + "' />" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Featured Markup</label><input type='text' class='form-control' value='" + data.FeaturedMarkup + "' />" + 
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='UpdatePricing(\"" + oid + "\");'>Update</button>" +
                            "</div>" +
                        "</div>" +
=======
>>>>>>> f518129... 107 universities
=======
                        "<input type='hidden' value='" + data.WorldCoordinates.x + "' /><input type='hidden' value='" + data.WorldCoordinates.y + "' /><input type='hidden' value='" + data.Address + "' />" +
>>>>>>> 1dc4dd0... 119 fix update
                    "</div>" +
                "</div>" +
            "</div>";
}

function CreateAccordionPricingView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>University Name: " + data.UniversityName + "</label>" +
                            "<label>Listing Markup: " + data.ListingMarkup + "%</label>" +
                            "<label>Featured Markup: " + data.FeaturedMarkup + "%</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Listing Markup</label><input type='text' class='form-control' value='" + data.ListingMarkup + "' />" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Featured Markup</label><input type='text' class='form-control' value='" + data.FeaturedMarkup + "' />" + 
                            "</div>" +
                        "</div>" +
                        "<div class='row' style='margin-top: 10px;' >" +
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<button class='btn btn-primary btn-success' onclick='UpdatePricing(\"" + oid + "\");'>Update</button>" +
                            "</div>" +
                        "</div>" +
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
                            "<label style='color: red;" + (Contains(data.Username, "Facebook") ? "" : "display: none;") + "'>" + (Contains(data.Username, "Facebook") ? "(Needs Update) (Facebook Id - " + data.FacebookId + ")" : "") + "</label>" +  
                            "<label>Username: " + (Contains(data.Username, "Facebook") ? "" : data.Username) + "</label>" + 
                            "<label>First Name: " + (data.FirstName == null ? "" : data.FirstName) + "</label>" + 
                            "<label>Last Name: " + (data.LastName == null ? "" : data.LastName) + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + uid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + uid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Username</label><input type='text' class='form-control' value='" + (Contains(data.Username, "Facebook") ? "" : data.Username) + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>First Name</label><input type='text' class='form-control' value='" + (data.FirstName == null ? "" : data.FirstName) + "' />" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Last Name</label><input type='text' class='form-control' value='" + (data.LastName == null ? "" : data.LastName) + "' />" +
                            "</div>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Phone Number</label><input type='text' class='form-control' value='" + (Contains(data.PhoneNumber, "-") ? data.PhoneNumber : "") + "' />" +
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
                                "<label>Email Address</label><input type='text' class='form-control' value='" + (Contains(data.Email, "@") ? data.Email : "") + "' />" +
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
                                (data.IsAdmin ? "" : "<button class='btn btn-danger' onclick='DeleteAccount(\"" + uid + "\");'>Delete</button>") +
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

function CreateOutputView(data)
{
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    return "<p style='overflow-x: scroll'>" + data + "</p>";
}

=======
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
                    location.reload();
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
                    location.reload();
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
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
    return "<p>" + data + "</p>";
=======
    return "<p style='overflow-x: scroll'>" + data + "</p>";
>>>>>>> b1467c5... 120 error and debug string logging with times
}

>>>>>>> d3d46cc... 120 add necessary files
