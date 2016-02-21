// this is the temporary jquery version,
// it would do very very well with knockout.js observables
// and a PowerKioskServiceModel viewmodel controlling them

var apiUrl = "https://powerkioskapp.com/api";
var utility;
var zone;
var state;
var defaultZone;

$.ajaxSetup({
    headers: 
    {
        Authorization: "Basic aGJhYmFpQHBvd2Vya2lvc2suY29tOkhhbWVkYmFiYWlAMQ=="
    },
    error: function()
    {
        $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Bad Connection to API - Try Again!", position: 'top-center'});
    }
});

$(function() 
{  
    InitZipCodeBox();
    
    SetClickListeners();
    
    GetServiceTypes();
    
    var height = $("html").height();
    $("body").css("min-height", height + "px");
});

$(window).on("resize", function() {
   SetInnerCoverHeight();

   // this magically fixes the screen rotate issue!
   $("#businessTypes").removeClass('nav-justified');
   setTimeout(function()
   {
       $("#businessTypes").addClass('nav-justified');
   }, 1);   
});

function InitZipCodeBox()
{
    $("#zipCode").autoNumeric('init', 
    { 
        vMax: '99999', 
        vMin: '0',
        aSep: '',
        lZero: 'keep'
    }).on("keyup", function() 
    {
        if ($(this).val().length == 5)
        {            
            $("#utilityAlert").hide(); 
            $("#zoneAlert").hide();
            GetUtilities();
        }
    });
    
    // in case of pressing "back" in the browser
    if ($("#zipCode").val().length == 5)
    {
        GetUtilities();
    }
}

function SetClickListeners()
{
    // update utilities upon click
    $("#utilities").on("click", "li", function(e) 
    {
        CloseList("#utilitiesContainer");
        $("#submitContainer").hide(); // hide the submit button for now
        $("#zonesContainer").hide();
        utility = $(this).attr("value"); // set global
        UtilityChange($(this).text() + "<span class='caret'></span>");
        LoadZones();
    });
    
    // update zones upon click
    $("#zones").on("click", "li", function(e) 
    {
        CloseList("#zonesContainer");
        $("#submitContainer").show(); // show the submit button, we have all the information now
        zone = $(this).attr("value"); // set global
        ZoneChange($(this).text() + "<span class='caret'></span>");
    });
    
    $('#serviceTypes').on("click", "li", function(e) 
    {
        $("#serviceTypes li").removeClass("active");
        $(this).addClass("active");
        e.preventDefault();
      
        if ($("#zipCode").val().length == 5)
        {
            GetUtilities();
        }
        else
        {
            ResetFields();
        }
    });
}

function CloseList(element)
{
    $(element).parent().removeClass("open");
    $(element + " button").attr("aria-expanded", "false");
}

function AlignListLeft(element)
{
    var left = ($(element + "Container").outerWidth() / 2) - ($(element).width() / 2) + 0.5;
               
    $(element).css("left", left + "px");
}

function FadeInAndAdjustHeight(element)
{   
    var initialHeight = $(".inner.cover").height();   
    $(element + "Container").fadeIn();
    var laterHeight = $(".inner.cover").height();    
    //$("html").height($("html").height() + (laterHeight - initialHeight));
}

function ResetFields()
{
    var utilities = $("#utilities");
    var zones = $("#zones");
    
    zones.empty();
    utilities.empty();
    
    $("#utilitiesContainer").hide();
    $("#zonesContainer").hide();
}

function GetServiceTypes()
{
    $.ajax(
    {
        type: 'GET',
        url: apiUrl + "/serviceTypes.json?isActive=1&sort=name",
        beforeSend: function() 
        {
            $("#loader1").show();
        },
        success: function(result) 
        {
            //create the tabs          
            var serviceIds = $("#serviceTypes");
            for (var i = 0; i < result.data.length; i++) 
            {
                serviceIds.append("<li role=\"presentation\"><a href=\"#\" value=\"" + result.data[i].serviceTypeID + "\">" + result.data[i].name + "</a></li>");
            }
            
            //setup the service tabs and their click events
            $($("#serviceTypes li")[0]).addClass("active");
        },
        complete: function() 
        {
            $("#loader1").hide();
        }
    });
}

function GetUtilities()
{
    $("#zipCode").prop("disabled", true);
    // clear out all fields
    ResetFields();
    
    var serviceType = $("#serviceTypes .active a").attr("value");
    var zipCode = $("#zipCode").val();
    if (serviceType === "" || zipCode === "") return;

    // load zip code
    $.ajax(
    {
        type: 'GET',
        url: apiUrl + "/zipCode/" + zipCode + ".json",
        success: function(result) 
        {
            state = result.data.stateID;
            defaultZone = null;
            
            if (result.data.defaultUtilityZone != null) {
                defaultZone = result.data.defaultUtilityZone;
            }
            
            // load utilities
            LoadUtilities(zipCode, serviceType);  
        },
        error: function() 
        {
            $("#utilityAlert").html("No Utilities Found For Your Area!");
            $("#utilityAlert").show();
            $("#zipCode").prop("disabled", false);
        }
    });
}

function LoadUtilities(zipCode, serviceType)
{
    $.ajax(
    {
        type: 'POST',
        url: apiUrl + "/utilities.json",
        data: 
        { 
            stateID: state, 
            serviceTypeID: serviceType, 
            isActive: 'true', 
            noChildren: 'true' 
        },
        success: function(result) 
        {    
            var selected = -1;
            var utilities = $("#utilities");
            for (var i = 0; i < result.data.length; i++) {
                var isSelected = (result.data[i].serviceZipCodes.search(zipCode) !== -1);
                utilities.append("<li value=\"" + result.data[i].utilityID + "\">" + result.data[i].name + "</li>");
                
                if (isSelected) selected = i;
            }
            
            if (result.data.length == 0)
            {
                $("#utilityAlert").html("No Utilities Found For Your Area!");
                $("#utilityAlert").show();
            }
            else
            {
                
                //set the default 
                if (selected != -1) 
                {
                    utility = $($("#utilities li")[selected]).attr("value");
                    
                    UtilityChange($($("#utilities li")[selected]).text() + "<span class='caret'></span>");
                }
                else
                {
                    utility = null;
                    
                    UtilityChange("Select Your Utility <span class='caret'></span>");
                }
                
                FadeInAndAdjustHeight("#utilities");
                
                AlignListLeft("#utilities");
                
                LoadZones();
            }
        },
        error: function() 
        {
            $("#utilityAlert").html("Could Not Load Utilities!");
            $("#utilityAlert").show();    
        },
        complete: function()
        {
            if (utility == null)
            {
                $("#zipCode").prop("disabled", false);
            }
        }
    });
}

function UtilityChange(selectedUtility)
{   
    $("#utilitiesDropdown").html(selectedUtility);
}

function ZoneChange(selectedZone)
{
    $("#zonesDropdown").html(selectedZone);
}

function LoadZones() {

    if (utility === null) return;

    if ($("#serviceTypes .active a").attr("value") == "297ed5063d424e7b013d429f0e850007")
    {
        $("#submitContainer").show();
        return;
    }
    
    // load zone
    $.ajax(
    {
        type: "POST",
        url: apiUrl + "/utility/zones.json", 
        data: 
        {
            stateID: state, 
            utilityID: utility, 
            isActive: 1
        },
        success: function(result) 
        {                
            var zones = $("#zones");
            zones.empty();
            
            var selected = -1;
            for (var i = 0; i < result.data.length; i++) {
                var isSelected = (result.data[i].name == defaultZone);
                zones.append("<li value=\"" + result.data[i].name + "\">" + result.data[i].name + "</li>");
                
                if (isSelected) selected = i;
            }
        
            if (result.data.length !== 0) 
            {
                if (selected != -1) 
                {
                    zone = $($("#zones li")[selected]).attr("value");
                    
                    ZoneChange($($("#zones li")[selected]).text() + "<span class='caret'></span>");
                                                          
                    $("#submitContainer").show(); // we can show this since we have all the info now
                }
                else
                {
                    zone = null;
                    
                    ZoneChange("Select Your Zone <span class='caret'></span>");
                }              
                
                FadeInAndAdjustHeight("#zones", selected);
                
                AlignListLeft("#zones");
            }
            else
            {
                $("#submitContainer").show();
            }
        },
        complete: function()
        {
            $("#zipCode").prop("disabled", false);
        }
    });
}

function SubmitQuery()
{
	//set the form data...
	SetHiddenInputs();
	
	//...then submit the data
	$("#getRates").click();
    $("#utilities").prop("disabled", true);
    $("#zones").prop("disabled", true);
    $("#zipCode").prop("disabled", true);
    $("#submit").prop("disabled", true);
    $("#submit").text("Getting Rates...");
}

function SetHiddenInputs()
{
	// hidden form values
	$("#zoneID").val(zone);
	$("#utilityID").val(utility);
	$("#zipCodeID").val($("#zipCode").val());
	$("#serviceTypeID").val($("#serviceTypes li.active a").attr("value")); //this sets utility service type!!!
	$("#stateID").val(state);
	$("#getRates").attr("name", $("#businessTypes li.active a").attr("value")); //this sets business type!!!
}