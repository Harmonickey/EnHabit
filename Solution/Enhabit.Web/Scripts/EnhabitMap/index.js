var ListingViewModel = function (listing) {
    var self = this;

    self.Price = listing.Price;
    self.Address = listing.Address;
};

var EnhabitMapViewModel = function (enhabitData) {

    var self = this;

    self.PriceRangeLow = ko.observable();
    self.PriceRangeHigh = ko.observable();
    self.StartDate = ko.observable();

    self.Listings = enhabitData.Listings;

    self.SearchForListings = function () {

        var inputModel = {
            PriceRangeLow: self.PriceRangeLow(),
            PriceRangeHigh: self.PriceRangeHigh(),
            StartDate: self.StartDate()
        };

        var jsonData = ko.toJSON(inputModel);

        $.ajax({
            url: "/EnhabitMap/SearchForListings",
            dataType: "json",
            contentType: "application/json charset=utf-8",
            type: "POST",
            data: jsonData,
            success: function (data) {
                // init the map again and do interesting things...
            }
        });
    };
};