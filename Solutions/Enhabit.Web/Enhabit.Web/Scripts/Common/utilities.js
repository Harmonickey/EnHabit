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

function OpenListing(Address, Unit, Start, Bedrooms, Bathrooms, Price, LeaseType, BuildingType, Notes, Animals, Laundry, Parking, HasAirConditioning, Images, Testing, Username, Landlord)
{
    $("#common-modal").modal('hide');

    $("#details-view").fadeIn();

    var slideShowSource = {
        tag: 'div',
        clasName: 'slideshow',
        style: { position: 'relative' },
        init: function ()
        {
            if (!Images || Images.length === 0)
            {
                Images = [self.DefaultPicture];
            }
        },
        content: (function ()
        {
            var sliderContent = [];
            if (Images.length > 1)
            {
                sliderContent.push(
                {
                    tag: 'div',
                    className: 'slider-arrow slider-left',
                    content: {
                        tag: 'img',
                        attr: { src: '/Images/carousel_arrow_left.png' },
                        className: 'slider-arrow-left',
                    }
                });
                sliderContent.push(
                {
                    tag: 'div',
                    className: 'slider-arrow slider-right',
                    content: {
                        tag: 'img',
                        attr: { src: '/Images/carousel_arrow_right.png' },
                        className: 'slider-arrow-right'
                    }
                });
            }
            for (var i = 0; i < Images.length; i++)
            {
                sliderContent.push({
                    tag: 'div',
                    className: (i === 0 ? 'image active' : 'image'),
                    content: {
                        tag: 'img',
                        attr: { src: Images[i], height: 200, width: 300 }
                    }
                });
            }
            return sliderContent;
        })()
    }

    var rowDiv = function(data) {
        return {
            tag: 'div',
            className: 'row',
            content: {
                tag: 'div',
                className: 'col-lg-12 col-md-12 col-sm-12',
                content: {
                    tag: 'h2',
                    content: data
                }
            }
        }
    };
    var doubleRowDiv = function (data1, data2) {
        return [{
            tag: 'div',
            className: 'row',
            content: {
                tag: 'div',
                className: 'col-lg-3 col-md-3 col-sm-3 lightbackground',
                content: {
                    tag: 'p',
                    content: data
                }
            }
        },
        {
            tag: 'div',
            className: 'row',
            content: {
                tag: 'div',
                className: 'col-lg-3 col-md-3 col-sm-3 lightbackground',
                content: {
                    tag: 'p',
                    content: data2
                }
            }
        }]
    };
    var firstDoubleRow = new doubleRowDiv("Bedrooms: " + Bedrooms, "Lease Type: " + LeaseType);
    firstDoubleRow[0].content.style = { 'border-top-left-radius': '10px' };
    firstDoubleRow[1].content.style = { 'border-top-left-radius': '10px' };
    var lastDoubleRow = new doubleRowDiv("Parking: " + Parking, "In-Unit Laundry: " + Laundry);
    lastDoubleRow[0].content.style = { 'border-bottom-left-radius': '10px' };
    lastDoubleRow[1].content.style = { 'border-bottom-left-radius': '10px' };
    var notes = Notes.replace("#39", "'").replace("#34", "\"");
    var detailsSource = {
        tag: 'div',
        className: 'container-fluid',
        style: { 'padding-left': '40px' },
        content: [
            new rowDiv(Address + (Unit ? Unit : "")),
            new rowDiv("$" + Price + "/Month"),
            new rowDiv("Available " + Start),
            new rowDiv("Listed By: " + (Landlord != 'undefined' ? Landlord : (Username != 'undefined' ? Username : ""))),
            firstDoubleRow,
            new doubleRowDiv("Bathrooms: " + Bathrooms, "Building Type: " + BuildingType),
            new doubleRowDiv("Animals " + Animals, "Air Conditioning: " + HasAirConditioning),
            lastDoubleRow,
            {
                tag: 'row',
                style: { 'margin-top': '50px' },
                content: {
                    tag: 'div',
                    className: 'col-lg-8 col-md-8 col-sm-8 darkbackground',
                    content: {
                        tag: 'p',
                        content: (notes != "undefined" ? notes : "")
                    }
                }
            }
        ]
    };

    var actionsSource = {
        tag: 'div',
        className: 'col-lg-12 col-md-12 col-sm-12',
        content: {
            tag: 'div',
            className: 'row',
            content: {
                tag: 'input',
                attr: { type: 'button', value: 'Contact' },
                className: 'btn btn-outline-inverse btn-sm details-listing-action-btn',
                events: {
                    click: CreateEmailMessage
                }
            }
        }
    };

    var slideShow = jCreate(slideShowSource);
    var details = jCreate(detailsSource);
    var actions = jCreate(actionsSource);

    $("#details-view-slideshow-section").html(slideShow);
    $("#details-view-listing-details").html(details);
    $("#details-view-actions").html(actions);
    
    var width = $("#details-view").width();
    $("#details-items").width(width);
    var height = $("#details-view-slideshow-section .slideshow").height();
    $("#details-view-slideshow-section .slider-arrow").css("top", (height / 2) - 22);
}

function CloseDetailsView()
{
    $("#details-view").html(
        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true' onclick='CloseDetailsView();'>×</button>" +
        "<div id='details-view-slideshow-section' class='row'></div>" +
        "<div id='details-items' class='row'>" +
            "<div id='details-view-listing-details' class='col-lg-8 col-md-8 col-sm-8'></div>" +
            "<div id='details-view-actions' class='col-lg-4 col-md-4 col-sm-4'></div>" +
        "</div>");

    $("#details-view").fadeOut();
}

function CloseLeafletPopup()
{
    ko.dataFor(document.body).Map.closePopup();
}



