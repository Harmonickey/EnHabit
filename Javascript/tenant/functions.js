
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
        url: "/tenant/tenant_api.php",
        beforeSend: function()
        {
            //spinner on accordion area
        },
        data: 
        {
            command: "get_listings_by_user"
        },
        success: function(res) 
        {
            if (!res)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to retrieve listings", position: 'bottom-right'});
            }
            else if (contains(res, "No Listings"))
            {
                //then notification if there is nothing in the accordion area...
            }
            else
            {
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
                            $("#accordion").append(
                                "<div class='panel panel-default'>" +
                                    "<div class='panel-heading' role='tab' id='heading" + data[i]._id.$oid + "'>" +
                                        "<h4 class='panel-title'>" +
                                            "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + data[i]._id.$oid + "' aria-expanded='false' aria-controls='" + data[i]._id.$oid + "'>" +
                                                "<label>Address</label><input type='text' class='form-control' value='" + data[i].address + "' /> " + 
                                                "<label>Price</label><input type='text' class='form-control' value='" + data[i].price + "' />" + 
                                                "<label>Start Date</label><input type='text' class='form-control' value='" + formattedDate(data[i].start) + "' />" + 
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
                                            "<label>AC</label><input type='checkbox' " + (data[i].airConditioning ? "checked" : "") + " data-size='mini' />" +
                                            "<label>Type</label><input type='checkbox' " + (data[i].type ? "checked" : "") + " data-role='tabsinput' />" +
                                            "<button class='btn btn-primary' onclick='update_listing(\"" + data[i]._id.$oid + "\");'>Update</button>" + 
                                            "<button class='btn btn-danger' onclick='delete_listing(\"" + data[i]._id.$oid + "\");'>Delete</button>" +
                                            "<input type='hidden' value='" + data[i].worldCoordinates.x + "' /><input type='hidden' value='" + data[i].worldCoordinates.y + "' /><input type='hidden' value='" + data[i].address + "' />" +
                                        "</div>" +
                                    "</div>" +
                                "</div>");
                                
                            setGeocompleteTextBox(data[i]._id.$oid);
                            setTextBoxWithAutoNumeric(data[i]._id.$oid);
                            setDatePickerTextBox(data[i]._id.$oid);
                            setBootstrapSwitches(data[i]._id.$oid);
                        }
                    }
                }
                catch (e)
                {
                    
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

function setBootstrapSwitches(rowId)
{
    $("#" + rowId + " input[type='checkbox']").bootstrapSwitch({onText: "Yes", offText: "No"});;
    $("#" + rowId + " input[data-role='tabsinput']").bootstrapSwitch({onText: "Apartment", offText: "Sublet"});
}

function setGeocompleteTextBox(rowId)
{
    var row = $("#heading" + rowId + " div input[type='text']");
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
    var row = $("#heading" + rowId + " input[type='text']");
    
    $(row[1]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
}

function setDatePickerTextBox(rowId)
{
    $($("#heading" + rowId + " input[type='text']")[2]).pikaday(
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
                url: "/tenant/tenant_api.php",
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
    var inputs = $("#createListingModal input, #createListingModal select").not(":eq(0)").not(":eq(11)");
    
    var data = buildData(inputs, ["address", "rent", "start", "bedrooms", "bathrooms", "animals", "laundry", "parking", "airConditioning", "type", "tags", "latitude", "longitude", "selected_address"]);
    
    var error = buildError(data);
    
    data.university = "Northwestern";
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
            url: "/tenant/tenant_api.php",
            beforeSend: function()
            {
                $("#createListingModal button").text("Creating...");
                disableButtons();
            },
            data:
            {
                command: "create_listing",
                data: data
            },
            success: function(res)
            {    
                if (!res)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Unable to Create Listing!", position: 'bottom-right'});
                }
                else
                {
                    try
                    {
                        var listing = JSON.parse(res);
                        
                        if (listing["error"])
                        {
                            $.msgGrowl ({ type: 'error', title: 'Error', text: listing["error"], position: 'bottom-right'});
                        }
                        else
                        {
                            $("#accordion").prepend(
                                "<div class='panel panel-default'>" +
                                    "<div class='panel-heading' role='tab' id='heading" + listing._id.$oid + "'>" +
                                        "<h4 class='panel-title'>" +
                                            "<a role='button' data-toggle='collapse' data-parent='#accordion' href='#" + listing._id.$oid + "' aria-expanded='false' aria-controls='" + data[i]._id.$oid + "'>" +
                                                "<label>Address</label><input type='text' class='form-control' value='" + listing.address + "' /> " + 
                                                "<label>Price</label><input type='text' class='form-control' value='" + listing.price + "' />" + 
                                                "<label>Start Date</label><input type='text' class='form-control' value='" + formattedDate(listing.start) + "' />" + 
                                            "</a>" +
                                        "</h4>" +
                                    "</div>" +
                                    "<div id='" + listing._id.$oid + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + listing._id.$oid + "'>" +
                                        "<div class='panel-body'>" +
                                            "<label>Bedrooms</label><input type='text' class='form-control' value='" + listing.bedrooms + "' />" +
                                            "<label>Bathrooms</label><input type='text' class='form-control' value='" + listing.bathrooms + "' />" +
                                            "<label>Animals</label><input type='checkbox' " + (listing.animals ? "checked" : "") + " data-size='mini' />" +
                                            "<label>Laundry</label><input type='checkbox' " + (listing.laundry ? "checked" : "") + " data-size='mini' />" +
                                            "<label>Parking</label><input type='checkbox' " + (listing.parking ? "checked" : "") + " data-size='mini' />" +
                                            "<label>AC</label><input type='checkbox' " + (listing.airConditioning ? "checked" : "") + " data-size='mini' />" +
                                            "<label>Type</label><input type='checkbox' " + (listing.type ? "checked" : "") + " data-role='tabsinput' />" +
                                            "<button class='btn btn-primary' onclick='update_listing(\"" + listing._id.$oid + "\");'>Update</button>" + 
                                            "<button class='btn btn-danger' onclick='delete_listing(\"" + listing._id.$oid + "\");'>Delete</button>" +
                                            "<input type='hidden' value='" + listing.worldCoordinates.x + "' /><input type='hidden' value='" + listing.worldCoordinates.y + "' /><input type='hidden' value='" + data[i].address + "' />" +
                                        "</div>" +
                                    "</div>" +
                                "</div>");
                                
                            setGeocompleteTextBox(listing._id.$oid);
                            setTextBoxWithAutoNumeric(listing._id.$oid);
                            setDatePickerTextBox(listing._id.$oid);
                            setBootstrapSwitches(listing._id.$oid); 
                        }
                    }
                    catch (e)
                    {
                        
                    }
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

function login_tenant()
{
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    if (!username || !password)
    {
        $("#tenant-login-error").text("Please enter Username and Password");
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/tenant/tenant_api.php",
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
                user: username
            },
            success: function(res)
            {
                if (contains(res, "Okay"))
                {
                    location.href="/tenant/listings/"
                }
                else
                {
                    $("#tenant-login-error").show();
                    $("#tenant-login-error").text(res);
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

function logout_tenant()
{
    $.ajax(
    {
        type: "POST",
        url: "/tenant/logout.php",
        success: function(res)
        {
            if (contains(res, "Successfully"))
            {
                // ideally I'd like this to be a server redirect in PHP
                location.href = "/tenant/login.php";
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
        if (elements[i] == "animals" || elements[i] == "laundry" || elements[i] == "parking" || elements[i] == "airConditioning" || elements[i] == "type")
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