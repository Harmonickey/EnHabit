using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;
using System;
using Enhabit.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Enhabit.Models.Enums;

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
        private UserViewModel _user;

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

        public EnhabitMapViewModel GetEnhabitMap(object userGuid)
        {
            Parallel.Invoke(() => _listings = Listings.GetAll(_listingRepo),
                            () => _priceRange = Prices.GetRange(_pricingRepo),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo),
                            () => _user = (userGuid != null ? Users.Get(_userRepo, new Guid((string)userGuid)) : null));

            var defaultListingPicture = _configAdaptor.DefaultListingImage;

            return new EnhabitMapViewModel
            {
                Listings = _listings,
                PriceRange = _priceRange,
                Universities = _universities,
                Landlords = _landlords,
                DefaultListingPicture = defaultListingPicture,
                CreateListingPictureGuid = Guid.NewGuid(),
                User = _user
            };
        }

        public SearchResultViewModel SearchForListings(SearchQuery query)
        {
            var listings = Listings.Search(_listingRepo, query);
            
            return new SearchResultViewModel();
        }

        public IEnumerable<NavLinkViewModel> GetNavLinks(AccountType accountType)
        {
            if (accountType == AccountType.Admin)
            {
                return NavLinks.Admin();
            }
            else if (accountType == AccountType.Landlord)
            {
                return NavLinks.Landlord();
            }

            return NavLinks.Tenant();
        }
    }
}
