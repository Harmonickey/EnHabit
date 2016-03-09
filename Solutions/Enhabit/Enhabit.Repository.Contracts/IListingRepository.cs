using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IListingRepository
    {
        IEnumerable<Listing> GetListings();

        IEnumerable<Listing> SearchForListings(SearchQuery query);
    }
}
