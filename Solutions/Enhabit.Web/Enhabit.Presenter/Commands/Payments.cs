using System;
using System.Collections.Generic;
using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using System.Linq;

using Enhabit.Presenter.Extensions;

namespace Enhabit.Presenter.Commands
{
    public static class Payments
    {

        public static IEnumerable<PaymentViewModel> GetUserPayments(IPaymentRepository repo, Guid userGuid)
        {
            return repo.GetUserPayments(userGuid).Select(p => p.ToPaymentViewModel());
        }

    }
}
