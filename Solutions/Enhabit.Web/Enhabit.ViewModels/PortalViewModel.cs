using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class PortalViewModel
    {
        public PortalViewModel(UserViewModel uvm, IEnumerable<ListingViewModel> lvm)
        {
            Account = uvm;
            Listings = lvm;
        }
        
        public UserViewModel Account { get; set; }

        public IEnumerable<ListingViewModel> Listings { get; set; }
        
        public IEnumerable<UniversityViewModel> Universities { get; set; }

        public IEnumerable<UserViewModel> Landlords { get; set; }
    }
}
