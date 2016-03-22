using System.Collections.Generic;
using System.Linq;

namespace Enhabit.ViewModels
{
    public class TenantViewModel : PortalViewModel
    {
        public TenantViewModel(UserViewModel uvm, IEnumerable<ListingViewModel> lvm, IEnumerable<NavLinkViewModel> nvm, IEnumerable<PaymentViewModel> pvm, bool hasRental)
            : base(uvm, lvm, nvm)
        {
            Payments = pvm;
            HasRental = hasRental;

            // if we don't have a rental with this tenant, then we don't need to show the payments tab
            if (!HasRental)
            {
                NavLinks = NavLinks.Where(n => n.Name != "Payments");
            }
        }

        public IEnumerable<PaymentViewModel> Payments { get; set; }

        public bool HasRental { get; set; }
    }
}
