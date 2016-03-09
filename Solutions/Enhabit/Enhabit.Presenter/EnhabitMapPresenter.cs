using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;

using Enhabit.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Enhabit.Presenter
{
    public sealed class EnhabitMapPresenter
    {
        private readonly IListingRepository _enhabitMapRepo;
        private readonly IPricingRepository _pricingRepo;
        private readonly IUniversityRepository _universityRepo;
        private readonly IConfigAdaptor _configAdaptor;

        private IEnumerable<ListingViewModel> _listings;
        private PriceRangeViewModel _priceRange;
        private IEnumerable<UniversityViewModel> _universities;


        public EnhabitMapPresenter(IConfigAdaptor configAdaptor, 
            IListingRepository enhabitMapRepo,
            IPricingRepository pricingRepo,
            IUniversityRepository universityRepo)
        {
            _enhabitMapRepo = enhabitMapRepo;
            _pricingRepo = pricingRepo;
            _universityRepo = universityRepo;
            _configAdaptor = configAdaptor;
        }

        public EnhabitMapViewModel GetEnhabitMap()
        {
            Parallel.Invoke(() => _listings = Listings.GetAll(_enhabitMapRepo),
                            () => _priceRange = Prices.GetRange(_pricingRepo),
                            () => _universities = Universities.GetAll(_universityRepo));

            var defaultListingPicture = _configAdaptor.DefaultListingImage;

            return new EnhabitMapViewModel
            {
                Listings = _listings,
                PriceRange = _priceRange,
                Universities = _universities,
                DefaultListingPicture = defaultListingPicture
            };
        }

        public SearchResultViewModel SearchForListings(SearchQuery query)
        {
            var listings = Listings.Search(_enhabitMapRepo, query);
            
            return new SearchResultViewModel();
        }
    }
}
