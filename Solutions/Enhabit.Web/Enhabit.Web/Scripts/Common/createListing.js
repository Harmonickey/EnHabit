var CreateListingViewModel = function (landlords, universities, enhabitMapViewModel)
{
    var self = this;

    self.errors = ko.validation.group(self, { deep: true, live: true });

    self.Address = ko.observable().extend({
        required: true
    });
    self.Unit = ko.observable();
    self.Rent = ko.observable().extend({
        required: true
    });
    self.StartDate = ko.observable().extend({
        required: true
    });
    self.Bedrooms = ko.observable();
    self.Bathrooms = ko.observable();
    self.Parking = ko.observable();
    self.Animals = ko.observable();
    self.Laundry = ko.observable();
    self.AirConditioning = ko.observable();
    self.LeaseTypes = ko.observable();
    self.BuildingTypes = ko.observable();
    self.Landlords = landlords;
    self.Universities = universities;

    self.Landlord = ko.observable();
    self.University = ko.observable();
    self.LeaseType = ko.computed(function () {
        return self.LeaseTypes() == true ? "rental" : "sublet";
    });
    self.BuildingType = ko.computed(function () {
        return self.BuildingTypes() == true ? "apartment" : "house";
    });
    self.FormattedAddress = ko.computed(function () {
        return (self.Address() ? self.Address().split(",")[0] : "");
    });
    self.FormattedStartDate = ko.computed(function () {
        return (self.StartDate() ? $.datepicker.formatDate('mm/dd/yy', new Date(self.StartDate())) : "");
    });
    self.Pictures = ko.observable();

    self.Notes = ko.observable();

    self.PendingListingCreation = function () {
        self.errors.showAllMessages();

        if (self.errors().length == 0) {
            var data = {
                Address: self.FormattedAddress(),
                Unit: self.Unit(),
                Rent: self.Rent(),
                StartDate: self.FormattedStartDate(),
                Bedrooms: self.Bedrooms(),
                Bathrooms: self.Bathrooms(),
                Parking: self.Parking(),
                Animals: self.Animals(),
                Laundry: self.Laundry(),
                AirConditioning: self.AirConditioning(),
                LeaseType: self.LeaseType(),
                BuildingType: self.BuildingType(),
                Landlord: self.Landlord(),
                University: self.University(),
                Pictures: self.Pictures(),
                Note: self.Notes()
            };

            // setup the listing data for pending 
            enhabitMapViewModel.PendingListingData(data);

            CleanModalViewModel();
            enhabitMapViewModel.OpenRegisterModal();
        }
    };
};
