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
        public static IEnumerable<ListingViewModel> GetAll(IListingRepository repo)
        {
            var listings = repo.GetListings();
            
            return listings.Select(l => l.ToListingViewModel());
        }

        public static IEnumerable<ListingViewModel> Search(IListingRepository repo, SearchQuery query)
        {
            var listings = repo.SearchForListings(query);

            return listings.Select(l => l.ToListingViewModel());
        }

        public static bool Create(IListingRepository repo, Listing listing)
        {
            listing.ListingId = Guid.NewGuid();
            listing.IsFeatured = false;
            listing.IsRented = false;

            return repo.CreateListing(listing);
        }
    }
}
