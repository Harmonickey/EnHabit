using Enhabit.Presenter.DataAdaptors;
using System;
using System.Collections.Generic;

using Enhabit.Repository.Contracts;
using System.Data.SqlClient;

namespace Enhabit.Repository.ADO
{
    public class PortalRepository : IPortalRepository
    {
        private readonly string _enhabitConnString;
        
        public SqlConnection SqlConn { get; set; }

        public PortalRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }
    }
}
