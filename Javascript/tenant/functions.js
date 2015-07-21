
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
            if (!res)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to retrieve listings", position: 'bottom-right'});
            }
            else if (contains(res, "No Listings"))
            {
                $("#accordion").html("<p>No Listings Yet</p>");
            }
            else
            {
                $("#accordion").html("");
                try
                {
                    var data = JSON.parse(res);
                    
                    if (contains(res, "Error"))
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'bottom-right'});
                    }
                    else
                    {
                        for (var i = 0; i < data.length; i++)
                        {
                            var oid = data[i]._id.$oid;
                            
                            $("#accordion").append(createAccordionView(oid, data[i]));
                                
                            setGeocompleteTextBox(oid);
                            setTextBoxWithAutoNumeric(oid);
                            setDatePickerTextBox(oid);
                            setBootstrapSwitches(oid);
                            setTextBoxWithTags(oid);
                        }
                    }
                }
                catch (e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Finding Listings", position: 'bottom-right'});
                }
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Finding Listings", position: 'bottom-right'});
        }
    });
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
                    if (contains(res, "Okay"))
                    {
                        // remove the row that we just selected
                        $("#" + id).parent().remove();
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Deleted Successfully!", position: 'bottom-right'});
                    }
                    else
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Deleting Listing", position: 'bottom-right'});
                    }
                },
                error: function(res, err)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Deleting Listing", position: 'bottom-right'});
                }
            });
        }
    });
}

function update_listing(id)
{
    var inputs = $("#" + id + " input").not(":eq(6)");
    
    var data = buildData(inputs, ["address", "rent", "start", "bedrooms", "bathrooms", "tags", "animals", "laundry", "parking", "airConditioning", "type", "landlord", "latitude", "longitude", "selected_address"]);
    
    //first validate that the fields are filled out
    var error = buildError(data);
    
    data.id = id;
    data.university = "Northwestern";
    data.type = (data.type == true ? "apartment" : "sublet");
    data.landlord = (data.landlord == "" ? data.landlord = '-' : data.landlord);
    data.start = $.datepicker.formatDate('mm/dd/yy', new Date(data.start));
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'bottom-right'});
    }
    else
    {
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
                $("#" + id + " button").prop("disabled", true);
                $($("#" + id + " button")[0]).text("Updating...");
            },
            success: function(res)
            { 
                if (contains(res, "Okay"))
                {
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Updated Listing", position: 'bottom-right'});
                }
                else
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Updating Listing", position: 'bottom-right'});
                }
            },
            error: function(err, res)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Updating Listing", position: 'bottom-right'});
            },
            complete: function()
            {
                $("#" + id + " button").prop("disabled", false);
                $($("#" + id + " button")[0]).text("Update");
            }
        });
    }
}

function create_listing()
{
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(0)").not(":eq(12)");
    
    var data = buildData(inputs, ["address", "rent", "start", "bedrooms", "bathrooms", "animals", "laundry", "parking", "airConditioning", "type", "landlord", "tags", "latitude", "longitude", "selected_address"]);
    
    var error = buildError(data);
    
    data.university = "Northwestern";
    data.type = (data.type == true ? "apartment" : "sublet");
    data.landlord = (data.landlord == "" ? data.landlord = '-' : data.landlord);
    data.start = $.datepicker.formatDate('mm/dd/yy', new Date(data.start));
    
    if (error != "Please Include ")
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: error, position: 'bottom-right'});
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                $("#create-listing-button").text("Creating...");
                $("#create-listing-button").prop("disabled", false);
            },
            data:
            {
                command: "create_listing",
                data: data,
                endpoint: "Listings"
            },
            success: function(res)
            {    
                if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Create Listing!", position: 'bottom-right'});
                }
                else
                {
                    $("#accordion").html("");
                    try
                    {
                        var listing = JSON.parse(res);
                        
                        if (listing["error"])
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: listing["error"], position: 'bottom-right'});
                        }
                        else
                        {
                            var oid = listing._id.$oid;
                            
                            $("#accordion").append(createAccordionView(oid, listing));
                                
                            setGeocompleteTextBox(oid);
                            setTextBoxWithAutoNumeric(oid);
                            setDatePickerTextBox(oid);
                            setBootstrapSwitches(oid); 
                            setTextBoxWithTags(oid)
                            
                            $("#createListingModal").modal('hide');
                            
                            $.msgGrowl ({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'bottom-right'});
                        }
                    }
                    catch (e)
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: "Listing Creation Error", position: 'bottom-right'});
                    }
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Listing Creation Error", position: 'bottom-right'});
            },
            complete: function()
            {
                $("#create-listing-button").text("Create New Listing");
                $("#create-listing-button").prop("disabled", false);
            }
        });
    }
}

function login()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    if (!username || !password)
    {
        $(".login-error").text("Please enter Username and Password");
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
                if (contains(res, "Okay"))
                {
                    if (contains(res, "Landlord"))
                    {
                        quick_logout(); // clears the session variables
                        $(".login-error").show();
                        $(".login-error").text("Landlords Cannot Login To Tenant Portal");
                    }
                    else
                    {
                        location.href="/tenant/listings/"
                    }
                }
                else
                {
                    $(".login-error").show();
                    $(".login-error").text("Problem Logging In");
                }
            },
            error: function(res, err)
            {
                $(".login-error").show();
                $(".login-error").text("Problem Logging In");
            },
            complete: function() 
            {
                $(".login-action").text("Sign In");
                $(".login-action").prop("disabled", false);
            }
        });
    }
}

function quick_logout()
{
    $.post("/logout.php");
}

function logout()
{
    $.ajax(
    {
        type: "POST",
        url: "/logout.php",
        success: function(res)
        {
            if (contains(res, "Successfully"))
            {
                // TODO: Ideally I'd like this to be a server redirect in PHP, location would
                // be a POST element, this is good for now
                location.href = "/tenant/login.php";
            }
            else
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Logout Error", position: 'bottom-right'});
            }
        },
        error: function(err, res)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: "Logout Error", position: 'bottom-right'});
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
    
    $(listing_modal[1]).geocomplete()
        .bind("geocode:result", function(event, result){
            $($("#createListingModal input[type='hidden']")[0]).val(result.geometry.location.A);
            $($("#createListingModal input[type='hidden']")[1]).val(result.geometry.location.F);
            $($("#createListingModal input[type='hidden']")[2]).val($(listing_modal[1]).val());
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
    if (fields.start === "")
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

function createAccordionView(oid, data)
{
    return "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='heading" + oid + "'>" +
                    "<h4 class='panel-title'>" +
                        "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + oid + "' aria-expanded='false' aria-controls='" + oid + "'>" +
                            "<label>Address: " + data.Address + "</label>" + 
                            "<label>Rent: $" + data.Price + "/Month</label>" + 
                            "<label>Start Date: " + formattedDate(data.Start) + "</label>" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + oid + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + oid + "'>" +
                    "<div class='panel-body'>" +
                        "<div class='row'>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Address</label><input type='text' class='form-control' value='" + data.Address + "' /> " + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Rent/Month</label><input type='text' class='form-control' value='" + data.Price + "' />" + 
                            "</div>" +
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
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
                                "<label>Tags</label><input type='text' class='form-control' value='" + (data.Tags ? data.Tags.join(",") : "") + "' data-role='tagsinput' />" + 
                            "</div>" + 
                        "</div>" +
                        "<div class='row'>" +
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Animals</label><input type='checkbox' " + (data.Animals ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Laundry</label><input type='checkbox' " + (data.Laundry ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>Parking</label><input type='checkbox' " + (data.Parking ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                                "<label>AC</label><input type='checkbox' " + (data.AirConditioning ? "checked" : "") + " data-size='mini' />" +
                            "</div>" + 
                            "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                                "<label>Type</label><input type='checkbox' " + (data.Type == "apartment" ? "checked" : "") + " data-size='mini' />" +
                            "</div>" +
                        "</div>" + 
                        "<div class='row'>" + 
                            "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                                "<label>Landlord (Optional)</label><input type='text' class='form-control' value='" + (data.Landlord ? data.Landlord : "") + "' />" +
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