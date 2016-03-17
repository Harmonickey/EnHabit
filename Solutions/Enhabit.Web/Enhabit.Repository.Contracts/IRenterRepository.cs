using System;
using System.Collections.Generic;

using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IRenterRepository
    {
        IEnumerable<Renter> GetUserRenters(Guid userGuid);
    }
}
