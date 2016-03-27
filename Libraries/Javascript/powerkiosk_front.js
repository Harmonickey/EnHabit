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

function InitializePowerKiosk()
{  
    InitZipCodeBox();
    
<<<<<<< HEAD
<<<<<<< HEAD
=======
    InitBusinessButton();
    
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
>>>>>>> 87c0aa4... 140 zone fixes
    SetClickListeners();
    
    GetServiceTypes();
    
    var height = $("html").height();
    $("body").css("min-height", height + "px");
}

$(window).on("resize", function() {
<<<<<<< HEAD
=======
   SetInnerCoverHeight();

>>>>>>> bbd3fb3... 140 power kiosk on front page
   // this magically fixes the screen rotate issue!
   $("#common-modal .businessTypes").removeClass('nav-justified');
   setTimeout(function()
   {
       $("#common-modal .businessTypes").addClass('nav-justified');
   }, 1);   
});

<<<<<<< HEAD
<<<<<<< HEAD
=======
function InitBusinessButton()
{
    $('#common-modal .businessTypes li').click(function(e) 
    {
        $("#common-modal .businessTypes li").removeClass("active");
        $(this).addClass("active");
        e.preventDefault();
    });
}

>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
>>>>>>> 87c0aa4... 140 zone fixes
function InitZipCodeBox()
{
    $("#common-modal .zipCode").autoNumeric('init', 
    { 
        vMax: '99999', 
        vMin: '0',
        aSep: '',
        lZero: 'keep'
    }).on("keyup", function() 
    {
        if ($(this).val().length == 5)
        {            
            $("#common-modal .utilityAlert").hide(); 
            $("#common-modal .zoneAlert").hide();
            GetUtilities();
        }
    });
    
    // in case of pressing "back" in the browser
    if ($("#common-modal .zipCode").val().length == 5)
    {
        GetUtilities();
    }
}

function SetClickListeners()
{
    // update utilities upon click
    $("#common-modal .utilities").change(function(e) 
    {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 87c0aa4... 140 zone fixes
        var zones = $("#common-modal .zones");
        zones.empty();
        $("#common-modal .zoneID").val("");
        zone = "";
        
<<<<<<< HEAD
=======
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
>>>>>>> 87c0aa4... 140 zone fixes
        $("#common-modal .submitContainer").hide(); // hide the submit button for now
        $("#common-modal .zonesContainer").hide();
        utility = $(this).val(); // set global
        LoadZones();
    });
    
    // update zones upon click
    $("#common-modal .zones").change(function(e) 
    {
        $("#common-modal .submitContainer").show(); // show the submit button, we have all the information now
        zone = $(this).val(); // set global
    });
    
    $('#common-modal .serviceTypes').on("click", "li", function(e) 
    {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 87c0aa4... 140 zone fixes
        var zones = $("#common-modal .zones");
        zones.empty();
        $("#common-modal .zoneID").val("");
        zone = "";
        
<<<<<<< HEAD
=======
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
>>>>>>> 87c0aa4... 140 zone fixes
        $("#common-modal .serviceTypes li").removeClass("active");
        $(this).addClass("active");
        e.preventDefault();
      
        if ($("#common-modal .zipCode").val().length == 5)
        {
            GetUtilities();
        }
        else
        {
            ResetFields();
        }
    });
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
    var utilities = $("#common-modal .utilities");
    var zones = $("#common-modal .zones");
    
    zones.empty();
    utilities.empty();
    
    $("#common-modal .utilitiesContainer").hide();
    $("#common-modal .zonesContainer").hide();
}

function GetServiceTypes()
{
    $.ajax(
    {
        type: 'GET',
        url: apiUrl + "/serviceTypes.json?isActive=1&sort=name",
        beforeSend: function() 
        {
            $("#common-modal .loader1").show();
        },
        success: function(result) 
        {
            //create the tabs          
            var serviceIds = $("#common-modal .serviceTypes");
            for (var i = 0; i < result.data.length; i++) 
            {
                serviceIds.append("<li role=\"presentation\"><a href=\"#\" value=\"" + result.data[i].serviceTypeID + "\">" + result.data[i].name + "</a></li>");
            }
            
            //setup the service tabs and their click events
            $($("#common-modal .serviceTypes li")[0]).addClass("active");
        },
        complete: function() 
        {
            $("#common-modal .loader1").hide();
        }
    });
}

function GetUtilities()
{
    $("#common-modal .zipCode").prop("disabled", true);
    // clear out all fields
    ResetFields();
    
    var serviceType = $("#common-modal .serviceTypes .active a").attr("value");
    var zipCode = $("#common-modal .zipCode").val();
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
<<<<<<< HEAD
<<<<<<< HEAD
            $("#common-modal .utilityAlert").html("No Utilities Found For Your Area!");
=======
            $("#common-modal .utilityAlert").html("No Utilities Found For Your Territory!");
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
            $("#common-modal .utilityAlert").html("No Utilities Found For Your Area!");
>>>>>>> 3129f4b... 140 territory to area
            $("#common-modal .utilityAlert").show();
            $("#common-modal .zipCode").prop("disabled", false);
        }
    });
}

function LoadUtilities(zipCode, serviceType)
<<<<<<< HEAD
<<<<<<< HEAD
{   
=======
{
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
{   
>>>>>>> 87c0aa4... 140 zone fixes
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
            var utilities = $("#common-modal .utilities");
            for (var i = 0; i < result.data.length; i++) {
                var isSelected = (result.data[i].serviceZipCodes.search(zipCode) !== -1);
                utilities.append("<option value=\"" + result.data[i].utilityID + "\">" + result.data[i].name + "</option>");
                
                if (isSelected) selected = i;
            }
            
            if (result.data.length == 0)
            {
<<<<<<< HEAD
<<<<<<< HEAD
                $("#common-modal .utilityAlert").html("No Utilities Found For Your Area!");
=======
                $("#common-modal .utilityAlert").html("No Utilities Found For Your Territory!");
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
                $("#common-modal .utilityAlert").html("No Utilities Found For Your Area!");
>>>>>>> 3129f4b... 140 territory to area
                $("#common-modal .utilityAlert").show();
            }
            else
            {
                //set the default 
                if (selected != -1) 
                {
                    $("#common-modal .utilities").val(result.data[selected].utilityID);
                }
                
                utility = $("#common-modal .utilities").val();
                
                FadeInAndAdjustHeight("#common-modal .utilities");
                ModalBackdropHeight($('#common-modal.modal'));
                
                var width = $("#common-modal .utilities option").width();
                $("#common-modal .utilitesContainer").width(width);
                
                LoadZones();
            }
        },
        error: function() 
        {
            $("#common-modal .utilityAlert").html("Could Not Load Utilities!");
            $("#common-modal .utilityAlert").show();    
        },
        complete: function()
        {
            if (utility == null)
            {
                $("#common-modal .zipCode").prop("disabled", false);
            }
        }
    });
}

function LoadZones() {

    if (utility === null) return;

    if ($("#common-modal .serviceTypes .active a").attr("value") == "297ed5063d424e7b013d429f0e850007")
    {
        $("#common-modal .submitContainer").show();
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
            var zones = $("#common-modal .zones");
            zones.empty();
            
            var selected = -1;
            for (var i = 0; i < result.data.length; i++) {
                var isSelected = (result.data[i].name == defaultZone);
                zones.append("<option value=\"" + result.data[i].name + "\">" + result.data[i].name + "</option>");
                
                if (isSelected) selected = i;
            }
            
            if (result.data.length !== 0) 
            {
                if (selected != -1)
                {
                    $("#common-modal .zones").val(result.data[selected].name);
                }
                
                zone = $("#common-modal .zones").val();
                                                         
                $("#common-modal .submitContainer").show(); // we can show this since we have all the info now            
                
                FadeInAndAdjustHeight("#common-modal .zones", selected);
                ModalBackdropHeight($('#common-modal.modal'));
                
                AlignListLeft("#common-modal .zones");
            }
            else
            {
                $("#common-modal .submitContainer").show();
            }
        },
        complete: function()
        {
            $("#common-modal .zipCode").prop("disabled", false);
        }
    });
}

function SubmitQuery()
{
	//set the form data...
	SetHiddenInputs();
	
	//...then submit the data
	$("#common-modal .getRates").click();
    $("#common-modal .utilities").prop("disabled", true);
    $("#common-modal .zones").prop("disabled", true);
    $("#common-modal .zipCode").prop("disabled", true);
    $("#common-modal .submit").prop("disabled", true);
    $("#common-modal .submit").text("Getting Rates...");
}

function SetHiddenInputs()
{
	// hidden form values
	$("#common-modal .zoneID").val(zone);
	$("#common-modal .utilityID").val(utility);
	$("#common-modal .zipCodeID").val($("#common-modal .zipCode").val());
	$("#common-modal .serviceTypeID").val($("#common-modal .serviceTypes li.active a").attr("value")); //this sets utility service type!!!
	$("#common-modal .stateID").val(state);
<<<<<<< HEAD
<<<<<<< HEAD
=======
	$("#common-modal .getRates").attr("name", $("#common-modal .businessTypes li.active a").attr("value")); //this sets business type!!!
>>>>>>> bbd3fb3... 140 power kiosk on front page
=======
>>>>>>> 87c0aa4... 140 zone fixes
}