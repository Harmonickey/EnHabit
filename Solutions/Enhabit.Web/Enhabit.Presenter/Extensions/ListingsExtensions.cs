using Enhabit.Models;
using Enhabit.ViewModels;
using System.Linq;

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
                ImageUrls = listing.ImageUrls,
                ThumbnailUrls = listing.ImageUrls.Select(u => u.ToThumbnail()),
                IsFeatured = listing.IsFeatured,
                IsTesting = listing.IsTesting,
                LandlordName = listing.LandlordName,
                Laundry = listing.Laundry,
                Notes = listing.Notes,
                TenantName = listing.TenantName,
                Parking = listing.Parking,
                Price = listing.Price,
                XCoordinate = listing.XCoordinate,
                YCoordinate = listing.YCoordinate
            };
        }


    }
}
