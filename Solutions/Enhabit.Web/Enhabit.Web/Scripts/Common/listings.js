var ListingViewModel = function (listing)
{
    var self = this;

    self.XCoordinate = listing.XCoordinate;
    self.YCoordinate = listing.YCoordinate;
    self.IsFeatured = listing.IsFeatured;
    self.Testing = listing.Testing;
    self.Address = listing.Address;
    self.Unit = listing.Unit;
    self.Price = listing.Price;
    self.Images = listing.Images;
    self.Thumbnails = listing.Thumbnails;
};