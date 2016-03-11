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
        private readonly IListingRepository _listingRepo;
        private readonly IPricingRepository _pricingRepo;
        private readonly IUniversityRepository _universityRepo;
        private readonly IUserRepository _userRepo;
        private readonly IConfigAdaptor _configAdaptor;

        private IEnumerable<ListingViewModel> _listings;
        private PriceRangeViewModel _priceRange;
        private IEnumerable<UniversityViewModel> _universities;
        private IEnumerable<UserViewModel> _landlords;

        public EnhabitMapPresenter(IConfigAdaptor configAdaptor, 
            IListingRepository listingRepo,
            IPricingRepository pricingRepo,
            IUserRepository userRepo,
            IUniversityRepository universityRepo)
        {
            _listingRepo = listingRepo;
            _pricingRepo = pricingRepo;
            _userRepo = userRepo;
            _universityRepo = universityRepo;
            _configAdaptor = configAdaptor;
        }

        public EnhabitMapViewModel GetEnhabitMap()
        {
            Parallel.Invoke(() => _listings = Listings.GetAll(_listingRepo),
                            () => _priceRange = Prices.GetRange(_pricingRepo),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo));

            var defaultListingPicture = _configAdaptor.DefaultListingImage;

            return new EnhabitMapViewModel
            {
                Listings = _listings,
                PriceRange = _priceRange,
                Universities = _universities,
                Landlords = _landlords,
                DefaultListingPicture = defaultListingPicture
            };
        }

        public SearchResultViewModel SearchForListings(SearchQuery query)
        {
            var listings = Listings.Search(_listingRepo, query);
            
            return new SearchResultViewModel();
        }
    }
}
