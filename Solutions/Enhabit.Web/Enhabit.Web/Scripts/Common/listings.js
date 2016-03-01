var ListingViewModel = function (listing)
{
    var self = this;

    self.Id = listing.ListingId;
    self.XCoordinate = listing.XCoordinate;
    self.YCoordinate = listing.YCoordinate;
    self.IsFeatured = listing.IsFeatured;
    self.Testing = listing.Testing;
    self.Address = listing.Address;
    self.Unit = listing.Unit;
    self.Price = listing.Price;
    self.Images = listing.ImageUrls;
    self.Thumbnails = listing.ThumbnailUrls;
};