using Enhabit.ViewModels;
using Enhabit.Models;

namespace Enhabit.Presenter.Extensions
{
    public static class PaymentsExtensions
    {
        public static PaymentViewModel ToPaymentViewModel(this Payment payment)
        {
            return new PaymentViewModel();
        }
    }
}
