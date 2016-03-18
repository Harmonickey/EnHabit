using System;
using System.Threading.Tasks;

using Enhabit.Models;
using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System.Collections.Generic;

namespace Enhabit.Presenter
{
    public sealed class PortalPresenter
    {
        private readonly IUserRepository _userRepo;
        private readonly IUniversityRepository _universityRepo;
        private readonly IListingRepository _listingRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IRenterRepository _renterRepo;
        private readonly IApplicantRepository _applicantRepo;

        private IEnumerable<ListingViewModel> _listings;
        private IEnumerable<UserViewModel> _landlords;
        private IEnumerable<UniversityViewModel> _universities;
        private IEnumerable<PaymentViewModel> _payments;
        private IEnumerable<RenterViewModel> _renters;
        private IEnumerable<ApplicantViewModel> _applicants;
        private UserViewModel _user;
        private bool _hasRental;

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

            return new TenantViewModel(_user, _listings, _payments)
            {
                Universities = _universities,
                Landlords = _landlords,
                HasRental = _hasRental
            };
        }

        public LandlordViewModel GetLandlordPortal(Guid userGuid)
        {
            Parallel.Invoke(() => _user = Users.Get(_userRepo, userGuid),
                            () => _listings = Listings.GetUserListings(_listingRepo, userGuid),
                            () => _payments = Payments.GetUserPayments(_paymentRepo, userGuid),
                            () => _landlords = Users.GetLandlords(_userRepo),
                            () => _universities = Universities.GetAll(_universityRepo),
                            () => _applicants = Applicants.GetUserApplicants(_applicantRepo, userGuid),
                            () => _renters = Renters.GetUserRenters(_renterRepo, userGuid));

            return new LandlordViewModel(_user, _listings, _applicants, _renters)
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
