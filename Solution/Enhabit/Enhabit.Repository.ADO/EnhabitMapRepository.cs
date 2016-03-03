using Enhabit.Repository.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using System.Data.SqlClient;
using System.Data;

namespace Enhabit.Repository
{
    public class EnhabitMapRepository : IEnhabitMapRepository
    {
        private readonly string _enhabitConnString;

        public SqlConnection SqlConn { get; set; }

        public EnhabitMapRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public IEnumerable<Listing> GetListings()
        {
            var listings = new List<Listing>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetListings]";
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        listings.Add(new Listing
                        {
                            Price = (int)reader["Price"],
                            Address = reader["Address"].ToString(),
                            AvailableStartDate = (DateTime)reader["StartDate"],
                            IsFeatured = (bool)reader["IsFeatured"],
                            IsActive = (bool)reader["IsActive"],
                            OwnerName = reader["OwnerName"].ToString(),
                            LandlordName = reader["LandlordName"].ToString()
                        });
                    }
                }

                return listings;
            }
        }

        public IEnumerable<Listing> SearchForListings(SearchQuery query)
        {
            var listings = new List<Listing>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetListings]";
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        listings.Add(new Listing
                        {
                            Price = (int)reader["Price"],
                            Address = reader["Address"].ToString(),
                            AvailableStartDate = (DateTime)reader["StartDate"],
                            IsFeatured = (bool)reader["IsFeatured"],
                            IsActive = (bool)reader["IsActive"],
                            OwnerName = reader["OwnerName"].ToString(),
                            LandlordName = reader["LandlordName"].ToString()
                        });
                    }
                }

                return listings;
            }
        }
    }
}
