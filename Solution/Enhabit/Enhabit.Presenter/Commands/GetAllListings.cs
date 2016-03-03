using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Presenter.Extensions;
using Enhabit.ViewModels;
using Enhabit.Models;
using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class GetAllListings
    {
        public static IEnumerable<ListingViewModel> GetAll(IEnhabitMapRepository repo)
        {
            var listings = repo.GetListings();
            
            return listings.Select(l => l.ToListingViewModel());
        }

        public static IEnumerable<ListingViewModel> Search(IEnhabitMapRepository repo, SearchQuery query)
        {
            var listings = repo.SearchForListings(query);

            return listings.Select(l => l.ToListingViewModel());
        }
    }
}
