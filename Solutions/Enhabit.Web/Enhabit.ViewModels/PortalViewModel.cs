using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Enhabit.ViewModels
{
    public class PortalViewModel
    {
        // Tenant Portal View Model
        public PortalViewModel(AccountViewModel avm, ListingViewModel lvm, PaymentViewModel pvm)
        {
            Account = avm;
            Listings = lvm;
            Payments = pvm;
        }

        // Landlord Portal View Model
        public PortalViewModel(AccountViewModel avm, ListingViewModel lvm, ApplicantViewModel apvm, RenterViewModel rvm)
        {
            Account = avm;
            Listings = lvm;
            Applicants = apvm;
            Renters = rvm;
        }

        public AccountViewModel Account { get; set; }

        public ListingViewModel Listings { get; set; }

        public PaymentViewModel Payments { get; set; }

        public ApplicantViewModel Applicants {get; set; }

        public RenterViewModel Renters {get ;set; }
    }
}
