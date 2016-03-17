using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IListingRepository
    {
        bool CreateListing(Listing listing);

        IEnumerable<Listing> GetUserListings(Guid userGuid);

        IEnumerable<Listing> GetAllListings();

        IEnumerable<Listing> SearchForListings(SearchQuery query);
    }
}
