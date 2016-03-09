using Enhabit.Models;
using Enhabit.ViewModels;

namespace Enhabit.Presenter.Extensions
{
    public static class ListingsExtensions
    {
        public static ListingViewModel ToListingViewModel(this Listing listing)
        {
            return new ListingViewModel
            {
                ListingId = listing.ListingId,
                Address = listing.Address,
                Unit = listing.Unit,
                Animals = listing.Animals,
                AvailableStartDate = listing.AvailableStartDate,
                LeaseType = listing.LeaseType,
                BuildingType = listing.BuildingType,
                HasAirConditioning = listing.HasAirConditioning,
                Images = listing.Images,
                Thumbnails = listing.Thumbnails,
                IsActive = listing.IsActive,
                IsFeatured = listing.IsFeatured,
                IsTesting = listing.IsTesting,
                LandlordName = listing.LandlordName,
                Laundry = listing.Laundry,
                Notes = listing.Notes,
                TenantName = listing.TenantName,
                Parking = listing.Parking,
                Price = listing.Price,
                XCoordinates = listing.XCoordinates,
                YCoordinates = listing.YCoordinates
            };
        }


    }
}
