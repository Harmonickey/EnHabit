using System;
using System.Collections.Generic;

using Enhabit.Models;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.DataAdaptors;

namespace Enhabit.Repository.ADO
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IConfigAdaptor _configAdaptor;

        public PaymentRepository(IConfigAdaptor configAdaptor)
        {
            _configAdaptor = configAdaptor;
        }

        public IEnumerable<Payment> GetUserPayments(Guid userGuid)
        {
            return new List<Payment>();
        }

    }
}
