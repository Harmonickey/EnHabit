using Enhabit.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;

using Enhabit.Models;

namespace Enhabit.Presenter
{
    public sealed class EnhabitMapPresenter
    {
        private readonly IEnhabitMapRepository _enhabitMapRepo;
        
        public EnhabitMapPresenter(IEnhabitMapRepository enhabitMapRepo)
        {
            _enhabitMapRepo = enhabitMapRepo;
        }

        public EnhabitMapViewModel GetEnhabitMap()
        {
            var listings = GetAllListings.GetAll(_enhabitMapRepo);

            return new EnhabitMapViewModel();
        }

        public SearchResultViewModel SearchForListings(SearchQuery query)
        {
            var listings = GetAllListings.Search(_enhabitMapRepo, query);
            
            return new SearchResultViewModel();
        }
    }
}
