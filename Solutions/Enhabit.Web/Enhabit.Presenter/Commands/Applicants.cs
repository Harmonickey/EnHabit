using Enhabit.Repository.Contracts;
using Enhabit.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

using Enhabit.Presenter.Extensions;

namespace Enhabit.Presenter.Commands
{
    public static class Applicants
    {

        public static IEnumerable<ApplicantViewModel> GetUserApplicants(IApplicantRepository repo, Guid userGuid)
        {
            return repo.GetUserApplicants(userGuid).Select(p => p.ToApplicantViewModel());
        }

    }
}
