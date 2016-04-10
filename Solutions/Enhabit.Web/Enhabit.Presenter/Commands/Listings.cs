using System.Collections.Generic;
using System.Linq;
using Enhabit.Presenter.Extensions;
using Enhabit.ViewModels;
using Enhabit.Models;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.DataAdaptors;
using System;
using System.Device.Location;
using System.IO;

namespace Enhabit.Presenter.Commands
{
    public static class Listings
    {
        const double METERS_IN_MILES = 1609.34;

        public static IEnumerable<ListingViewModel> GetUserListings(IListingRepository repo, Guid userGuid)
        {
            return repo.GetUserListings(userGuid).Select(l => l.ToListingViewModel());
        }

        public static IEnumerable<ListingViewModel> GetAll(IListingRepository repo)
        {
            var listings = repo.GetAllListings();
            
            return listings.Select(l => l.ToListingViewModel());
        }

        public static IEnumerable<ListingViewModel> Search(IListingRepository repo, SearchQuery query)
        {
            var listings = repo.SearchForListings(query);

            return listings.Select(l => l.ToListingViewModel());
        }

        public static ListingViewModel Create(IListingRepository repo, IImageRepository imageRepo, IUniversityRepository universityRepo, Listing listing)
        {
            listing.ListingId = Guid.NewGuid();
            listing.IsFeatured = false;
            listing.IsRented = false;
            listing.IsPastThreshold = CheckIsListingPastThreshold(universityRepo, listing);

            var pictures = imageRepo.GetListingsPictures(new List<Guid> { listing.PicturesId });

            // to be active you need to be within the threshold and have pictures
            listing.IsActive = !listing.IsPastThreshold && pictures.Any();

            if (pictures.Any())
            {
                listing.ImageUrls = pictures.Select(p => p.CloudinaryUrl);
            }

            if (!repo.CreateListing(listing))
            {
                return null;
            }
            
            return listing.ToListingViewModel();
        }

        public static ListingViewModel Update(IListingRepository repo, IImageRepository imageRepo, IUniversityRepository universityRepo, ICloudinaryAdaptor cloudinaryAdaptor, Listing listing)
        {
            var viewPictures = listing.DropzoneImages.Select(i => Path.GetFileName(i));
            var repoPictures = imageRepo.GetListingsPictures(new List<Guid> { listing.PicturesId });

            var picsToDelete = repoPictures.Select(p => p.CloudinaryPublicId).Except(viewPictures);

            listing.IsPastThreshold = CheckIsListingPastThreshold(universityRepo, listing);
            listing.IsActive = !listing.IsPastThreshold && repoPictures.Any();

            if (!repo.UpdateListing(listing) || //update the values
                !imageRepo.DeleteByUrls(picsToDelete)) //delete pics if needbe
            {
                return null;
            }

            var publicIds = picsToDelete.Select(p => Path.GetFileName(p));
            cloudinaryAdaptor.Delete(publicIds); //delete cloud pics if needbe
            
            if (repoPictures.Any())
            {
                listing.ImageUrls = repoPictures.Select(p => p.CloudinaryUrl);
            }

            return listing.ToListingViewModel();
        }

        private static bool CheckIsListingPastThreshold(IUniversityRepository universityRepo, Listing listing)
        {
            var university = universityRepo.GetUniversity(listing.UniversityId);

            var distanceThreshold = (double)university.MaxListingDistance * METERS_IN_MILES;
            var universityGeoLocation = new GeoCoordinate(double.Parse(university.XCoordinate), double.Parse(university.YCoordinate));
            var listingGeoLocation = new GeoCoordinate((double)listing.XCoordinate, (double)listing.YCoordinate);

            // returns in meters
            var distanceBetweenListingAndUniversity = universityGeoLocation.GetDistanceTo(listingGeoLocation);

            return distanceThreshold < distanceBetweenListingAndUniversity;
        }
    }
}