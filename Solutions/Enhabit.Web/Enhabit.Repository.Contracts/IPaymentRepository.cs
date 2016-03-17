using System;
using System.Collections.Generic;

using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IPaymentRepository
    {
        IEnumerable<Payment> GetUserPayments(Guid userGuid);
    }
}
