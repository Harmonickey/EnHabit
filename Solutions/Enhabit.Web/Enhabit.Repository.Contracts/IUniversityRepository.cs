using System;
using System.Collections.Generic;

using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IUniversityRepository
    {
        IEnumerable<University> GetAllUniversities();

        University GetUniversity(Guid universityId);
    }
}
