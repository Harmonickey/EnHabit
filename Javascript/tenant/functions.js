
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
                        $("#accordion").html("<p>No Listing Yet</p>");
                        $(".actions a").show();                      
                    }
                    else if (contains(res, "No Matching Entries"))
                    {
                        $("#accordion").html("<p>No Listing Yet</p>");
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
                            
                            if (data.length == 0)
                            {
                                $(".actions a").show();
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

function getAccount()
{
    try
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
                    if (!res || contains(res, "Could Not Find User"))
                    {
                        throw new Error("Unable to retrieve account info");
                    }
                    else
                    {
                        $(".account .fa-spinner").remove();

                        var data = JSON.parse(res);
                        
                        if (contains(res, "Error"))
                        {
                            throw new Error(res);
                        }
                        else
                        {
                            fillAccountInfo(data);
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
                $(".account .fa-spinner").remove();
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function setBootstrapSwitches(rowId)
{
    var checkboxes = $("#" + rowId + " input[type='checkbox']");
    checkboxes.not(":last").bootstrapSwitch({onText: "Yes", offText: "No"});
    $(checkboxes[checkboxes.length - 1]).bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
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
    
    $(row[2]).autoNumeric('init', 
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
    $($("#" + rowId + " input[type='text']")[3]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[2]).val()) //current
    });
}

function fillAccountInfo(data)
{
    var inputs = $(".account input");
    
    // this only skips with facebook accounts
    if (!contains(data["Username"], "Facebook"))
    {
        $(inputs[0]).val(data["Username"]);
    }
    savedUsername = data["Username"];
    
    // and, this only skips with facebook accounts too
    if (contains(data["Email"], "@"))
    {
        $(inputs[1]).val(data["Email"]);
    }
    $(inputs[2]).val(data["FirstName"]);
    $(inputs[3]).val(data["LastName"]);
    $(inputs[4]).val(data["PhoneNumber"]);
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
                                $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'top-center'});
                                $(".actions a").show();
                                $("#accordion").text("No Listing Yet");
                                createDropzone("create", "#createListingModal form");
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

function update_listing(oid)
{
    var inputs = $("#" + oid + " input").not(":eq(7)");
    
    var data = buildData(inputs, ["address", "unit", "rent", "start", "bedrooms", "bathrooms", "tags", "animals", "laundry", "parking", "airConditioning", "type", "landlord", "latitude", "longitude", "selected_address"]);
    
    //first validate that the fields are filled out
    var error = buildError(data);
    
    data.oid = oid;
    data.university = "Northwestern";
    data.type = (data.type == true ? "apartment" : "sublet");
    data.address = data.address.split(",")[0];
    data.landlord = (data.landlord == "" ? data.landlord = '-' : data.landlord);
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
                            var inputs = $("#" + id + " input");
                            var headingInputs = $("#heading" + id + " input");
                            
                            for (var i = 0; i < 3; i++)
                            {
                                $(headingInputs[i]).val($(inputs[i]));
                            }
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'top-center'});
                            numUploaded = 0;
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
                    try
                    {
                        throw new Error(err + " " + res);
                    }
                    catch(e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function create_listing()
{
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(13)");
    
    var data = buildData(inputs, ["address", "unit", "rent", "start", "bedrooms", "bathrooms", "animals", "laundry", "parking", "airConditioning", "type", "landlord", "tags", "latitude", "longitude", "selected_address"]);
    
    var error = buildError(data);
    
    data.university = "Northwestern";
    data.type = (data.type == true ? "apartment" : "sublet");
    data.address = data.address.split(",")[0];
    data.landlord = (data.landlord == "" ? data.landlord = '-' : data.landlord);
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
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
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
                        setTextBoxWithTags(oid)
                        
                        $("#createListingModal").modal('hide');
                        
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center'});
                        
                        $(".actions a").hide();
                        
                        numUploaded = 0;
                        
                        pendingData = {};
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
                            if (contains(res, "Landlord"))
                            {
                                quick_logout(); // clears the session variables
                                throw new Error("Landlords Cannot Login to Tenant Portal");
                            }
                            else
                            {
                                location.href="/tenant/listings/"
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
                        location.href = "/tenant/login.php";
                    }
                    else
                    {
                        throw new Error("Problem Logging Out");
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

function update_account()
{
    var inputs = $(".account input");
    
    var data = buildData(inputs, ["username", "email", "firstname", "lastname", "phonenumber", "password", "confirm"]);
    
    //first validate that the fields are filled out
    var error = buildError(data);
    
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
                        if (contains(res, "Okay"))
                        {
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Account", position: 'top-center'});
                            $("#title_username").html("<i class='fa fa-user'></i>" + data.username + "<b class='caret'></b>");
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

function delete_account()
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
        
        var data = {"password": password};
        
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
                        if (contains(res, "Okay"))
                        {
                            logout();
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
    });
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
                        : (file.name.split(".").length > 1 ? file.name.split(".")[0] + "_" + Math.random().toString(36).slice(2) + "." + file.name.split(".")[file.name.split(".").length - 1]
                                                           : Math.random().toString(36).slice(2) + "_" + file.name));
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
            myDropzone.emit("thumbnail", mockFile, "/assets/images/listing_images/" + mockFile.name);
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
         || elements[i] == "airConditioning" || elements[i] == "type")
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
    if (fields.firstname == "")
    {
        error_arr.push("Valid First Name");
    }
    if (fields.lastname == "")
    {
        error_arr.push("Valid Last Name");
    }
    if (fields.email == "" || (fields.email != null && !isValidEmail(fields.email)))
    {
        error_arr.push("Valid Email");
    }
    if (fields.phonenumber == "" || (fields.phonenumber != null && !isValidPhoneNumber(fields.phonenumber)))
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
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Landlord</label><input type='text' class='form-control' value='" + (data.Landlord && data.Landlord !== "-" ? data.Landlord : "") + "' />" +
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