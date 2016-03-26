using System.Collections.Generic;
using System.Linq;
using Enhabit.Presenter.Extensions;
using Enhabit.ViewModels;
using Enhabit.Models;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.DataAdaptors;
using System;

namespace Enhabit.Presenter.Commands
{
    public static class Listings
    {
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

        public static ListingViewModel Create(IListingRepository repo, IImageRepository imageRepo, Listing listing)
        {
            listing.ListingId = Guid.NewGuid();
            listing.IsFeatured = false;
            listing.IsRented = false;

            if (!repo.CreateListing(listing))
            {
                return null;
            }

            var pictures = imageRepo.GetListingsPictures(new List<Guid> { listing.PicturesId });

            if (pictures.Any())
            {
                listing.ImageUrls = pictures.Select(p => p.CloudinaryUrl);
            }

            return listing.ToListingViewModel();
        }

        public static ListingViewModel Update(IListingRepository repo, IImageRepository imageRepo, ICloudinaryAdaptor cloudinaryAdaptor, Listing listing)
        {
            // need to get the old PicturesId before the listing is updated in the db
            var oldListing = repo.GetListing(listing.ListingId);
            var oldPictures = imageRepo.GetListingsPictures(new List<Guid> { oldListing.PicturesId });

            if (!repo.UpdateListing(listing))
            {
                return null;
            }
            
            // now that update has succeeded, we can delete the old pictures from the cloud
            cloudinaryAdaptor.Delete(oldPictures.Select(p => p.CloudinaryPublicId));

            var pictures = imageRepo.GetListingsPictures(new List<Guid> { listing.PicturesId });

            if (pictures.Any())
            {
                listing.ImageUrls = pictures.Select(p => p.CloudinaryUrl);
            }

            return listing.ToListingViewModel();
        }
    }
}