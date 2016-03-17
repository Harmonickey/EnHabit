using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IApplicantRepository
    {
        IEnumerable<Applicant> GetUserApplicants(Guid userGuid);
    }
}
