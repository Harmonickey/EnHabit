using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class PortalViewModel
    {
        public PortalViewModel(UserViewModel uvm, IEnumerable<ListingViewModel> lvm, IEnumerable<NavLinkViewModel> nvm)
        {
            Account = uvm;
            Listings = lvm;
            NavLinks = nvm;
        }
        
        public UserViewModel Account { get; set; }

        public IEnumerable<ListingViewModel> Listings { get; set; }
        
        public IEnumerable<UniversityViewModel> Universities { get; set; }

        public IEnumerable<UserViewModel> Landlords { get; set; }

        public IEnumerable<NavLinkViewModel> NavLinks { get; set; }
    }
}
