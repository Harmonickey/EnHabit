using System.Collections.Generic;
using System.Linq;
using Enhabit.Presenter.Extensions;
using Enhabit.ViewModels;
using Enhabit.Models;
using Enhabit.Repository.Contracts;
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

            listing.ImageUrls = imageRepo.GetAll(listing.PicturesId);

            return listing.ToListingViewModel();
        }
    }
}