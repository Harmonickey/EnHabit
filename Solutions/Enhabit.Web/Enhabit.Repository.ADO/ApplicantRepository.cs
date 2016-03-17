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
    public class ApplicantRepository : IApplicantRepository
    {
        private readonly IConfigAdaptor _configAdaptor;

        public ApplicantRepository(IConfigAdaptor configAdaptor)
        {
            _configAdaptor = configAdaptor;
        }

        public IEnumerable<Applicant> GetUserApplicants(Guid userGuid)
        {
            return new List<Applicant>();
        }
    }
}
