var ListingViewModel = function (listing, parentViewModel)
{
    var self = this;

    self.Id = listing.ListingId;
    self.PicturesId = listing.PicturesId;
    self.XCoordinate = ko.observable(listing.XCoordinate);
    self.YCoordinate = ko.observable(listing.YCoordinate);
    self.IsFeatured = ko.observable(listing.IsFeatured);
    self.IsRented = ko.observable(Boolean(listing.IsRented));
    self.Testing = ko.observable(listing.Testing);
    self.Address = ko.observable(listing.Address);
    self.Unit = ko.observable(listing.Unit);
    self.Price = ko.observable(listing.Price);
    self.Bedrooms = ko.observable(listing.Bedrooms);
    self.Bathrooms = ko.observable(listing.Bathrooms);
    self.Animals = ko.observable(listing.Animals);
    self.Laundry = ko.observable(listing.Laundry);
    self.Parking = ko.observable(listing.Parking);
    self.AirConditioning = ko.observable(listing.HasAirConditioning);
    self.Images = ko.observable(listing.ImageUrls);
    self.Notes = ko.observable(listing.Notes);
    self.Thumbnails = ko.observable(listing.ThumbnailUrls);
    self.Start = ko.observable(listing.AvailableStartDate);
    self.LeaseTypes = ko.observable(listing.LeaseType);
    self.BuildingTypes = ko.observable(listing.BuildingType);

    self.IsActive = ko.observable(listing.IsActive);
    self.IsPastThreshold = ko.observable(listing.IsPastThreshold);

    self.LeaseType = ko.computed(function () {
        return self.LeaseTypes() == true || self.LeaseTypes() == 1 ? "rental" : "sublet";
    });
    self.LeaseTypeValue = ko.computed(function () {
        return self.LeaseType() == "rental" ? 1 : 0;
    });
    self.BuildingType = ko.computed(function () {
        return self.BuildingTypes() == true || self.BuildingTypes() == 1 ? "apartment" : "house";
    });
    self.BuildingTypeValue = ko.computed(function () {
        return self.BuildingType() == "apartment" ? 0 : 1;
    });

    self.Universities = parentViewModel.Universities;
    self.Landlords = parentViewModel.Landlords;

    self.University = ko.observable(listing.University);
    self.Landlord = ko.observable(listing.Landlord);

    self.FormattedPrice = ko.pureComputed(function ()
    {
        return accounting.formatMoney(self.Price());
    });

    self.FormattedAddress = ko.computed(function ()
    {
        return (self.Address() ? self.Address().split(",")[0] : "");
    });

    self.FormattedStart = ko.pureComputed(function ()
    {
        var parts = self.Start().split("T")[0].split("-");
        
        if (parts[1] == undefined)
        {
            if (self.Start().indexOf("/") != -1)
            {
                self.Start(getDateFromUnix(self.Start()));
                parts = self.Start().split("T")[0].split("-");
            }
            else
            {
                var start = new Date(self.Start());
                var month = start.getMonth() + 1;
                if (month < 10)
                    month = "0" + month;
                var date = start.getDate();
                if (date < 10)
                    date = "0" + date;
                var year = start.getFullYear();
                return date + "/" + month + "/" + year;
            }
        }

        return parts[1] + "/" + parts[2] + "/" + parts[0];
    });

    self.StartValue = ko.computed(function () {
        return $.datepicker.formatDate('mm/dd/yy', new Date(self.Start()));
    });

    self.UpdateListingButtonEnabled = ko.observable(true);
    self.UpdateListingButtonText = ko.observable("Update");

    self.DeleteListingButtonEnabled = ko.observable(true);
    self.DeleteListingButtonText = ko.observable("Delete");

    self.UpdateListing = function ()
    {
        self.SetPendingUpdateData();

        self.UpdateListingButtonEnabled(false);
        self.UpdateListingButtonText("Updating...");

        parentViewModel.Dropzones[self.Id].processQueue();

        if (parentViewModel.AddedFiles[self.Id] == false)
        {
            parentViewModel.ProcessListing();
        }
    };

    self.SetPendingUpdateData = function ()
    {
        var data = {
            ListingId: self.Id,
            Address: self.FormattedAddress(),
            XCoordinate: self.XCoordinate(),
            YCoordinate: self.YCoordinate(),
            Unit: self.Unit(),
            Price: self.Price(),
            AvailableStartDate: self.StartValue(),
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
            PicturesId: self.PicturesId,
            DropzoneImages: parentViewModel.Pictures[self.Id],
            Notes: self.Notes()
        };

        // setup the listing data for pending 
        parentViewModel.PendingUpdateListingData(data);
    };
    
    self.DeleteListing = function ()
    {

    };
};