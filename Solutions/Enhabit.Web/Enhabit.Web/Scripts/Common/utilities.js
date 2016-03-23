function InitSpecialFields(selector) {
    var listingModal = $(selector + " input");

    $(listingModal[0]).geocomplete()
        .bind("geocode:result", function (event, result) {
            var hiddenFields = $(selector + " input[type='hidden']");
            var keys = Object.keys(result.geometry.location);
            $(hiddenFields[0]).val(result.geometry.location[keys[0]]);
            $(hiddenFields[1]).val(result.geometry.location[keys[1]]);
            $(hiddenFields[2]).val($(listingModal[0]).val());
        });

    $(selector + " input[type='checkbox']").not(".type-content input").bootstrapSwitch({ onText: "Yes", offText: "No" });
    $($(selector + " .type-content input")[0]).bootstrapSwitch({ onText: "Rental", offText: "Sublet", 'state': true, 'setState': true });
    $($(selector + " .type-content input")[0]).prop("checked", true);
    $($(selector + " .type-content input")[1]).bootstrapSwitch({ onText: "Apartment", offText: "House", 'state': true, 'setState': true });
    $($(selector + " .type-content input")[1]).prop("checked", true);

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

    if (which == "modal-content-payment") {
        $(".Address").geocomplete();

        var today = new Date();
        var nextMonth = "Ex: " + GetNextMonth(today) + "'s Rent";

        $(".Memo").attr("placeholder", nextMonth);
    }

}



