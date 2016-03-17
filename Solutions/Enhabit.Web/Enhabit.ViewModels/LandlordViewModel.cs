using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class LandlordViewModel : PortalViewModel
    {
        public LandlordViewModel(UserViewModel uvm, IEnumerable<ListingViewModel> lvm, IEnumerable<ApplicantViewModel> apvm, IEnumerable<RenterViewModel> rvm)
            :base(uvm, lvm)
        {
            Applicants = apvm;
            Renters = rvm;
        }

        public IEnumerable<ApplicantViewModel> Applicants { get; set; }

        public IEnumerable<RenterViewModel> Renters { get; set; }
    }
}
