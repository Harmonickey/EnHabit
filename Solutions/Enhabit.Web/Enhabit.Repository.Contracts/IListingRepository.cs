using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IListingRepository
    {
        IEnumerable<Listing> GetListings();

        IEnumerable<Listing> SearchForListings(SearchQuery query);
    }
}
