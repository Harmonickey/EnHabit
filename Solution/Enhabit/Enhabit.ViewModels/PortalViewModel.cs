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
        public PortalViewModel(AccountViewModel avm, ListingsViewModel lvm, PaymentsViewModel pvm)
        {
            Account = avm;
            Listings = lvm;
            Payments = pvm;
        }

        // Landlord Portal View Model
        public PortalViewModel(AccountViewModel avm, ListingsViewModel lvm, ApplicantsViewModel apvm, RentersViewModel rvm)
        {
            Account = avm;
            Listings = lvm;
            Applicants = apvm;
            Renters = rvm;
        }

        public AccountViewModel Account { get; set; }

        public ListingsViewModel Listings { get; set; }

        public PaymentsViewModel Payments { get; set; }

        public ApplicantsViewModel Applicants {get; set; }

        public RentersViewModel Renters {get ;set; }
    }
}
