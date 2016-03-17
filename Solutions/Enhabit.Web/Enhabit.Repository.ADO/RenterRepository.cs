using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Models;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.DataAdaptors;

namespace Enhabit.Repository.ADO
{
    public class RenterRepository : IRenterRepository
    {
        private readonly IConfigAdaptor _configAdaptor;

        public RenterRepository(IConfigAdaptor configAdaptor)
        {
            _configAdaptor = configAdaptor;
        }

        public IEnumerable<Renter> GetUserRenters(Guid userGuid)
        {
            return new List<Renter>();
        }
    }
}
