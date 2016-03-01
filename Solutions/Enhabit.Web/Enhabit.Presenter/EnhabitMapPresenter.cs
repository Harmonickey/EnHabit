using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;
using System;
using Enhabit.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Enhabit.Models.Enums;
using System.Linq;

namespace Enhabit.Presenter
{
    public sealed class EnhabitMapPresenter
    {
        readonly IListingRepository _listingRepo;
        readonly IPricingRepository _pricingRepo;
        readonly IUniversityRepository _universityRepo;
        readonly IUserRepository _userRepo;
        readonly IConfigAdaptor _configAdaptor;
        readonly IRenterRepository _renterRepo;

        IEnumerable<ListingViewModel> _listings;
        PriceRangeViewModel _priceRange;
        IEnumerable<UniversityViewModel> _universities;
        IEnumerable<UserViewModel> _landlords;
        UserViewModel _user;
        bool _hasRental;

        public EnhabitMapPresenter(IConfigAdaptor configAdaptor, 
            IListingRepository listingRepo,
            IPricingRepository pricingRepo,
            IUserRepository userRepo,
            IUniversityRepository universityRepo,
            IRenterRepository renterRepo)
        {
            _listingRepo = listingRepo;
            _pricingRepo = pricingRepo;
            _userRepo = userRepo;
            _universityRepo = universityRepo;
            _renterRepo = renterRepo;
            _configAdaptor = configAdaptor;
        }

        public EnhabitMapViewModel GetEnhabitMap(object userGuid)
        {
            Parallel.Invoke(() => _listings = Listings.GetAll(_listingRepo),
                            () => _priceRange = Prices.GetRange(_pricingRepo),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo),
                            () => _user = (userGuid != null ? Users.Get(_userRepo, (Guid)userGuid) : null),
                            () => _hasRental = (userGuid != null ? Renters.UserHasRental(_renterRepo, (Guid)userGuid) : false));
            
            var vm = new EnhabitMapViewModel
            {
                Listings = _listings,
                PriceRange = _priceRange,
                Universities = _universities,
                Landlords = _landlords,
                DefaultListingPicture = _configAdaptor.DefaultListingImage,
                CreateListingPictureGuid = Guid.NewGuid(),
                User = _user
            };

            if (userGuid != null)
            {
                vm.NavLinks = GetNavLinks(_hasRental, (AccountType)vm.User.AccountTypeId);
            }

            return vm;
        }

        public SearchResultViewModel SearchForListings(SearchQuery query)
        {
            var listings = Listings.Search(_listingRepo, query);
            
            return new SearchResultViewModel();
        }

        public IEnumerable<NavLinkViewModel> GetNavLinks(bool hasRental, AccountType accountType)
        {
            if (accountType == AccountType.Tenant)
            {
                return NavLinks.Tenant(hasRental);
            }

            return NavLinks.Landlord();
        }
    }
}
