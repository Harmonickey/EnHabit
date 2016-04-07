function InitSpecialFields(selector)
{
    var listingModal = $(selector + " input");

    $(listingModal[3]).pikaday(
    {
        minDate: new Date(),
        setDefaultDate: new Date()
    });
}

function ModalBackdropHeight(modal) {
    modal.find(".modal-backdrop").css(
    {
        'min-height': modal.find(".modal-dialog").outerHeight(true) + 'px'
    });
}

function SetDefaultButtonOnEnter(modal) {
    if (modal !== "") {
        //reset for next set
        $(document).unbind("keypress");
        which_modal = "." + modal + "-btn";
    }
    else {
        which_modal = "";
    }

    $(document).on("keypress", function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $(".modal-body ." + modal + "-btn").click();
        }
    });
}

function ResetModal(modal, btnText, hide) {
    $("." + modal + "-btn").val(btnText);
    $("." + modal + "-btn").attr('disabled', false);
    if (hide) {
        $("." + modal + "-error").hide();
    }
}

function LoadModal(event, which, enterDefault, btnText) {
    PopulateAndOpenModal(event, which);
    ResetModal(enterDefault, btnText, true);
    SetDefaultButtonOnEnter(enterDefault);
    //also try to reset the modal backdrop height 
    //      because it's different for each modal

    ModalBackdropHeight($('#common-modal.modal'));
}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[3]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[2]).val()) //current
    });
}

function getDateFromUnix(date)
{
    var fullDate = new Date(parseInt(date.substring(6, 19)));

    var month = zeroPad(fullDate.getMonth() + 1);
    var day = zeroPad(fullDate.getDate());
    var hours = zeroPad(fullDate.getHours());
    var minutes = zeroPad(fullDate.getMinutes());
    var seconds = zeroPad(fullDate.getSeconds());

    return fullDate.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + ".0";
}

function zeroPad(num)
{
    return (num < 10 ? "0" + num : num);
}

function OpenListing(Id, Address, Unit, Start, Bedrooms, Bathrooms, Price, LeaseType, BuildingType, Notes, Animals, Laundry, Parking, AirConditioning, Images, Testing, Username, Landlord)
{
    $("#common-modal").modal('hide');

    $("#details-view").fadeIn();

    //load up the images into the modal...
    var slideshowContent = "";

    if (!Images || Images.length === 0) {
        Images = [];
        Images.push(self.DefaultPicture);
    }
    for (var i = 0; i < Images.length; i++) {
        var source = Images[i];

        slideshowContent +=
                            '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                              '<img src="' + source + '" height="200" width="300" />' +
                            '</div>';
    }

    var slideshowModalContent = '<div class="slideshow" style="position: relative;">';
    if (Images.length > 1) {
        slideshowModalContent += '<div class="slider-arrow slider-left"><img src="/Images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
        '<div class="slider-arrow slider-right"><img src="/Images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
    }

    slideshowModalContent += slideshowContent +
    '</div>';

    var notes = Notes.replace("#39", "'").replace("#34", "\"");

    var detailsContent =
    "<div class='container-fluid' style='padding-left: 40px;'>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>" + Address + " " + (Unit ? Unit : "") + "</h2>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>$" + Price + "/Month</h2>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>Available " + DateToHumanReadable(Start) + "</h2>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                (Landlord != 'undefined' ? "<h5>Listed By: " + Landlord + "</h5>" : (Username != 'undefined' ? "<h5>Listed By: " + Username + "</h5>" : "")) +
            "</div>" +
        "</div>" +
        "<div class='row' style='margin-top: 25px;'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground' style='border-top-left-radius: 10px;'>" +
                "<p>Bedrooms: " + Bedrooms + "</p>" +
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground' style='border-top-right-radius: 10px;'>" +
                "<p>Lease Type: " + LeaseType + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground'>" +
                "<p>Bathrooms: " + Bathrooms + "</p>" +
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground'>" +
                "<p>Building Type: " + BuildingType + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground'>" +
                "<p>Animals: " + Animals + "</p>" +
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground'>" +
                "<p>Air Conditioning: " + HasAirConditioning + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground' style='border-bottom-left-radius: 10px;'>" +
                "<p>Parking: " + Parking + "</p>" +
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground' style='border-bottom-right-radius: 10px;'>" +
                "<p>In-Unit Laundry: " + Laundry + "</p>" +
            "</div>" +
        "</div>" +
        (notes == null || notes == "" ? "" :
        "<div class='row' style='margin-top: 50px;'>" +
            "<div class='col-lg-8 col-md-8 col-sm-8 darkbackground'>" +
                "<p>" + (notes != "undefined" ? notes : "") + "</p>" +
            "</div>" +
        "</div>") +
    "</div>";

    var actionsContent =
    "<div class='col-lg-12 col-md-12 col-sm-12'>" +
        //"<div class='row'>" +
            //"<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Apply' onclick='Apply(\"" + Id + "\");' />" +
        //"</div>" +
        //"<div class='row'>" +
        //    "<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Share' //onclick='ShareListing(\"" + Id + "\");' />" +
        //"</div>" +
        "<div class='row'>" +
            "<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Contact' onclick='CreateEmailMessage(\"" + Id + "\");' />" +
        "</div>" +
    "</div>";

    $("#details-view-slideshow-section").html(slideshowModalContent);

    $("#details-view-listing-details").html(detailsContent);

    $("#details-view-actions").html(actionsContent);
    
    var width = $("#details-view").width();
    $("#details-items").width(width);
    var height = $("#details-view-slideshow-section .slideshow").height();
    $("#details-view-slideshow-section .slider-arrow").css("top", (height / 2) - 22);
}



