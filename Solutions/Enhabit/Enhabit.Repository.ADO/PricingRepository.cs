using Enhabit.Repository.Contracts;
using Enhabit.Models;
using System.Data.SqlClient;

using Enhabit.Presenter.DataAdaptors;
using System;
using System.Collections.Generic;
using System.Data;

namespace Enhabit.Repository.ADO
{
    public class PricingRepository : IPricingRepository
    {
        private readonly string _enhabitConnString;

        public SqlConnection SqlConn { get; set; }

        public PricingRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public PriceRange GetPriceRange()
        {
            var priceRange = new PriceRange();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetPriceRange]";
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.HasRows && reader.Read())
                {
                    priceRange.Low = (decimal)reader["Low"];
                    priceRange.High = (decimal)reader["High"];
                }
            }

            return priceRange;
        }

    }
}
