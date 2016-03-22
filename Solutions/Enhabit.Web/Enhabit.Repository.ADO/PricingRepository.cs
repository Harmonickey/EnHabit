using Enhabit.Repository.Contracts;
using Enhabit.Models;
using System.Data.SqlClient;
using Enhabit.Presenter.DataAdaptors;
using System;
using System.Data;

namespace Enhabit.Repository.ADO
{
    public class PricingRepository : IPricingRepository
    {
        private readonly string _enhabitConnString;
        
        public PricingRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public PriceRange GetPriceRange()
        {
            var priceRange = new PriceRange();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetPriceRange]";
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        if (reader["Low"] != DBNull.Value)
                            priceRange.Low = (decimal)reader["Low"];
                        if (reader["High"] != DBNull.Value)
                            priceRange.High = (decimal)reader["High"];
                    }
                }
            }

            return priceRange;
        }

    }
}
