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

    if (which == "modal-content-payment") {
        $(".Address").geocomplete();

        var today = new Date();
        var nextMonth = "Ex: " + GetNextMonth(today) + "'s Rent";

        $(".Memo").attr("placeholder", nextMonth);
    }

}

function SetDatePickerTextBox(rowId)
{
    $($("#" + rowId + " input[type='text']")[3]).pikaday(
    {
        minDate: new Date(),  //today
        setDefaultDate: new Date($($("#heading" + rowId + " input[type='text']")[2]).val()) //current
    });
}



