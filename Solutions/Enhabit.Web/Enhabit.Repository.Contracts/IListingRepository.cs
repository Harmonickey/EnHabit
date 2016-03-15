using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IListingRepository
    {
        bool CreateListing(Listing listing);

        IEnumerable<Listing> GetListings();

        IEnumerable<Listing> SearchForListings(SearchQuery query);
    }
}
