using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class TenantViewModel : PortalViewModel
    {
        public TenantViewModel(UserViewModel uvm, IEnumerable<ListingViewModel> lvm, IEnumerable<PaymentViewModel> pvm)
            : base(uvm, lvm)
        {
            Payments = pvm;
        }

        public IEnumerable<PaymentViewModel> Payments { get; set; }
    }
}
