var CreateListingViewModel = function (landlords, universities, parentViewModel)
{
    var self = this;

    self.errors = ko.validation.group(self, { deep: true, live: true });

    self.Address = ko.observable().extend({
        required: true
    });
    self.SelectedAddress = ko.observable();
    self.Unit = ko.observable();
    self.Rent = ko.observable().extend({
        required: true
    });
    self.StartDate = ko.observable().extend({
        required: true
    });
    self.Bedrooms = ko.observable();
    self.Bathrooms = ko.observable();
    self.Parking = ko.observable(false);
    self.Animals = ko.observable(false);
    self.Laundry = ko.observable(false);
    self.AirConditioning = ko.observable(false);
    self.LeaseTypes = ko.observable(false);
    self.BuildingTypes = ko.observable(false);
    self.Landlords = landlords;
    self.Universities = universities;

    self.Landlord = ko.observable();
    self.University = ko.observable();
    self.LeaseType = ko.computed(function () {
        return self.LeaseTypes() == true ? "rental" : "sublet";
    });
    self.LeaseTypeValue = ko.computed(function () {
        return self.LeaseType() == "rental" ? 1 : 0;
    });
    self.BuildingType = ko.computed(function () {
        return self.BuildingTypes() == true ? "apartment" : "house";
    });
    self.BuildingTypeValue = ko.computed(function () {
        return self.BuildingType() == "apartment" ? 0 : 1;
    });
    self.FormattedAddress = ko.computed(function () {
        return (self.Address() ? self.Address().split(",")[0] : "");
    });
    self.FormattedStartDate = ko.computed(function () {
        return (self.StartDate() ? $.datepicker.formatDate('mm/dd/yy', new Date(self.StartDate())) : "");
    });
    self.XCoordinate = ko.observable();
    self.YCoordinate = ko.observable();
    self.Pictures = ko.observable();

    self.Notes = ko.observable();

    self.CreateListingButtonEnabled = ko.observable(true);
    self.CreateListingButtonText = ko.observable("Create Listing");

    self.PendingPortalListingCreation = function ()
    {
        self.SetPendingData();

        self.CreateListingButtonEnabled(false);
        self.CreateListingButtonText("Creating...");

        if (parentViewModel.NumAdded() == 0)
        {
            parentViewModel.ProcessListing();
        }
        else
        {
            // async call, caught in dropzone.success event handler in portal.js
            parentViewModel.Dropzones["create"].processQueue();
        }
    };

    self.PendingListingCreation = function ()
    {
        self.SetPendingData();

        parentViewModel.OpenRegisterModal();
    };

    self.SetPendingData = function ()
    {
        self.errors.showAllMessages();

        if (self.errors().length == 0)
        {
            var data = {
                Address: self.FormattedAddress(),
                XCoordinate: self.XCoordinate()(),
                YCoordinate: self.YCoordinate()(),
                Unit: self.Unit(),
                Price: self.Rent(),
                AvailableStartDate: self.FormattedStartDate(),
                Bedrooms: self.Bedrooms(),
                Bathrooms: self.Bathrooms(),
                Parking: self.Parking(),
                Animals: self.Animals(),
                Laundry: self.Laundry(),
                AirConditioning: self.AirConditioning(),
                LeaseType: self.LeaseTypeValue(),
                BuildingType: self.BuildingTypeValue(),
                LandlordId: self.Landlord(),
                UniversityId: self.University(),
                PicturesId: parentViewModel.CreateListingPictureGuid,
                Notes: self.Notes()
            };

            // setup the listing data for pending 
            parentViewModel.PendingListingData(data);
        }
    };
};
