using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;

using Enhabit.Models;

namespace Enhabit.Presenter
{
    public sealed class EnhabitMapPresenter
    {
        private readonly IListingRepository _enhabitMapRepo;
        private readonly IPricingRepository _pricingRepo;
        private readonly IUniversityRepository _universityRepo;
        private readonly IConfigAdaptor _configAdaptor;
        
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
            var listings = Listings.GetAll(_enhabitMapRepo);
            var priceRange = Prices.GetRange(_pricingRepo);
            var universities = Universities.GetAll(_universityRepo);
            var defaultListingPicture = _configAdaptor.DefaultListingImage;

            return new EnhabitMapViewModel
            {
                Listings = listings,
                PriceRange = priceRange,
                Universities = universities,
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
