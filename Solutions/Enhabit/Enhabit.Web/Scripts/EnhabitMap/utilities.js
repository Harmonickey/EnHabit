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

