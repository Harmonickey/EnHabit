using System;
using System.Collections.Generic;
using System.Linq;
using Enhabit.ViewModels;
using Enhabit.Presenter.Extensions;
using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class Renters
    {

        public static IEnumerable<RenterViewModel> GetUserRenters(IRenterRepository repo, Guid userGuid)
        {
            return repo.GetUserRenters(userGuid).Select(r => r.ToRenterViewModel());
        }

        public static bool UserHasRental(IRenterRepository repo, Guid userGuid)
        {
            return repo.UserHasRental(userGuid);
        }
    }
}
