using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IListingRepository
    {
        bool CreateListing(Listing listing);

        bool UpdateListing(Listing listing);

        IEnumerable<Listing> GetUserListings(Guid userGuid);

        IEnumerable<Listing> GetAllListings();

        Listing GetListing(Guid listingId);

        IEnumerable<Listing> SearchForListings(SearchQuery query);
    }
}
