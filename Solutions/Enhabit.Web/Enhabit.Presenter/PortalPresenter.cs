using System;
using System.Threading.Tasks;
using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System.Collections.Generic;

namespace Enhabit.Presenter
{
    public sealed class PortalPresenter
    {
        readonly IUserRepository _userRepo;
        readonly IUniversityRepository _universityRepo;
        readonly IListingRepository _listingRepo;
        readonly IPaymentRepository _paymentRepo;
        readonly IRenterRepository _renterRepo;
        readonly IApplicantRepository _applicantRepo;

        IEnumerable<ListingViewModel> _listings;
        IEnumerable<UserViewModel> _landlords;
        IEnumerable<UniversityViewModel> _universities;
        IEnumerable<PaymentViewModel> _payments;
        IEnumerable<RenterViewModel> _renters;
        IEnumerable<ApplicantViewModel> _applicants;
        UserViewModel _user;
        IEnumerable<NavLinkViewModel> _navLinks;
        bool _hasRental;

        public PortalPresenter(IUniversityRepository universityRepo, IUserRepository userRepo, IListingRepository listingRepo, IPaymentRepository paymentRepo, IRenterRepository renterRepo, IApplicantRepository applicantRepo)
        {
            _universityRepo = universityRepo;
            _userRepo = userRepo;
            _listingRepo = listingRepo;
            _paymentRepo = paymentRepo;
            _renterRepo = renterRepo;
            _applicantRepo = applicantRepo;
        }


        public TenantViewModel GetTenantPortal(Guid userGuid)
        {
            Parallel.Invoke(() => _user = Users.Get(_userRepo, userGuid),
                            () => _listings = Listings.GetUserListings(_listingRepo, userGuid),
                            () => _payments = Payments.GetUserPayments(_paymentRepo, userGuid),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo),
                            () => _hasRental = Renters.UserHasRental(_renterRepo, userGuid));

            return new TenantViewModel(_user, _listings, NavLinks.Tenant(_hasRental), _payments, _hasRental)
            {
                Universities = _universities,
                Landlords = _landlords
            };
        }

        public LandlordViewModel GetLandlordPortal(Guid userGuid)
        {
            Parallel.Invoke(() => _user = Users.Get(_userRepo, userGuid),
                            () => _listings = Listings.GetUserListings(_listingRepo, userGuid),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo),
                            () => _applicants = Applicants.GetUserApplicants(_applicantRepo, userGuid),
                            () => _renters = Renters.GetUserRenters(_renterRepo, userGuid),
                            () => _navLinks = NavLinks.Landlord());

            return new LandlordViewModel(_user, _listings, _navLinks, _applicants, _renters)
            {
                Universities = _universities,
                Landlords = _landlords
            };
        }

        public UserViewModel GetUser(Guid userGuid)
        {
            return _user = Users.Get(_userRepo, userGuid);
        }
    }
}
