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



